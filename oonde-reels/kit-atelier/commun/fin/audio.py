"""Queue musicale douce de la fin (numpy seul) : RIEN sous la voix, seulement une queue après.
Usage : python3 audio.py queue.wav     Durée 4,0 s. Silence de 0 à 3,10 s (zone de la voix d'Alexandre),
puis un accord ouvert (Ré3 La3 Mi4 Fa#4) qui monte en 0,25 s et s'éteint à 4,0 s. Crête ≈ −18 dBFS."""
import sys, wave
import numpy as np
SR, DUR, START = 48000, 4.0, 3.10
n = int(SR * DUR); t = np.arange(n) / SR; y = np.zeros(n)
for f, g in ((146.83, 1.0), (220.0, .8), (329.63, .55), (369.99, .4)):
    for h, hg in ((1, 1), (2, .25), (3, .08)):
        y += g * hg * np.sin(2 * np.pi * f * h * t + 0.3 * h)
env = np.clip((t - START) / 0.25, 0, 1) ** 2 * np.clip((DUR - t) / 0.9, 0, 1) ** 1.5
y = y * env
y = y / np.abs(y).max() * 0.125          # −18 dBFS
st = (np.stack([y, y], 1) * 32767).astype('<i2')
w = wave.open(sys.argv[1] if len(sys.argv) > 1 else 'queue.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
