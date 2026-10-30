"""Suivi image par image pour les plans vidéo du Reel 09 (numpy + ffmpeg, aucune autre dépendance).

    python3 track.py phone  vid/C  > quads.json   # écran blanc du téléphone (plan C) → 4 coins par image
    python3 track.py weed   vid/B  > track.json   # virevoltant (plan B) → centre + rayon par image

Coordonnées normalisées (0–1) par rapport à l'image. Les images sont lues en 432×768.
"""
import glob
import json
import subprocess
import sys

import numpy as np

W, H = 432, 768


def frames(folder):
    for f in sorted(glob.glob(f'{folder}/*.jpg')):
        raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                             capture_output=True, check=True).stdout
        yield np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.int16)


def robust_line(a, b):
    """b ≈ k·a + m, deux passes en écartant les points à plus de 2 px."""
    k, m = np.polyfit(a, b, 1)
    for _ in range(2):
        keep = np.abs(b - (k * a + m)) < 2.0
        if keep.sum() > 10:
            k, m = np.polyfit(a[keep], b[keep], 1)
    return k, m


def phone(folder):
    out, prev = [], (int(W * .15), int(H * .35), int(W * .6), int(H * .8))   # le plan C de départ
    for im in frames(folder):
        lum = im.mean(axis=2)
        sat = im.max(axis=2) - im.min(axis=2)
        white = (lum > 200) & (sat < 30)
        x0, y0, x1, y1 = prev
        roi = np.zeros_like(white)
        roi[max(0, y0 - 40):y1 + 40, max(0, x0 - 40):x1 + 40] = True
        white &= roi
        ys, xs = np.nonzero(white)
        if len(xs) < 500:
            out.append(out[-1] if out else None)
            continue
        xm, ym = int(np.median(xs)), int(np.median(ys))
        # bords trouvés en partant du centre de l'écran (ignore le blanc qui n'est pas relié à l'écran)
        def run(line, mid):
            if not line[mid]:
                return None
            lo = np.nonzero(~line[:mid + 1])[0]
            hi = np.nonzero(~line[mid:])[0]
            return (lo[-1] + 1 if len(lo) else 0), (mid + hi[0] if len(hi) else len(line))
        a, b = run(white[ym], xm) or (x0, x1)
        c, d = run(white[:, xm], ym) or (y0, y1)
        x0, x1, y0, y1 = a, b, c, d
        prev = (x0, y0, x1, y1)
        wd, ht = x1 - x0, y1 - y0
        L, R, T, B = [], [], [], []
        for y in range(y0 + int(ht * .12), y1 - int(ht * .12)):
            r = run(white[y], xm)
            if r:
                L.append((y, r[0])); R.append((y, r[1]))
        # bords haut/bas : bandes extérieures (l'encoche est au centre)
        for x in np.r_[np.arange(x0 + int(wd * .10), x0 + int(wd * .27)), np.arange(x1 - int(wd * .27), x1 - int(wd * .10))]:
            r = run(white[:, x], ym)
            if r:
                T.append((x, r[0])); B.append((x, r[1]))
        L, R, T, B = (np.array(v, float) for v in (L, R, T, B))
        kl, ml = robust_line(L[:, 0], L[:, 1]); kr, mr = robust_line(R[:, 0], R[:, 1])   # x = k·y + m
        kt, mt = robust_line(T[:, 0], T[:, 1]); kb, mb = robust_line(B[:, 0], B[:, 1])   # y = k·x + m

        def meet(kv, mv, kh, mh):                  # x = kv·y + mv et y = kh·x + mh
            y = (kh * mv + mh) / (1 - kh * kv)
            return [round(float((kv * y + mv) / W), 5), round(float(y / H), 5)]
        out.append([meet(kl, ml, kt, mt), meet(kr, mr, kt, mt), meet(kr, mr, kb, mb), meet(kl, ml, kb, mb)])
    return out


def weed(folder):
    out = []
    for im in frames(folder):
        r, g, b = im[..., 0], im[..., 1], im[..., 2]
        warm = ((r - b) > 28) & (r > 80)
        warm[:int(H * .62)] = False                # rue seulement (la vitrine est chaude aussi)
        n = int(.11 * W)                           # fenêtre ≈ diamètre du virevoltant
        S = np.pad(warm.astype(np.int32).cumsum(0).cumsum(1), ((1, 0), (1, 0)))
        box = S[n:, n:] - S[:-n, n:] - S[n:, :-n] + S[:-n, :-n]
        y, x = np.unravel_index(box.argmax(), box.shape)
        if box[y, x] < n * n * .12:
            out.append(None)
            continue
        ys, xs = np.nonzero(warm[y:y + n, x:x + n])
        cx, cy = xs.mean() + x, ys.mean() + y
        rad = max(np.percentile(np.hypot(xs + x - cx, ys + y - cy), 98), 4)
        out.append([round(float(cx / W), 5), round(float(cy / H), 5), round(float(rad / W), 5)])
    return out


if __name__ == '__main__':
    mode, folder = sys.argv[1], sys.argv[2]
    print(json.dumps(phone(folder) if mode == 'phone' else weed(folder)))
