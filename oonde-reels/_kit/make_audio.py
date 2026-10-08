"""Kit Reels OONDE : musique de fond + bruitages synthétisés (numpy seul), calés sur une liste d'événements.

    python3 make_audio.py cues.json audio.wav

cues.json :
{
  "duration": 18.0,              # secondes (= window.DURATION)
  "bpm": 96,                     # tempo de l'arpège et de la rythmique
  "mood": "calm",                # calm | bright | warm | night (choix des accords)
  "beat_from": 3.0,              # début de la rythmique douce (kick + hat) ; null = jamais
  "beat_until": 15.0,            # fin de la rythmique
  "events": [                    # bruitages, temps en secondes
    {"t": 0.4, "type": "type", "n": 14, "span": 1.2},   # frappe clavier : n touches réparties sur span s
    {"t": 3.2, "type": "whoosh"},  {"t": 4.0, "type": "pop"},   {"t": 5.0, "type": "tick"},
    {"t": 6.0, "type": "chime"},   {"t": 8.0, "type": "thump"}, {"t": 2.0, "type": "droplet"},
    {"t": 9.0, "type": "swipe"},   {"t": 15.0, "type": "end"}    # end = accord final + carillon
  ]
}
Mixage : musique discrète (-18 dB environ sous les bruitages), fondu de sortie 0,6 s. Normaliser ensuite au mux :
ffmpeg -i video.mp4 -i audio.wav -c:v copy -af loudnorm=I=-15:TP=-1.5 -c:a aac -b:a 192k -shortest final.mp4
"""
import json
import math
import sys
import wave

import numpy as np

SR = 44100
cfg = json.load(open(sys.argv[1]))
OUT = sys.argv[2] if len(sys.argv) > 2 else "audio.wav"
DUR = float(cfg["duration"])
N = int(SR * DUR)
L, R = np.zeros(N), np.zeros(N)
ML, MR = np.zeros(N), np.zeros(N)
rng = np.random.default_rng(int(cfg.get("seed", 7)))


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(d * SR)) / SR


def env(t, a=0.003, tau=0.3):
    return np.minimum(t / a, 1.0) * np.exp(-t / tau)


def put(bl, br, sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N or i0 < 0:
        return
    sig = sig[: N - i0]
    gl = gain * math.cos((pan + 1) * math.pi / 4) * 1.4142
    gr = gain * math.sin((pan + 1) * math.pi / 4) * 1.4142
    bl[i0:i0 + len(sig)] += sig * gl
    br[i0:i0 + len(sig)] += sig * gr


def fx(sig, t0, gain=1.0, pan=0.0):
    put(L, R, sig, t0, gain, pan)


def mu(sig, t0, gain=1.0, pan=0.0):
    put(ML, MR, sig, t0, gain, pan)


# ---------- instruments ----------
def marimba(m, d=1.0, tau=0.4):
    t, f = tt(d), midi(m)
    s = np.sin(2 * np.pi * f * t) * env(t, 0.002, tau)
    s += 0.30 * np.sin(2 * np.pi * f * 3.93 * t) * env(t, 0.001, tau * 0.25)
    return s


def bell(m, d=2.4, tau=1.1):
    t, f = tt(d), midi(m)
    s = np.zeros_like(t)
    for ratio, amp, k in ((1, 1, 1), (2.0, 0.45, 0.7), (2.76, 0.3, 0.5), (5.4, 0.14, 0.25)):
        s += amp * np.sin(2 * np.pi * f * ratio * t) * env(t, 0.002, tau * k)
    return s / 1.9


def pad(m, d, att=0.4, rel=0.6, detune=6):
    t, f = tt(d + rel), midi(m)
    e = np.minimum(t / att, 1.0) * np.clip((d + rel - t) / rel, 0, 1)
    out = []
    for side in (-1, 1):
        ff = f * 2 ** (side * detune / 1200)
        out.append((np.sin(2 * np.pi * ff * t) + 0.10 * np.sin(2 * np.pi * 2 * ff * t)) * e)
    return out


def sweep(f0, f1, d, tau, ramp=0.03):
    t = tt(d)
    f = f0 * (f1 / f0) ** np.minimum(t / ramp, 1)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, tau)


def noise(d, lo, hi):
    n = rng.standard_normal(int(d * SR))
    spec = np.fft.rfft(n)
    fr = np.fft.rfftfreq(len(n), 1 / SR)
    spec *= ((fr > lo) & (fr < hi)).astype(float)
    out = np.fft.irfft(spec, len(n))
    return out / (np.abs(out).max() + 1e-9)


def whoosh(d=0.6, peak=0.7, rise=True):
    t = tt(d)
    lo, hi = noise(d, 80, 900), noise(d, 300, 5000)
    x = t / d
    mix = x if rise else 1 - x
    e = np.where(x < peak, (x / peak) ** 2, ((1 - x) / (1 - peak)) ** 1.5)
    return (lo * (1 - mix) + hi * mix * 0.6) * e


def click():
    t = tt(0.02)
    n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * env(t, 0.0005, 0.004) * 0.5


def kick():
    t = tt(0.3)
    f = 48 + 100 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 0.11)


