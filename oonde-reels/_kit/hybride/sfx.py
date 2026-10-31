#!/usr/bin/env python3
"""Bruitages de montage synthetises (aucun credit) : whoosh, impact, riser, tick, reverse, sub-drop.
Usage: sfx.py dossier_sortie   -> ecrit whoosh.wav impact.wav riser.wav tick.wav sub.wav reverse.wav
Regle (recherche 2026-10-20) : un son = un mouvement visible, cale a la frame ; jamais le meme whoosh partout ;
silence d'une demi-seconde avant une revelation > riser."""
import sys, os, numpy as np, wave
SR=48000; out=sys.argv[1]; os.makedirs(out, exist_ok=True)
rng=np.random.default_rng(7)
def save(n, x):
    x = x/ (np.abs(x).max()+1e-9) * 0.9
    st = np.stack([x, np.roll(x, 40)], 1)  # leger elargissement stereo
    with wave.open(os.path.join(out,n),'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
def bp(x, f, q=1.0):  # passe-bande simple par FFT, f peut varier (tableau)
    X=np.fft.rfft(x); fr=np.fft.rfftfreq(len(x),1/SR); fc=np.mean(f) if np.ndim(f) else f
    X*=np.exp(-((np.log(fr+1)-np.log(fc))**2)/(2*(0.5/q)**2)); return np.fft.irfft(X,len(x))
def sweep_noise(d, f0, f1):
    n=int(d*SR); t=np.arange(n)/SR; x=rng.normal(0,1,n); y=np.zeros(n); seg=1024
    for s in range(0,n,seg):
        fc=f0*(f1/f0)**(s/n); y[s:s+seg]=bp(x[s:s+seg*2][:seg] if s+seg<=n else x[s:],fc,1.2)[:len(y[s:s+seg])]
    return y
t=lambda d: np.arange(int(d*SR))/SR
# whoosh : bruit filtre qui monte puis descend, enveloppe en cloche
d=0.55; e=np.sin(np.pi*t(d)/d)**2; save('whoosh.wav', sweep_noise(d,300,3000)*e)
# impact : sub sinus descendant + transitoire de bruit + queue
d=1.4; tt=t(d); sub=np.sin(2*np.pi*(60*tt-12*tt**2))*np.exp(-tt*3); hit=rng.normal(0,1,len(tt))*np.exp(-tt*40)
save('impact.wav', sub*1.0+bp(hit,1500,0.6)*0.6)
# riser : bruit + sinus qui montent, s'arrete net
d=2.0; tt=t(d); e=(tt/d)**2.5; save('riser.wav', (sweep_noise(d,200,6000)*0.7+np.sin(2*np.pi*(200*tt+400*tt**2))*0.3)*e)
# tick : clic UI
d=0.05; tt=t(d); save('tick.wav', np.sin(2*np.pi*2400*tt)*np.exp(-tt*150))
# sub-drop : grave qui chute (rupture de ton)
d=1.0; tt=t(d); save('sub.wav', np.sin(2*np.pi*(90*tt-35*tt**2))*np.exp(-tt*2.5))
# reverse : whoosh inverse qui aspire vers la coupe
d=0.8; tt=t(d); save('reverse.wav', (sweep_noise(d,4000,400)*(tt/d)**3))
print('ok')
