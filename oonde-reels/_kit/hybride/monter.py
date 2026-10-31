#!/usr/bin/env python3
"""Monteur 9:16 pilote par un JSON : plans, textes, transitions « zoom punch », sons.
Usage: monter.py plan.json out.mp4
plan.json = {"fps":30, "plans":[{"src":"a.mp4","in":0.0,"out":3.5,"grade":"ffmpeg filter optionnel"}...],
 "textes":[{"t":"Ce café","font":"cormorant-garamond-latin-400-italic.woff2","size":84,"y":1180,"t0":0.3,"t1":3.2,"color":[255,255,255]}],
 "transitions":{"punch":0.2}, "sons":[{"wav":"impact.wav","t":3.4,"gain":0.8}], "musique":"bed.wav"}
Textes : fondu + montee de 18 px, ombre douce. Zone sure : y entre 260 et 1500, x marge 90."""
import sys, json, os, subprocess, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
P=json.load(open(sys.argv[1])); OUT=sys.argv[2]; FPS=P.get('fps',30); W,H=1080,1920
FD=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','fonts')
base=os.path.dirname(os.path.abspath(sys.argv[1]))
def rd(p): return p if os.path.isabs(p) else os.path.join(base,p)
def load(pl):
    tmp=rd(pl['src'])+'.norm.mp4'
    vf=(pl.get('grade','')+',' if pl.get('grade') else '')+f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},unsharp=5:5:0.4,fps={FPS}"
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(pl.get('in',0)),'-to',str(pl['out']),'-i',rd(pl['src']),'-vf',vf,'-an','-c:v','libx264','-crf','12','-preset','fast',tmp],check=True)
    cap=cv2.VideoCapture(tmp); fr=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        fr.append(f)
    return fr
seqs=[load(p) for p in P['plans']]
pn=int(P.get('transitions',{}).get('punch',0.2)*FPS)
def zoom(f,s,blur):
    acc=np.zeros_like(f,dtype=np.float32); n=6 if blur else 1
    for k in range(n):
        z=s*(1+0.04*k*blur); M=cv2.getRotationMatrix2D((W/2,H/2),0,z); acc+=cv2.warpAffine(f,M,(W,H),borderMode=cv2.BORDER_REFLECT)
    return (acc/n).astype(np.uint8)
frames=[]
for si,sq in enumerate(seqs):
    for i,f in enumerate(sq):
        if si<len(seqs)-1 and i>=len(sq)-pn:   # sortie : on fonce dans l'image
            u=(i-(len(sq)-pn)+1)/pn; f=zoom(f,1+0.5*u**2,u)
        if si>0 and i<pn:                        # entree : on atterrit
            u=1-i/pn; f=zoom(f,1+0.35*u**2,u)
        frames.append(f)
# textes
cache={}
def txt(T):
    k=json.dumps(T,sort_keys=True)
    if k in cache: return cache[k]
    font=ImageFont.truetype(os.path.join(FD,T.get('font','instrument-sans-latin-600-normal.woff2')),T.get('size',64))
    im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im)
    lines=T['t'].split('\n'); y=T.get('y',1200)
    for ln in lines:
        tw=d.textlength(ln,font=font); d.text(((W-tw)/2,y),ln,font=font,fill=tuple(T.get('color',[255,255,255]))+(255,)); y+=int(T.get('size',64)*1.2)
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); sh.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(14)).point(lambda v:int(v*0.55)))
    out=Image.alpha_composite(sh,im); cache[k]=np.array(out); return cache[k]
for T in P.get('textes',[]):
    if 'img' in T: 
        im=Image.open(rd(T['img'])).convert('RGBA'); c=Image.new('RGBA',(W,H),(0,0,0,0)); c.paste(im,((W-im.width)//2,T.get('y',1200)),im); arr=np.array(c)
    else: arr=txt(T)
    a0,a1=int(T['t0']*FPS),int(T['t1']*FPS)
    for i in range(a0,min(a1,len(frames))):
        u=min(1,(i-a0)/(0.3*FPS)); v=min(1,(a1-i)/(0.2*FPS)); op=min(u,v); dy=int(18*(1-u)**2)
        lay=np.roll(arr,dy,axis=0); al=lay[...,3:4].astype(np.float32)/255*op
        rgb=lay[...,:3][...,::-1].astype(np.float32)
        frames[i]=(frames[i]*(1-al)+rgb*al).astype(np.uint8)
tmp=OUT+'.avi'; vw=cv2.VideoWriter(tmp,cv2.VideoWriter_fourcc(*'MJPG'),FPS,(W,H))
for f in frames: vw.write(f)
vw.release(); dur=len(frames)/FPS
# audio : musique + sons places
SR=48000; mix=np.zeros((int(dur*SR)+SR,2))
import wave
def rw(p):
    w=wave.open(rd(p)); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).reshape(-1,w.getnchannels()).astype(np.float32)/32767
    return x if x.shape[1]==2 else np.repeat(x,2,1)
if P.get('musique'): m=rw(P['musique'])[:len(mix)]; mix[:len(m)]+=m*P.get('musique_gain',0.5)
for s in P.get('sons',[]):
    x=rw(s['wav'])*s.get('gain',0.8); a=int(s['t']*SR); mix[a:a+len(x)]+=x[:len(mix)-a]
mix=mix[:int(dur*SR)]; mix/=max(1,np.abs(mix).max()/0.95)
with wave.open(OUT+'.wav','wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-v','error','-y','-i',tmp,'-i',OUT+'.wav','-c:v','libx264','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af','loudnorm=I=-14:TP=-1','-shortest',OUT],check=True)
os.remove(tmp); os.remove(OUT+'.wav'); print('ok',OUT,f'{dur:.2f}s')
