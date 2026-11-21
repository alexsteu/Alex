import subprocess as sp, json, numpy as np, wave
V='voix/complet.mp3'; F='/usr/share/fonts/opentype/inter'
# (clip vidéo, [(début,fin) voix], titre, couleur, pari, cote)
G,O,R,K='&H0054B91D','&H00008AFF','&H003539E5','&H00000000'
P=[('01',[(17.3,21.9)],"47 DÉFAITES D'AFFILÉE",K,None,None),
('02',[(25.3,31.5)],"3 TICKETS",K,"FACILE · COSTAUD · FOU",None),
('03',[(68.0,74.6),(79.5,86.4),(103.5,107.1)],"TICKET FACILE",G,"REAL GAGNE","1,40"),
('04',[(112.4,119.5),(122.3,128.3)],"TICKET COSTAUD",O,"CITY GAGNE","1,60"),
('05',[(169.0,174.2)],"TICKET COSTAUD",O,"ARSENAL GAGNE","1,65"),
('07',[(349.3,352.1)],"TICKET FOU",R,"LA VILLA OU LE RSA",None),
('08',[(375.3,382.1),(383.6,387.7)],"TICKET FOU",R,"PSG GAGNE","1,45"),
('09',[(412.9,418.8)],"TICKET FOU",R,"BARÇA GAGNE À SABAH","1,20"),
('10',[(460.5,469.1)],"TICKET FOU",R,"LILLE-BAYERN +3,5 BUTS","2,10"),
('11',[(474.8,481.3)],"TICKET FOU",R,"LIVERPOOL GAGNE","1,75"),
('12',[(514.3,519.6)],"TICKET FOU",R,"MBAPPÉ BUTEUR","1,50"),
('13',[(523.5,530.6)],"COMBINÉ x5",R,"COTE TOTALE","~9,6"),
('14',[(570.0,575.0)],"TON TICKET EN COMMENTAIRE",K,None,None),
('15',[(575.0,580.5)],"TON TICKET EN COMMENTAIRE",K,None,None)]
CLEAN="highpass=f=90,afftdn=nf=-28,silenceremove=stop_periods=-1:stop_duration=0.25:stop_threshold=-38dB,rubberband=pitch=0.92:formant=preserved,acompressor=threshold=-20dB:ratio=4:attack=5:release=80:makeup=4,equalizer=f=3500:t=q:w=1:g=3,loudnorm=I=-14:TP=-1.5"
DICT=",rubberband=pitch=0.8,aecho=0.8:0.6:120:0.35"
def run(c): sp.run(c,check=True)
durs=[]
for n,(clip,parts,*_) in enumerate(P):
    ins=[];fl=''
    for i,(a,b) in enumerate(parts):
        ins+=['-ss',str(a),'-to',str(b),'-i',V]; fl+=f'[{i}:a]'
    af=CLEAN+(DICT if clip=='12' else '')
    run(['ffmpeg','-nostdin','-y','-loglevel','error',*ins,'-filter_complex',f'{fl}concat=n={len(parts)}:v=0:a=1,{af},apad=pad_dur=0.15','-ar','44100','-ac','1',f'voix/v{n:02d}.wav'])
    d=float(sp.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'voix/v{n:02d}.wav'],capture_output=True,text=True).stdout)
    durs.append(d)
    run(['ffmpeg','-nostdin','-y','-loglevel','error','-i',f'clips/{clip}.mp4','-filter_complex',
      f'[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1,loop=loop=3:size=300,setpts=PTS*{max(1,d/10):.3f},scale=-2:1920,crop=1080:1920,fps=30,trim=duration={d:.3f}',
      '-an','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p',f'voix/s{n:02d}.mp4'])
