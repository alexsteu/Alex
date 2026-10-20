# Reel 36 : bruitages synthétisés (pluie, carillon, clac, tap, pops, anneaux), en temps du contenu
# (avant les deux coupes du montage). Usage : python3 sfx.py out.wav DUR
import sys, wave
import numpy as np
out, DUR = sys.argv[1], float(sys.argv[2])
SR = 48000; n = int(SR * DUR); t = np.arange(n) / SR; L = np.zeros(n); R = np.zeros(n)
rng = np.random.default_rng(36)

def lp(x, a):  # passe-bas 1 pôle
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y

def add(sig, at, g=1.0, pan=0.0):
    i0 = int(at * SR); m = min(len(sig), n - i0)
    if m <= 0: return
    L[i0:i0 + m] += sig[:m] * g * (1 - max(0, pan)); R[i0:i0 + m] += sig[:m] * g * (1 + min(0, pan))

# pluie 0 → 6,55 (coupée net au clac), plus sourde une fois « entré » (3,6 →)
rain_n = int(6.55 * SR)
for ch in (L, R):
    w = rng.standard_normal(rain_n)
    hi = w - lp(w, 0.35)                                   # grésillement
    drops = (rng.random(rain_n) < 0.0009) * rng.standard_normal(rain_n) * 3
    drops = lp(drops, 0.5)
    rt = np.arange(rain_n) / SR
    env = np.clip(rt / 0.3, 0, 1) * (1 - 0.65 * np.clip((rt - 3.4) / 0.6, 0, 1))
    ch[:rain_n] += (0.05 * hi + 0.08 * drops) * env

# ambiance intérieure chaude 3,6 → 6,55 (bourdon doux)
a0, a1 = int(3.6 * SR), int(6.55 * SR); at = t[a0:a1] - 3.6
hum = (np.sin(2 * np.pi * 110 * at) + .5 * np.sin(2 * np.pi * 165 * at)) * 0.015 * np.clip(at / 0.6, 0, 1)
L[a0:a1] += hum; R[a0:a1] += hum

def bell(f, d=1.6):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * 2.76 * f * x) * np.exp(-x / .15)) * np.exp(-x / .45) * np.minimum(1, x / .002)

add(bell(1318.5), 3.45, .16, -.2); add(bell(1046.5), 3.62, .14, .2)   # carillon de porte

# clac 6,55 : transitoire sec + petit grave
x = np.arange(int(.12 * SR)) / SR
clac = rng.standard_normal(len(x)) * np.exp(-x / .006) * .9 + np.sin(2 * np.pi * 90 * x) * np.exp(-x / .03) * .8
add(clac, 6.55, .55)

# souffle du rétrécissement 6,6 → 7,1
x = np.arange(int(.55 * SR)) / SR
wsh = rng.standard_normal(len(x)); wsh = lp(wsh, .08) * np.sin(np.pi * x / .55) ** 2
add(wsh, 6.6, .35)

def tick(f=1800, d=.05, g=1.0):
    x = np.arange(int(d * SR)) / SR
    return g * np.sin(2 * np.pi * f * x) * np.exp(-x / .012) * np.minimum(1, x / .001)

for a in (8.4, 10.2, 12.0): add(tick(1400, .08), a, .18)          # mots-clés
add(tick(2600, .04) + tick(900, .04), 12.85, .3)                 # tap sur Itinéraire
add(tick(700, .12), 13.65, .22); add(tick(1100, .1), 13.75, .12)   # fiche Google
add(tick(1500, .07), 17.3, .16); add(tick(1900, .07), 17.5, .14) # OUI / NON

# anneaux de fin 18,5 : petit « ding » sourd
x = np.arange(int(1.4 * SR)) / SR
add(np.sin(2 * np.pi * 587.3 * x) * np.exp(-x / .5) * np.minimum(1, x / .01), 18.5, .12)

# la pluie revient sur la boucle (fin du contenu, 0,4 s) pour rejoindre l'image 0
r0 = int((DUR - .4) * SR)
for ch in (L, R):
    w = rng.standard_normal(n - r0); ch[r0:] += 0.05 * (w - lp(w, 0.35)) * np.linspace(0, 1, n - r0)
st = np.stack([L, R], 1); st = st / max(1e-9, np.abs(st).max()) * 0.5
w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()