def hat():
    t = tt(0.05)
    n = np.diff(np.diff(rng.standard_normal(len(t) + 2)))
    return n * env(t, 0.0005, 0.016) * 0.22


# ---------- musique ----------
MOODS = {   # 4 accords (pad, arpège, basse), en boucle
    "calm":   [([57, 60, 64], [69, 72, 76, 79], 45), ([53, 57, 60], [65, 69, 72, 77], 41), ([55, 60, 64], [72, 76, 79, 84], 48), ([55, 59, 62], [67, 71, 74, 79], 43)],
    "bright": [([60, 64, 67], [72, 76, 79, 84], 48), ([55, 59, 62], [67, 71, 74, 79], 43), ([57, 60, 64], [69, 72, 76, 81], 45), ([53, 57, 60], [65, 69, 72, 77], 41)],
    "warm":   [([53, 57, 60, 64], [65, 69, 72, 76], 41), ([55, 59, 62, 65], [67, 71, 74, 77], 43), ([52, 55, 59, 62], [64, 67, 71, 74], 40), ([57, 60, 64, 67], [69, 72, 76, 79], 45)],
    "night":  [([50, 53, 57, 60], [62, 65, 69, 72], 38), ([46, 50, 53, 57], [58, 62, 65, 70], 34), ([48, 52, 55, 59], [60, 64, 67, 71], 36), ([45, 48, 52, 55], [57, 60, 64, 67], 33)],
}
prog = MOODS.get(cfg.get("mood", "calm"), MOODS["calm"])
beat = 60.0 / float(cfg.get("bpm", 96))
bar = beat * 4
end_t = next((e["t"] for e in cfg.get("events", []) if e.get("type") == "end"), DUR - 1.5)

t0, k = 0.0, 0
while t0 < end_t:
    p, arp, bass = prog[k % 4]
    d = min(bar * 2, end_t - t0)
    for m in p:
        a, b = pad(m, d)
        mu(a, t0, 0.05, -0.4)
        mu(b, t0, 0.05, 0.4)
    for i in range(int(d / (beat / 2))):
        tt0 = t0 + i * beat / 2
        mu(marimba(arp[[0, 1, 2, 3, 2, 1, 2, 3][i % 8]], 0.8, 0.3), tt0, 0.07, 0.3 if i % 2 else -0.3)
    bf, bu = cfg.get("beat_from"), cfg.get("beat_until", end_t)
    if bf is not None:
        for i in range(int(d / beat)):
            tb = t0 + i * beat
            if bf <= tb < bu:
                mu(kick(), tb, 0.30)
                mu(hat(), tb + beat / 2, 0.45, 0.2)
                bt = tt(beat)
                mu(np.sin(2 * np.pi * midi(bass) * bt) * env(bt, 0.005, 0.25), tb, 0.10)
    t0 += bar * 2
    k += 1

# ---------- bruitages ----------
for e in cfg.get("events", []):
    t, ty, g = float(e["t"]), e["type"], float(e.get("gain", 1.0))
    if ty == "type":
        n, span = int(e.get("n", 10)), float(e.get("span", 1.0))
        for j in range(n):
            fx(click(), t + span * j / max(n, 1), (0.30 + 0.12 * rng.random()) * g, rng.uniform(-0.3, 0.3))
    elif ty == "whoosh":
        fx(whoosh(float(e.get("d", 0.6)), 0.75, e.get("rise", True)), t - 0.45, 0.16 * g)
    elif ty == "swipe":
        fx(whoosh(0.35, 0.4, False), t - 0.1, 0.12 * g, 0.3)
    elif ty == "pop":
        fx(sweep(520, 1000, 0.12, 0.035), t, 0.16 * g, float(e.get("pan", 0)))
    elif ty == "tick":
        fx(marimba(int(e.get("note", 88)), 0.6, 0.2), t, 0.18 * g, 0.15)
        fx(sweep(700, 1300, 0.08, 0.02), t, 0.07 * g)
    elif ty == "chime":
        for m in (84, 88, 91):
            fx(bell(m, 1.6, 0.6), t, 0.06 * g)
    elif ty == "thump":
        tq = tt(0.3)
        f = 60 + 90 * np.exp(-tq / 0.025)
        fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(tq, 0.001, 0.08), t, 0.35 * g)
        fx(click(), t, 0.5 * g)
    elif ty == "droplet":
        fx(sweep(280, 1500, 0.25, 0.07, 0.06), t, 0.28 * g)
    elif ty == "end":
        p, arp, bass = prog[0]
        for j, m in enumerate(arp + [arp[0] + 12]):
            fx(marimba(m, 1.2, 0.5), t + 0.07 * j, 0.13 * g, -0.4 + 0.2 * j)
        for m in p + [p[0] + 12]:
            fx(bell(m, 2.6, 1.5), t + 0.35, 0.06 * g)

# ---------- mixage ----------
mpk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9)
L += ML / mpk * 0.22
R += MR / mpk * 0.22
tl = np.arange(N) / SR
fade = np.clip((DUR - tl) / 0.6, 0, 1) * np.clip(tl / 0.02, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max(), 1e-9)
data = (np.stack([L / peak * 0.89, R / peak * 0.89], axis=1) * 32767).astype(np.int16)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print(OUT, f"{DUR:.1f} s")
