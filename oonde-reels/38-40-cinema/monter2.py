#!/usr/bin/env python3
"""Monteur 9:16 « cinéma puis bascule » (dérivé de _kit/hybride/monter.py).
Usage: monter2.py plan.json out.mp4
Plans : {"src","in","out","speed":1,"grade":"","entree":"cut|punch|flash|noir","hold":0,"card":false}
 - hold = secondes de gel (léger zoom) ajoutées à la fin du plan
 - card = plan de fin : image floutée et assombrie du plan précédent
Textes : {"t","font","size","y","t0","t1","color","pill":false} ou {"img","y","t0","t1"}
Audio : [{"src","t","in","out","gain","fi","fo"}] (n'importe quel format lu par ffmpeg)
Le badge « DÉMO · IMAGES IA » est posé d'office (haut, 40 px)."""
import sys, json, os, subprocess, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
P = json.load(open(sys.argv[1])); OUT = sys.argv[2]; FPS = P.get('fps', 30); W, H = 1080, 1920
FD = P.get('fonts', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_kit', 'fonts'))
base = os.path.dirname(os.path.abspath(sys.argv[1]))
def rd(p): return p if os.path.isabs(p) else os.path.join(base, p)

def load(pl):
    tmp = os.path.join(base, f"_n{abs(hash(json.dumps(pl, sort_keys=True)))}.mp4")
    if not os.path.exists(tmp):
        sp = pl.get('speed', 1)
        vf = (pl['grade'] + ',' if pl.get('grade') else '') + \
            f"setpts=PTS/{sp},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},unsharp=5:5:0.35,fps={FPS}"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(pl.get('in', 0)), '-to', str(pl['out']), '-i', rd(pl['src']),
                        '-vf', vf, '-an', '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', tmp], check=True)
    cap = cv2.VideoCapture(tmp); fr = []
    while True:
        ok, f = cap.read()
        if not ok: break
        fr.append(f)
    n = int(pl.get('hold', 0) * FPS)
    last = fr[-1].copy()
    for k in range(n):   # gel avec poussée lente
        M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, 1 + 0.03 * (k + 1) / n)
        fr.append(cv2.warpAffine(last, M, (W, H), borderMode=cv2.BORDER_REFLECT))
    return fr

def card(prev, n):
    b = (cv2.GaussianBlur(prev, (0, 0), 9) * 0.42).astype(np.uint8)
    out = []
    for k in range(n):   # le décor reste vivant : poussée lente
        M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, 1.03 + 0.06 * k / n)
        out.append(cv2.warpAffine(b, M, (W, H), borderMode=cv2.BORDER_REFLECT))
    return out

seqs = []
for pl in P['plans']:
    if pl.get('card'): seqs.append(card(seqs[-1][-1], int(pl['dur'] * FPS)))
    else: seqs.append(load(pl))
pn = int(0.2 * FPS)
def zoom(f, s, blur):
    acc = np.zeros_like(f, dtype=np.float32); n = 6 if blur > 0.05 else 1
    for k in range(n):
        z = s * (1 + 0.04 * k * blur); M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, z)
        acc += cv2.warpAffine(f, M, (W, H), borderMode=cv2.BORDER_REFLECT)
    return (acc / n).astype(np.uint8)
frames = []
for si, sq in enumerate(seqs):
    nxt = P['plans'][si + 1].get('entree', 'cut') if si + 1 < len(seqs) else 'cut'
    ent = P['plans'][si].get('entree', 'cut')
    for i, f in enumerate(sq):
        if nxt == 'punch' and i >= len(sq) - pn:
            u = (i - (len(sq) - pn) + 1) / pn; f = zoom(f, 1 + 0.5 * u ** 2, u)
        if ent == 'punch' and i < pn:
            u = 1 - i / pn; f = zoom(f, 1 + 0.35 * u ** 2, u)
        if ent == 'flash' and i < 4:
            a = 1 - i / 4; f = (f * (1 - a) + 255 * a).astype(np.uint8)
        if ent == 'noir' and i < 6:
            f = (f * (i / 6)).astype(np.uint8)
        frames.append(f)

