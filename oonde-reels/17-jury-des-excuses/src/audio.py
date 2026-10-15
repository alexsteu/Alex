"""Reel 17 : rythmique 118 bpm + buzzers + bruitages + voix off. python3 audio.py voix.wav mix.wav"""
import sys, wave, subprocess, numpy as np
SR=48000; DUR=23.80; N=int(SR*DUR)
rng=np.random.default_rng(17)
M=np.zeros(N); FX=np.zeros(N); BZ=np.zeros(N)
def add(buf,sig,t,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig))
    if j>i and i>=0: buf[i:j]+=g*sig[:j-i]
def env(n,a=.002,tau=.1):
    t=np.arange(n)/SR; e=np.exp(-t/tau); k=max(1,int(a*SR)); e[:k]*=np.linspace(0,1,k); return e
def kick():
    n=int(.35*SR); t=np.arange(n)/SR; f=45+110*np.exp(-t/.03)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.001,.12)
def clap():
    n=int(.25*SR); x=rng.standard_normal(n)
    x=np.convolve(x,np.ones(6)/6,'same')-np.convolve(x,np.ones(40)/40,'same')
    e=env(n,.001,.06)
    for d in (.0,.012,.024): e+=np.roll(env(n,.001,.012),int(d*SR))*.6
    return x*e*.6
def hat():
    n=int(.05*SR); x=rng.standard_normal(n); x=x-np.convolve(x,np.ones(4)/4,'same'); return x*env(n,.0005,.012)*.35
def bass(f,d):
    n=int(d*SR); t=np.arange(n)/SR; s=np.sin(2*np.pi*f*t)+.3*np.sin(4*np.pi*f*t)
    return s*np.minimum(1,t/.005)*np.exp(-t/.25)*.5
def whoosh(d=.35,up=True):
    n=int(d*SR); x=rng.standard_normal(n); out=np.zeros(n); a=0.0
    fc=np.linspace(.02,.25,n) if up else np.linspace(.25,.02,n)
    for i in range(n): a+=fc[i]*(x[i]-a); out[i]=a
    return out*np.sin(np.pi*np.linspace(0,1,n))**2*1.6
def tick(f=2400,g=.5):
    n=int(.03*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*env(n,.0005,.006)*g
def buzzer(d=.5):
    n=int(d*SR); t=np.arange(n)/SR
    s=np.zeros(n)
    for f in (98,103.5,147):  # sawtooth grave désaccordé
        s+=2*((t*f)%1)-1
    s=np.tanh(s*1.5)*.5
    am=.75+.25*np.sign(np.sin(2*np.pi*30*t))
    e=np.minimum(1,t/.008)*np.minimum(1,(d-t)/.06)
    return s*am*e
def ding():
    n=int(1.2*SR); t=np.arange(n)/SR
    s=sum(a*np.sin(2*np.pi*f*t)*np.exp(-t/tau) for f,a,tau in ((880,1,.6),(1320,.5,.4),(1760,.3,.25),(2640,.15,.15)))
    s2=sum(a*np.sin(2*np.pi*f*t)*np.exp(-t/tau) for f,a,tau in ((1318.5,1,.6),(1977,.5,.4)))
    out=s*.5; k=int(.09*SR); out[k:]+=s2[:n-k]*.5; return out*np.minimum(1,t/.002)
def hit(): return kick()*1.2+np.pad(clap(),(0,int(.35*SR)-int(.25*SR)))*.8
def flip():
    n=int(.02*SR); x=rng.standard_normal(n); return np.convolve(x,np.ones(3)/3,'same')*env(n,.0005,.004)*.6

B=60/118; notes=[55,55,65.4,49]
BUZZ=[3.02,7.98,11.12]; CEL=14.40; ONTE=14.86
mute=[(13.70,ONTE)]
t=0.0; k=0
while t<23.3:
    if not any(a<=t<b for a,b in mute):
        add(M,kick(),t,.85)
        if k%2==1: add(M,clap(),t,.5)
        add(M,hat(),t+B/2,.5)
        if t>=ONTE: add(M,hat(),t+B/4,.25); add(M,hat(),t+3*B/4,.25)
        add(M,bass(notes[(k//4)%4]*(1.5 if t>=ONTE else 1),.45),t,.55)
    t+=B; k+=1
# accroche : test des lumières
for j in range(3): add(FX,tick(1800+300*j,.7),.30+j*.16)
for b in BUZZ:
    add(BZ,buzzer(.5),b,.55); add(BZ,kick(),b,.5)
for q in (1.10,3.96,8.90,12.22): add(FX,whoosh(.3),q-.15,.3)
for d in (2.20,5.48,9.63): add(FX,whoosh(.3),d-.15,.2)
for n in (3.40,8.28,11.56): add(FX,tick(1600,.8),n); add(FX,tick(2400,.6),n+.06)
for i in range(10): add(FX,flip(),2.80+i*.024)
for i in range(18): add(FX,tick(3000,.25),5.63+i*.045)          # frappe recherche
add(FX,tick(1200,.7),6.40); add(FX,tick(1200,.7),6.62)
for i in range(10): add(FX,tick(2000,.45),9.76+i*.098)           # chrono
for i in range(8): add(FX,tick(3000,.25),10.05+i*.05)
add(FX,tick(1500,.8),10.70)
# excuse 4 : suspense puis acceptée
for i in range(6): add(FX,tick(700+60*i,.3),13.75+i*.1)
add(BZ,ding(),CEL,.35); add(BZ,hit(),CEL,.3)
add(FX,whoosh(.4),ONTE-.1,.45); add(FX,hit(),ONTE+.05,.35)
for i in range(4): add(FX,tick(1800,.5),ONTE+.3+i*.16)
add(FX,hit(),15.80,.5)                                            # « Gratuite. »
add(FX,whoosh(.3,False),16.54,.35); add(FX,tick(2200,.7),16.70)   # notification
for i in range(4): add(FX,whoosh(.2),17.66+i*.12,.2)
add(FX,tick(1500,.8),18.84)
add(FX,whoosh(.35,False),19.82,.4); add(FX,hit(),20.12,.4)
for tt in (20.74,21.34,21.94): add(FX,tick(1800,.6),tt)
add(FX,ding(),22.65,.35)
v=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,np.float32)
V=np.zeros(N); V[:min(N,len(v))]=v[:N]
ev=np.convolve(np.abs(V),np.ones(2400)/2400,'same'); duck=1-.75*np.clip(ev/(ev.max()*.15),0,1)
duck=np.convolve(duck,np.ones(4800)/4800,'same')
fxd=1-.7*np.clip(ev/(ev.max()*.15),0,1)
mix=V*1.0+M*duck*.22+FX*fxd*.4+BZ*(1-.5*np.clip(ev/(ev.max()*.15),0,1))*.5
fe=int(.3*SR); mix[-fe:]*=np.linspace(1,0,fe)
st=np.stack([mix,mix],1); st=st/max(1e-9,np.abs(st).max())*.89
w=wave.open(sys.argv[2],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes()); w.close(); print('ok',DUR)