# blooper + mention légale 3 s
run(['ffmpeg','-nostdin','-y','-loglevel','error','-i','clips/16.mp4','-vf','scale=-2:1920,crop=1080:1920,fps=30,trim=duration=3','-an','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','voix/s99.mp4'])
open('voix/cv.txt','w').write(''.join(f"file s{n:02d}.mp4\n" for n in range(len(P)))+"file s99.mp4\n")
open('voix/ca.txt','w').write(''.join(f"file v{n:02d}.wav\n" for n in range(len(P))))
run(['ffmpeg','-nostdin','-y','-loglevel','error','-f','concat','-safe','0','-i','voix/cv.txt','-c','copy','voix/video.mp4'])
run(['ffmpeg','-nostdin','-y','-loglevel','error','-f','concat','-safe','0','-i','voix/ca.txt','voix/voix.wav'])
T=sum(durs)+3; starts=np.cumsum([0]+durs)
# sous-titres
def t(s): return f"{int(s//3600)}:{int(s%3600//60):02d}:{s%60:05.2f}"
POP=r"\fscx0\fscy0\t(0,140,\fscx112\fscy112)\t(140,240,\fscx100\fscy100)"
hdr=open('subs.ass').read().split('[Events]')[0]+"[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
ev=[]
for (clip,parts,ti,ct,p,c),a,d in zip(P,starts,durs):
    b=a+d; ev.append(f"Dialogue: 0,{t(a)},{t(b)},Titre,,0,0,0,,{{\\3c{ct}\\frz-2{POP}}}{ti}")
    if p: ev.append(f"Dialogue: 1,{t(a+0.25)},{t(b)},Pari,,0,0,0,,{{\\frz2{POP}}}"+(p if not c else f"{p}  {{\\c{ct}}}@ {c}"))
e=T-3; ev.append(f"Dialogue: 0,{t(e)},{t(T)},Titre,,0,0,0,,{{\\3c{K}{POP}}}18+  ·  COTES INDICATIVES")
ev.append(f"Dialogue: 0,{t(e)},{t(T)},Legal,,0,0,0,,Jouer comporte des risques : endettement, isolement, dépendance.\\NPour être aidé, appelez le 09 74 75 13 13 (appel non surtaxé).")
open('voix/subs2.ass','w').write(hdr+"\n".join(ev)+"\n")
# bruitages + musique sur la nouvelle durée
src=open('audio/make_sfx.py').read().split('fx=np.zeros')[0].replace('T=62.0',f'T={T:.2f}')
g={}; exec(src,g); SR,N=g['SR'],g['N']; fx=np.zeros(N)
def put(s,at,gn=1.0):
    i=int(at*SR); j=min(N,i+len(s)); fx[i:j]+=s[:j-i]*gn
for s in starts[1:]: put(g['whoosh'](),s-0.15,0.6)
put(g['boom'](),0.05)
for (clip,parts,ti,ct,p,c),a in zip(P,starts):
    if c: put(g['cash'](),a+0.25,0.7)
    if clip=='08':
        for k in range(6): put(g['slap'](),a+0.8+k*0.5)
    if clip=='09': put(g['bleat'](),a+1.5)
    if clip=='10': put(g['roar'](),a+0.3)
    if clip=='11': put(g['bugle'](),a+0.2)
    if clip=='12': put(g['roll'](1.8),a,0.8)
put(g['scratch'](),T-3,1.2)
rng=np.random.default_rng(2)
def kick():
    t=np.arange(int(SR*.2))/SR; return np.sin(2*np.pi*(120*np.exp(-t*30)+45)*t)*np.exp(-t*14)
def hat():
    return rng.uniform(-1,1,int(SR*.05))*np.exp(-np.arange(int(SR*.05))/SR*80)*0.25
g['kick']=kick; g['hat']=hat
mus=np.zeros(N); beat=0.6; tt=0.0; b=0; fou=starts[5]
while tt<T-3:
    i=int(tt*SR)
    for s,gn in ([(g['kick'](),0.8 if tt>=fou else 0.5)] if b%2==0 else [])+[(g['hat'](),1)]:
        j=min(N,i+len(s)); mus[i:j]+=s[:j-i]*gn
    tt+=beat; b+=1
bg=mus*0.25+fx*0.55; bg/=max(1e-9,np.abs(bg).max()); bg*=0.6
w=wave.open('voix/bg.wav','w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((bg*32767).astype(np.int16).tobytes()); w.close()
run(['ffmpeg','-nostdin','-y','-loglevel','error','-i','voix/video.mp4','-i','voix/voix.wav','-i','voix/bg.wav','-filter_complex',
 "[2:a][1:a]sidechaincompress=threshold=0.04:ratio=6:attack=10:release=300[d];[1:a]anull[v];[v][d]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.95[a];[0:v]ass=voix/subs2.ass:fontsdir="+F+"[vv]",
 '-map','[vv]','-map','[a]','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-shortest','episode1-final.mp4'])
print(f"durée {T:.1f}s")
