#!/usr/bin/env python3
"""Ajoute le reflet d'une lumiere incrustee sur un sol mouille/brillant (le detail qui rend un FOOH credible).
Usage: reflet.py avant.mp4 apres.mp4 out.mp4 apres.mp4.track.json [force 0.45]
avant = plan sans l'effet, apres = sortie de track.py ; le reflet = (apres - avant) retourne sous la base du calque."""
import sys, json, numpy as np, cv2, os
A,B,O,J=sys.argv[1:5]; k=float(sys.argv[5]) if len(sys.argv)>5 else 0.45
tr=json.load(open(J)); C0=np.float32(tr['corners'])
ca,cb=cv2.VideoCapture(A),cv2.VideoCapture(B); fps=cb.get(5); W=int(cb.get(3)); H=int(cb.get(4))
vw=cv2.VideoWriter(O+'.avi',cv2.VideoWriter_fourcc(*'MJPG'),fps,(W,H)); i=0
while True:
    oa,fa=ca.read(); ob,fb=cb.read()
    if not(oa and ob): break
    Hm=np.float32(tr['H'][min(i,len(tr['H'])-1)])
    Ci=cv2.perspectiveTransform(C0.reshape(-1,1,2),Hm).reshape(-1,2); base=int(max(Ci[2,1],Ci[3,1]))
    light=np.clip(fb.astype(np.float32)-fa.astype(np.float32),0,255)
    top=light[max(0,2*base-H):base][::-1]           # miroir autour de la base
    refl=np.zeros_like(light); refl[base:base+len(top)]=top
    refl=cv2.GaussianBlur(refl,(0,0),sigmaX=6,sigmaY=22)             # sol mouille : etire verticalement
    ramp=np.clip(1-(np.arange(H)-base)/(H*0.45),0,1)[:,None,None]; ramp[:base]=0
    gl=cv2.cvtColor(fa,cv2.COLOR_BGR2GRAY).astype(np.float32)/255     # plus fort sur les zones deja brillantes (flaques)
    m=(0.35+gl*1.3)[...,None]
    out=np.clip(fb+refl*ramp*m*k,0,255).astype(np.uint8); vw.write(out); i+=1
vw.release(); os.system(f"ffmpeg -v error -y -i '{O}.avi' -c:v libx264 -crf 16 -pix_fmt yuv420p '{O}' && rm '{O}.avi'"); print('ok',i)
