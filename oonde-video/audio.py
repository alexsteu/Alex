"""Musique + sound design synthétisés (numpy uniquement), calés sur la timeline de index.html.

    python3 audio.py  → audio.wav (44,1 kHz, stéréo, 15 s)
"""
import math
import wave

import numpy as np

SR = 44100
DUR = 15.0
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    sig = sig[: N - i0]
    gl, gr = gain * math.cos((pan + 1) * math.pi / 4) * 1.4142, gain * math.sin((pan + 1) * math.pi / 4) * 1.4142
    L[i0 : i0 + len(sig)] += sig * gl
    R[i0 : i0 + len(sig)] += sig * gr


def tt(d):
    return np.arange(int(d * SR)) / SR


def env(t, a=0.003, tau=0.3):
    return np.minimum(t / a, 1.0) * np.exp(-t / tau)


# ---------- instruments ----------
def marimba(m, d=1.2, tau=0.45):
    t, f = tt(d), midi(m)
    s = np.sin(2 * np.pi * f * t) * env(t, 0.002, tau)
    s += 0.30 * np.sin(2 * np.pi * f * 3.93 * t) * env(t, 0.001, tau * 0.25)
    s += 0.08 * np.sin(2 * np.pi * f * 9.2 * t) * env(t, 0.001, tau * 0.1)
    return s


def bell(m, d=2.5, tau=1.2):
    t, f = tt(d), midi(m)
    s = np.zeros_like(t)
    for ratio, amp, k in ((1, 1, 1), (2.0, 0.45, 0.7), (2.76, 0.3, 0.5), (5.4, 0.14, 0.25)):
        s += amp * np.sin(2 * np.pi * f * ratio * t) * env(t, 0.002, tau * k)
    return s / 1.9


def pad_note(m, d, att=0.25, rel=0.35, detune=5):
    t, f = tt(d + rel), midi(m)
    e = np.minimum(t / att, 1.0) * np.clip((d + rel - t) / rel, 0, 1)
    out = []
    for side in (-1, 1):
        ff = f * 2 ** (side * detune / 1200)
        s = np.sin(2 * np.pi * ff * t) + 0.12 * np.sin(2 * np.pi * 3 * ff * t)
        out.append(s * e)
    return out


def pop(f0=520, f1=1000, d=0.12, tau=0.035):
    t = tt(d)
    f = f0 * (f1 / f0) ** np.minimum(t / 0.025, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(t, 0.001, tau)


def droplet(f0=280, f1=1500, d=0.25):
    t = tt(d)
    f = f0 * (f1 / f0) ** np.minimum(t / 0.06, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(t, 0.002, 0.07)


def click(d=0.02):
    t = tt(d)
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)
    return n * env(t, 0.0005, 0.004) * 0.5


def filtered_noise(d, lo, hi):
    n = rng.standard_normal(int(d * SR))
    spec = np.fft.rfft(n)
    fr = np.fft.rfftfreq(len(n), 1 / SR)
    spec *= ((fr > lo) & (fr < hi)).astype(float)
    out = np.fft.irfft(spec, len(n))
    return out / (np.abs(out).max() + 1e-9)


def whoosh(d=0.6, rise=True, peak=0.7):
    """Souffle filtré dont la brillance monte (ou descend) — l'« onde » de oonde."""
    t = tt(d)
    low, high = filtered_noise(d, 80, 900), filtered_noise(d, 300, 5000)
    x = t / d
    mix = x if rise else 1 - x
    e = np.where(x < peak, (x / peak) ** 2, ((1 - x) / (1 - peak)) ** 1.5)
    return (low * (1 - mix) + high * mix * 0.6) * e


def kick():
    t = tt(0.35)
    f = 48 + 110 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(t, 0.001, 0.12)


def hat():
    t = tt(0.06)
    n = np.diff(np.diff(rng.standard_normal(len(t) + 2)))
    return n * env(t, 0.0005, 0.018) * 0.25


def thump():
    t = tt(0.3)
    f = 60 + 90 * np.exp(-t / 0.025)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 0.08)


# ---------- musique ----------
CHORDS = [  # (début, fin, notes de pad, notes d'arpège, basse)
    (0.0, 2.0, [57, 60, 64], [69, 72, 76, 81], 45),   # Am — le problème
    (2.0, 3.35, [53, 57, 60], [65, 69, 72, 77], 41),  # F
    (3.35, 5.0, [55, 60, 64], [72, 76, 79, 84], 48),  # C — oonde arrive
    (5.0, 6.45, [55, 59, 62], [67, 71, 74, 79], 43),  # G
    (6.45, 7.1, [57, 60, 64], [69, 72, 76, 81], 45),  # Am — la remontée
    (7.1, 7.75, [53, 57, 60], [65, 69, 72, 77], 41),  # F
    (7.75, 8.4, [55, 59, 62], [67, 71, 74, 79], 43),  # G
    (8.4, 9.55, [55, 60, 64], [72, 76, 79, 84], 48),  # C — n°1 !
    (9.55, 11.0, [53, 57, 60], [65, 69, 72, 77], 41), # F — l'IA
    (11.0, 12.4, [55, 59, 62], [67, 71, 74, 79], 43), # G
    (12.4, 15.0, [48, 55, 60, 64, 67], [72, 76, 79, 84], 36),  # C — fin
]


def chord_at(t):
    for c in CHORDS:
        if c[0] <= t < c[1]:
            return c
    return CHORDS[-1]


music_l, music_r = np.zeros(N), np.zeros(N)


