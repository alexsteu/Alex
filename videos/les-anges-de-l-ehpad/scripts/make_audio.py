"""Synthèse déterministe de la musique et des bruitages (aucun fichier externe).

Usage : python3 scripts/make_audio.py   (depuis la racine du projet)
Produit assets/sfx/*.wav et assets/music/bed.wav.
"""
import os

import numpy as np
import soundfile as sf

SR = 44100
rng = np.random.default_rng(1987)  # graine fixe → fichiers reproductibles
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def save(rel, x):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sf.write(path, x.astype(np.float32), SR)


def fades(x, fin=0.005, fout=0.02):
    n_in, n_out = int(SR * fin), int(SR * fout)
    x = x.copy()
    if n_in:
        x[:n_in] *= np.linspace(0, 1, n_in)
    if n_out:
        x[-n_out:] *= np.linspace(1, 0, n_out)
    return x


def lowpass(x, alpha):
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


# --- Bip de censure (1 kHz, le classique télé) ---
t = t_axis(0.42)
save("assets/sfx/bleep.wav", fades(0.55 * np.sin(2 * np.pi * 1000 * t), 0.004, 0.01))

# --- Whoosh (bruit filtré qui monte puis retombe) ---
t = t_axis(0.55)
noise = rng.standard_normal(len(t))
env = np.sin(np.pi * np.clip(t / 0.55, 0, 1)) ** 2
lp = lowpass(noise, 0.18)
save("assets/sfx/whoosh.wav", norm((noise - lp) * 0.5 * env + lp * env, 0.6))

# --- Boom (impact grave, pour les titres) ---
t = t_axis(1.6)
f = 38 + 90 * np.exp(-t * 9)
phase = 2 * np.pi * np.cumsum(f) / SR
boom = np.sin(phase) * np.exp(-t * 2.6)
boom += 0.25 * rng.standard_normal(len(t)) * np.exp(-t * 40)
save("assets/sfx/boom.wav", fades(norm(np.tanh(boom * 2.2), 0.95), 0.001, 0.1))

# --- « Dun dun DUUUN » (cuivres dramatiques) ---
def brass(freq, sec, decay):
    tt = t_axis(sec)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt) * np.clip(tt * 3, 0, 1)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    sig = sum(np.sin(k * ph) / k ** 0.9 for k in range(1, 9))
    attack = np.clip(tt / 0.03, 0, 1)
    return np.tanh(1.6 * sig) * attack * np.exp(-tt * decay)


dun = np.zeros(int(SR * 3.0))
for start, fr, sec, dec in [(0.0, 146.8, 0.32, 5), (0.36, 138.6, 0.32, 5), (0.72, 130.8, 2.2, 0.9)]:
    seg = fades(brass(fr, sec, dec), 0.002, 0.05)
    i = int(SR * start)
    dun[i : i + len(seg)] += seg
save("assets/sfx/dun-dun-dun.wav", norm(dun, 0.85))

# --- Scratch de vinyle (« … non, il dort ») ---
t = t_axis(0.6)
wob = 900 + 700 * np.sin(2 * np.pi * 6 * t) * np.exp(-t * 2)
ph = 2 * np.pi * np.cumsum(wob) / SR
scr = 0.6 * np.sign(np.sin(ph)) * np.exp(-t * 3) + 0.3 * rng.standard_normal(len(t)) * np.exp(-t * 6)
save("assets/sfx/scratch.wav", fades(norm(lowpass(scr, 0.35), 0.6), 0.002, 0.05))

# --- Tampon (« ÉLIMINÉ ? », pastilles du casting) ---
t = t_axis(0.35)
f = 70 + 160 * np.exp(-t * 30)
stamp = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
stamp += 0.4 * rng.standard_normal(len(t)) * np.exp(-t * 90)
save("assets/sfx/stamp.wav", fades(norm(stamp, 0.8), 0.001, 0.03))

# --- Ding (sonnette de résidence / fin) ---
t = t_axis(1.4)
ding = sum(np.sin(2 * np.pi * 1318.5 * k * t) * np.exp(-t * (3 + k)) / k for k in (1, 2.76, 5.4))
save("assets/sfx/ding.wav", fades(norm(ding, 0.5), 0.002, 0.1))

# --- Musique : boucle « tension télé-réalité », 100 BPM, la mineur, 50 s ---
BPM, LEN = 100.0, 50.0
beat = 60.0 / BPM
t = t_axis(LEN)
bed = np.zeros_like(t)

# Kick sur chaque temps
tb = np.mod(t, beat)
kf = 45 + 110 * np.exp(-tb * 35)
bed += 0.9 * np.sin(2 * np.pi * kf * tb) * np.exp(-tb * 9)

# Charley sur les croches (bruit aigu court), plus fort à contretemps
te = np.mod(t, beat / 2)
hat_noise = rng.standard_normal(len(t))
hat_noise -= lowpass(hat_noise, 0.5)
accent = np.where(np.mod(np.floor(t / (beat / 2)), 2) == 1, 1.0, 0.55)
bed += 0.22 * hat_noise * np.exp(-te * 70) * accent

# Basse pulsée : la – la – fa – sol (une note par mesure)
bar = beat * 4
roots = [55.0, 55.0, 43.65, 49.0]
idx = (np.floor(t / bar).astype(int)) % len(roots)
bf = np.array(roots)[idx]
bph = 2 * np.pi * np.cumsum(bf) / SR
pulse = np.exp(-np.mod(t, beat / 2) * 6)
bed += 0.45 * np.tanh(2.5 * np.sin(bph)) * pulse

# Nappe : accord mineur avec respiration lente
pad = np.zeros_like(t)
for mult in (2.0, 2.378, 2.997):  # fondamentale, tierce mineure, quinte
    pad += np.sin(2 * np.pi * np.cumsum(bf * mult) / SR)
bed += 0.08 * pad * (0.6 + 0.4 * np.sin(2 * np.pi * t / (bar * 2)))

# Pizzicato « suspense » sur la double croche de chaque fin de mesure
ts = np.mod(t - (bar - beat / 2), bar)
pz = np.sin(2 * np.pi * bf * 8 * ts) * np.exp(-ts * 18) * (ts < 0.4)
bed += 0.2 * pz

bed = norm(np.tanh(bed * 0.9), 0.8)
bed[: int(SR * 0.3)] *= np.linspace(0, 1, int(SR * 0.3))
bed[-int(SR * 1.5) :] *= np.linspace(1, 0, int(SR * 1.5))
save("assets/music/bed.wav", bed)

print("ok")