def font(name, size): return ImageFont.truetype(os.path.join(FD, name), size)
cache = {}
def txt(T):
    k = json.dumps(T, sort_keys=True)
    if k in cache: return cache[k]
    fs = T.get('size', 72); ft = font(T.get('font', 'instrument-sans-latin-600-normal.woff2'), fs)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    y = T.get('y', 1200); col = tuple(T.get('color', [255, 255, 255])) + (255,)
    for ln in T['t'].split('\n'):
        tw = d.textlength(ln, font=ft); x = (W - tw) / 2
        if T.get('pill'):
            px, py = 34, 18; bb = d.textbbox((x, y), ln, font=ft)
            d.rounded_rectangle((bb[0] - px, bb[1] - py, bb[2] + px, bb[3] + py), 18, fill=tuple(T.get('pill_color', [17, 19, 24])) + (235,))
        d.text((x, y), ln, font=ft, fill=col); y += int(fs * 1.22)
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.6)))
    out = Image.alpha_composite(sh, im) if not T.get('pill') else im
    cache[k] = np.array(out); return cache[k]
def badge():
    ft = font('ibm-plex-mono-latin-600-normal.woff2', 40); s = 'DÉMO · IMAGES IA'
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    tw = d.textlength(s, font=ft); x = (W - tw) / 2; y = P.get('badge_y', 236)
    bb = d.textbbox((x, y), s, font=ft); d.rounded_rectangle((bb[0] - 22, bb[1] - 14, bb[2] + 22, bb[3] + 14), 12, fill=(17, 19, 24, 200))
    d.text((x, y), s, font=ft, fill=(255, 255, 255, 255)); return np.array(im)
layers = []
for T in P.get('textes', []):
    if 'img' in T:
        im = Image.open(rd(T['img'])).convert('RGBA')
        if T.get('w'): im = im.resize((T['w'], int(im.height * T['w'] / im.width)), Image.LANCZOS)
        c = Image.new('RGBA', (W, H), (0, 0, 0, 0)); c.paste(im, ((W - im.width) // 2, T.get('y', 1200)), im); arr = np.array(c)
    else: arr = txt(T)
    layers.append((T, arr))
layers.append(({'t0': 0, 't1': len(frames) / FPS, 'static': True}, badge()))
for T, arr in layers:
    a0, a1 = int(T['t0'] * FPS), int(T['t1'] * FPS)
    for i in range(a0, min(a1, len(frames))):
        if T.get('static'): op, dy = 1, 0
        else:
            u = min(1, (i - a0) / (0.28 * FPS)); v = min(1, (a1 - i) / (0.2 * FPS)); op = min(u, v); dy = int(20 * (1 - u) ** 2)
            if T.get('cut_in'): op, dy = min(1, v), 0
        lay = np.roll(arr, dy, axis=0) if dy else arr
        al = lay[..., 3:4].astype(np.float32) / 255 * op
        frames[i] = (frames[i] * (1 - al) + lay[..., :3][..., ::-1].astype(np.float32) * al).astype(np.uint8)
tmp = OUT + '.avi'; vw = cv2.VideoWriter(tmp, cv2.VideoWriter_fourcc(*'MJPG'), FPS, (W, H))
for f in frames: vw.write(f)
vw.release(); dur = len(frames) / FPS
SR = 48000; mix = np.zeros((int(dur * SR) + SR, 2))
for a in P.get('audio', []):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a.get('in', 0)), *(['-to', str(a['out'])] if 'out' in a else []), '-i', rd(a['src']),
                          '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32767 * a.get('gain', 1)
    fi, fo = int(a.get('fi', 0.005) * SR), int(a.get('fo', 0.02) * SR)
    if fi: x[:fi] *= np.linspace(0, 1, fi)[:, None]
    if fo and len(x) > fo: x[-fo:] *= np.linspace(1, 0, fo)[:, None]
    s = int(a['t'] * SR); e = min(len(mix), s + len(x)); mix[s:e] += x[:e - s]
mix = mix[:int(dur * SR)]; mix /= max(1, np.abs(mix).max() / 0.97)
import wave
with wave.open(OUT + '.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-i', OUT + '.wav', '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1', '-shortest', OUT], check=True)
os.remove(tmp); os.remove(OUT + '.wav'); print('ok', OUT, f'{dur:.2f}s')