def madd(sig, t0, gain, pan=0.0):
    i0 = int(t0 * SR)
    sig = sig[: N - i0]
    music_l[i0 : i0 + len(sig)] += sig * gain * (1 - max(pan, 0))
    music_r[i0 : i0 + len(sig)] += sig * gain * (1 + min(pan, 0))


for a, b, pad, arp, bass in CHORDS:
    for m in pad:
        sl, sr_ = pad_note(m, b - a)
        madd(sl, a, 0.045, -0.4)
        madd(sr_, a, 0.045, 0.4)

# arpège : noires au début, croches dès que oonde arrive, puis s'arrête à la fin
PATTERN = [0, 1, 2, 3, 2, 1, 2, 3]
step = 0.25
for i in range(int(12.4 / step)):
    t0 = i * step
    if t0 < 3.35 and i % 2:
        continue
    c = chord_at(t0)
    m = c[3][PATTERN[i % 8]]
    madd(marimba(m, 0.9, 0.32), t0, 0.075 if t0 < 3.35 else 0.09, 0.3 if i % 2 else -0.3)

# basse + rythmique pendant la partie « solution »
for i in range(int(3.5 / 0.5), int(12.4 / 0.5)):
    t0 = i * 0.5
    if t0 < 3.4:
        continue
    madd(kick(), t0, 0.33)
    madd(hat(), t0 + 0.25, 0.5, 0.2)
    c = chord_at(t0)
    bt = tt(0.5)
    madd(np.sin(2 * np.pi * midi(c[4]) * bt) * env(bt, 0.005, 0.3), t0, 0.12)

# ---------- sound design ----------
# frappe clavier
TYPED = len("garage automobile Lausanne")
for k in range(1, TYPED + 1):
    add(click(), 0.45 + 1.1 * k / TYPED, 0.32 + 0.12 * rng.random(), rng.uniform(-0.3, 0.3))
# apparition des résultats
for i, t0 in enumerate([1.62, 1.71, 1.80, 1.97]):
    add(pop(480 + 60 * i, 900 + 60 * i), t0, 0.16, -0.2 + 0.13 * i)
# « C'est vous ? » (uh-oh)
add(marimba(76, 0.6, 0.18), 2.45, 0.22)
add(marimba(72, 0.6, 0.25), 2.58, 0.22)
# l'onde oonde : goutte + souffle
add(droplet(), 3.22, 0.30)
add(whoosh(0.55, True, 0.75), 2.95, 0.16)
# coches de la fiche
for t0, m in zip([4.0, 4.4, 4.8, 5.2], [84, 88, 91, 96]):
    add(marimba(m, 0.8, 0.25), t0, 0.20, 0.15)
    add(pop(700, 1300, 0.08, 0.02), t0, 0.08)
# tampon « Fiche optimisée »
add(thump(), 5.72, 0.35)
add(click(), 5.72, 0.5)
# changement de scène
add(whoosh(0.45, False, 0.3), 6.25, 0.12)
add(whoosh(0.45, True, 0.7), 9.15, 0.12)
# remontée : souffle montant + un tic par place gagnée
add(whoosh(1.35, True, 0.85), 7.1, 0.17)


def ease_io(p):
    return 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2


prev, notes = 9, iter([79, 81, 84, 86, 88, 91, 93, 96])
for i in range(int(1.3 * 600)):
    t0 = 7.1 + i / 600
    rank = round(9 - 8 * ease_io(min(i / 600 / 1.3, 1)))
    if rank != prev:
        prev = rank
        add(marimba(next(notes), 0.5, 0.12), t0, 0.16, 0.2)
# n°1 : carillon + étincelles des confettis
for m in (72, 76, 79, 84):
    add(bell(m, 2.2, 1.0), 8.4, 0.085)
for k in range(10):
    add(bell(96 + [0, 4, 7, 12][k % 4], 0.5, 0.12), 8.45 + 0.05 * k + 0.03 * rng.random(), 0.035, rng.uniform(-0.8, 0.8))
add(pop(600, 1100), 8.72, 0.12)
# chat IA
add(pop(420, 820, 0.12, 0.05), 9.93, 0.20, 0.3)
for k in range(5):
    add(click(), 10.33 + 0.09 * k, 0.12)
add(pop(650, 1250), 10.94, 0.16)
add(pop(520, 980), 11.8, 0.15)
add(marimba(91, 0.6, 0.2), 12.02, 0.12)
for k in range(3):
    add(pop(700 + 80 * k, 1300 + 80 * k, 0.08, 0.02), 11.98 + 0.09 * k, 0.09, -0.4 + 0.4 * k)
# fin : grande onde, lettres du logo, accord final
add(whoosh(0.75, True, 0.8), 12.0, 0.22)
add(droplet(200, 1100, 0.35), 12.42, 0.30)
for k, m in enumerate([72, 76, 79, 84, 88]):
    add(marimba(m, 1.2, 0.5), 12.85 + 0.07 * k, 0.15, -0.4 + 0.2 * k)
for m in (60, 64, 67, 72, 76):
    add(bell(m, 2.6, 1.6), 13.4, 0.07)
add(pop(560, 1050), 13.82, 0.16)  # pastille oonde.ch

# ---------- mixage ----------
L += music_l
R += music_r
fade = np.clip((DUR - np.arange(N) / SR) / 0.5, 0, 1)
fade_in = np.clip(np.arange(N) / SR / 0.02, 0, 1)
L *= fade * fade_in
R *= fade * fade_in
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89
data = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open("audio.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print("audio.wav", data.shape)
