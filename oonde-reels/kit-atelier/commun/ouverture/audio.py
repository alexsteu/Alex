"""« tac » synthétisé (numpy seul) : pose d'un téléphone sur du bois. Usage : python3 audio.py tac.wav
Durée 1,5 s, « tac » à TAC = 0,5 s (même valeur que dans index.html). Crête ≈ −6 dBFS."""
import sys, wave
import numpy as np
SR, DUR, TAC = 48000, 1.5, 0.5
rng = np.random.default_rng(7)               # bruit semé : rendu identique à chaque fois
n = int(SR * DUR); t = np.arange(n) / SR; y = np.zeros(n)
i0 = int(TAC * SR); L = int(0.25 * SR); tt = np.arange(L) / SR
# 1) claquement sec : bruit filtré passe-bande (~1,5 kHz), 12 ms
noise = rng.standard_normal(L)
k = np.fft.rfftfreq(L, 1 / SR); F = np.fft.rfft(noise)
F *= np.exp(-((k - 1800) / 1500) ** 2); click = np.fft.irfft(F, L) * np.exp(-tt / 0.004)
# 2) corps de bois : deux modes amortis (190 Hz, 430 Hz) + pouf grave (95 Hz)
body = (0.9 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt / 0.035)
        + 0.45 * np.sin(2 * np.pi * 430 * tt + 0.6) * np.exp(-tt / 0.022)
        + 0.6 * np.sin(2 * np.pi * 95 * tt) * np.exp(-tt / 0.05))
hit = 1.0 * click / np.abs(click).max() * 0.55 + body * 0.55
hit *= np.minimum(1, tt / 0.0008)            # attaque 0,8 ms (évite le clic numérique)
y[i0:i0 + L] += hit
# petit rebond très doux (le téléphone se pose), 70 ms après
j = i0 + int(0.07 * SR); y[j:j + L] += 0.18 * hit[: len(y[j:j + L])]
y = y / np.abs(y).max() * 0.5                # −6 dBFS
st = (np.stack([y, y], 1) * 32767).astype('<i2')
w = wave.open(sys.argv[1] if len(sys.argv) > 1 else 'tac.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
