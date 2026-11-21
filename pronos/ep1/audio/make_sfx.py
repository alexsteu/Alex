import numpy as np, wave
SR=44100; T=62.0; N=int(SR*T)
rng=np.random.default_rng(1)
def env(n,a=0.005,r=None):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)
    if r: e*=np.exp(-t/r)
    return e
def noise(d): return rng.uniform(-1,1,int(SR*d))
def tone(f,d,r=0.2,wave_='sine'):
    t=np.arange(int(SR*d))/SR; f=np.atleast_1d(f)
    ph=2*np.pi*np.cumsum(np.broadcast_to(f,t.shape))/SR if f.size>1 else 2*np.pi*f[0]*t
    s=np.sin(ph) if wave_=='sine' else np.sign(np.sin(ph))*0.5
    return s*env(len(t),0.003,r)
def lp(x,k):  # simple moving-average lowpass
    return np.convolve(x,np.ones(k)/k,'same')
def whoosh():
    d=0.35; n=noise(d); t=np.linspace(0,1,len(n))
    return lp(n,6)*np.sin(np.pi*t)**2*0.5
def boom():
    d=0.9; t=np.arange(int(SR*d))/SR; f=110*np.exp(-t*6)+38
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3.5)*1.0
def ding():
    return (tone(1568,0.6,0.25)+0.6*tone(2093,0.6,0.2)+0.3*tone(3136,0.6,0.1))*0.35
def cash():
    c=np.zeros(int(SR*0.7)); k=lp(noise(0.05),2)*env(int(SR*0.05),0.001,0.01)*0.6
    c[:len(k)]+=k; d=ding(); c[int(SR*0.06):int(SR*0.06)+len(d)]+=d[:len(c)-int(SR*0.06)]; return c
def slap():
    n=noise(0.12)*env(int(SR*0.12),0.0005,0.02); return lp(n,2)*0.9
def thud():
    t=np.arange(int(SR*0.25))/SR; return np.sin(2*np.pi*(90*np.exp(-t*20)+50)*t)*np.exp(-t*18)*0.8+lp(noise(0.25),12)*np.exp(-t*40)*0.3
def roll(d):
    out=np.zeros(int(SR*d)); step=int(SR*0.045)
    for i in range(0,len(out)-step,step):
        h=lp(noise(0.04),3)*env(int(SR*0.04),0.001,0.01)*(0.2+0.5*i/len(out)); out[i:i+len(h)]+=h
    return out
def scratch():
    d=0.5; t=np.arange(int(SR*d))/SR; f=300+250*np.sin(2*np.pi*7*t)
    return lp(noise(d),3)*0.3*np.abs(np.sin(2*np.pi*np.cumsum(f)/SR))*np.exp(-t*2)
def roar():
    d=1.4; t=np.arange(int(SR*d))/SR; f=70+30*np.sin(2*np.pi*3*t)
    s=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.3+lp(noise(d),20)*0.6
    return s*np.sin(np.pi*t/d)*0.7
def bleat():
    d=0.6; t=np.arange(int(SR*d))/SR; f=520+60*np.sin(2*np.pi*22*t)
    return np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.15*np.sin(np.pi*t/d)
def bugle():
    out=[]; 
    for f,d in [(392,.15),(523,.15),(659,.15),(784,.5)]:
        t=np.arange(int(SR*d))/SR; out.append((np.sign(np.sin(2*np.pi*f*t))*0.12+np.sin(2*np.pi*f*t)*0.2)*env(len(t),0.01,d))
    return np.concatenate(out)
fx=np.zeros(N)
def put(s,at,g=1.0):
    i=int(at*SR); j=min(N,i+len(s)); fx[i:j]+=s[:j-i]*g
cuts=[0,2,6,17,23,26,28,30,35,38,42,46,49,52,56,59]
for c in cuts[1:]: put(whoosh(),c-0.15,0.7)
put(boom(),0.05)
for k,a in enumerate([2.6,3.3,4.0]): put(thud(),a)
for a in [6.4,17.3,23.3,26.3,30.4,35.4,38.4,42.4,46.4,49.4]: put(cash(),a,0.8)
for k in range(6): put(slap(),31.0+k*0.55)
put(bleat(),36.6); put(bleat(),37.3,0.8)
put(roar(),38.3); 
put(bugle(),42.6)
put(roll(2.6),46.1,0.9); put(boom(),48.8)
put(boom(),28.05,0.8)
put(scratch(),59.05,1.2)
# --- music: 100 bpm light groove, minor shift at 28s, stops at 59s
mus=np.zeros(N); bpm=100; beat=60/bpm
def kick(): t=np.arange(int(SR*.2))/SR; return np.sin(2*np.pi*(120*np.exp(-t*30)+45)*t)*np.exp(-t*14)
def hat(): return lp(noise(.05),1)*np.exp(-np.arange(int(SR*.05))/SR*80)*0.25
prog_a=[(220,261.6,329.6),(196,246.9,293.7),(174.6,220,261.6),(196,246.9,293.7)]
prog_b=[(220,261.6,329.6),(174.6,220,261.6),(164.8,207.7,246.9),(164.8,207.7,246.9)]
t0=2.0; b=0
while t0<59:
    i=int(t0*SR)
    def m(s,g=1):
        j=min(N,i+len(s)); mus[i:j]+=s[:j-i]*g
    if b%4 in (0,2): m(kick(),0.9 if t0>=28 else 0.6)
    m(hat(),1)
    prog=prog_b if t0>=28 else prog_a
    if b%4==0:
        ch=prog[(b//4)%4]; d=beat*4
        for f in ch: m(tone(f,d,1.2)*0.08)
        m(tone(ch[0]/2,beat*1.5,0.4)*0.25)
    t0+=beat/2 if False else beat; b+=1
mix=mus*0.35+fx*0.6
mix/=max(1e-9,np.abs(mix).max()); mix*=0.9
for name,arr in [('sfx_musique.wav',mix)]:
    w=wave.open('/home/user/Alex/pronos/ep1/audio/'+name,'w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((arr*32767).astype(np.int16).tobytes()); w.close()
print('ok')
