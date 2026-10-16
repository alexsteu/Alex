"""Reel 20 « Swipe » : rythmique 120 bpm + swipes + match + voix off. python3 audio.py voix.wav mix.wav"""
import sys, wave, subprocess, numpy as np
SR=48000; DUR=24.65/1.05; N=int(SR*DUR)
rng=np.random.default_rng(20)
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


S=1.05
def R(x): return x/S          # temps de la prise brute -> temps vidéo
T=dict(swipe=2.00,c1=2.54,pas=3.20,g1=4.08,c2=4.72,menu=5.32,pdf=5.90,g2=6.72,c3=7.36,cons=8.08,dep=9.06,g3=9.92,
 lui=10.56,hor=11.08,pho=11.76,wa4=12.44,match=13.40,site=14.50,onte=15.04,maq=15.82,grat=16.24,vois=16.88,
 alors=18.10,gauche=19.20,droite=19.74,dis=20.44,ecris=21.38,maquette=22.04,wa=22.40,wipe=24.30)
T={k:R(v) for k,v in T.items()}
B=60/120; notes=[55,55,65.4,49]
mute=[(T['match']-.45,T['match']+.3)]
t=0.0; k=0
while t<T['wipe']-.2:
    if not any(a<=t<b for a,b in mute):
        full=t>=T['site']
        add(M,kick(),t,.85)
        if k%2==1: add(M,clap(),t,.5)
        add(M,hat(),t+B/2,.5)
        if full: add(M,hat(),t+B/4,.25); add(M,hat(),t+3*B/4,.25)
        add(M,bass(notes[(k//4)%4]*(1.5 if full else 1),.45),t,.55)
    t+=B; k+=1
# frame 0 : petit coup d'ouverture
add(FX,hit(),0.0,.35); add(FX,whoosh(.3,False),0.0,.4)
for i in range(2): add(FX,whoosh(.22,i==0),T['swipe']+i*.3,.3)
for g in ('g1','g2','g3'):
    add(FX,whoosh(.35,False),T[g]+.25,.5); add(BZ,kick(),T[g],.55); add(FX,tick(900,.7),T[g]); add(FX,flip(),T[g]+.6,1)
for k2 in ('pas','pdf','dep'): add(FX,tick(1600,.8),T[k2]); add(FX,tick(2400,.6),T[k2]+.06)
for i,k2 in enumerate(('hor','pho','wa4')): add(FX,tick(1400+400*i,.8),T[k2]-.05); add(FX,whoosh(.18),T[k2]-.12,.15)
m=T['match']
for i in range(5): add(FX,tick(700+80*i,.3),m-.45+i*.08)
add(FX,whoosh(.35),m+.1,.5); add(BZ,ding(),m+.3,.45); add(BZ,hit(),m+.3,.45)
for i in range(3): add(FX,tick(2600,.4),m+.68+i*.16)
add(FX,whoosh(.4),T['site']-.1,.45); add(FX,hit(),T['site']+.05,.35)
add(FX,tick(2200,.7),T['grat']-.05)
add(FX,whoosh(.3,False),T['vois'],.35); add(FX,tick(2200,.7),T['vois']+.16)
add(FX,whoosh(.35,False),T['alors']-.1,.35); add(FX,hit(),T['alors']+.05,.4)
add(FX,tick(900,.8),T['gauche']); add(FX,tick(2600,.8),T['droite'])
add(FX,tick(1500,.7),T['dis']-.05)
add(FX,whoosh(.35),T['ecris']-.15,.4); add(FX,hit(),T['ecris'],.4)
for tt in (.1,.7,1.3): add(FX,tick(1800,.6),T['wa']+tt)
add(FX,whoosh(.35),T['wipe']-.05,.4)
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
