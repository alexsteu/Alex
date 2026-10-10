# Usage (depuis src/) : python3 patch_b.py img/B.jpg img/B-patch.png -345 85   → zone x 820, y 1560 du plan B (1296 × 2304)
# Efface le virevoltant du plan B par clonage « sans couture » (Poisson) : texture prise ailleurs sur la route,
# luminosité recalée sur le bord du trou. Sortie : un PNG RGBA de la zone corrigée + son décalage.
import sys, subprocess, json, numpy as np
src, out, dx, dy = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
W, H = 1296, 2304
img = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout, np.uint8).reshape(H, W, 3).astype(np.float64)
cx, cy, r = 1045.5, 1780.5, 145.5
x0, y0, x1, y1 = 820, 1560, 1280, 2010            # boîte de travail
yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float64)
a = np.arctan2(yy - cy, xx - cx)
k = 1 + .05 * np.sin(3 * a + 1) + .03 * np.sin(7 * a + 2)
hole = (np.hypot(xx - cx, (yy - cy) / .97) < r * 1.17 * k) | (np.hypot((xx - cx) / 1.25, yy - (cy + 100)) < r * .62)
T = img[y0:y1, x0:x1]
Sx = img[y0 + dy:y1 + dy, x0 + dx:x1 + dx]       # source : S(x, y) = img(x + dx, y + dy)
def box(a, rad):
    for ax in (0, 1):
        c = np.cumsum(np.pad(a, [(rad + 1, rad) if i == ax else (0, 0) for i in range(a.ndim)], mode='edge'), axis=ax)
        a = (np.take(c, range(2 * rad + 1, c.shape[ax]), axis=ax) - np.take(c, range(0, c.shape[ax] - 2 * rad - 1), axis=ax)) / (2 * rad + 1)
    return a
def blur(a, rad): return box(box(box(a, rad), rad), rad)
def harm(V, m, it=(3000, 1500)):
    V = V.copy(); f = 4; ms = m[::f, ::f]; Vs = V[::f, ::f].copy(); Vs[ms] = V[~m].mean(0)
    Vs = jacobi(Vs, ms, it[0]); up = np.repeat(np.repeat(Vs, f, 0), f, 1)[:V.shape[0], :V.shape[1]]
    return jacobi(np.where(m[..., None], up, V), m, it[1])
def jacobi(D, m, it):
    for _ in range(it):
        n = (np.roll(D, 1, 0) + np.roll(D, -1, 0) + np.roll(D, 1, 1) + np.roll(D, -1, 1)) / 4
        D = np.where(m[..., None], n, D)
    return D
# contraste local : la texture source est remise au contraste des pavés autour du trou (pas de zone « voilée »)
lum = lambda a: a.mean(2, keepdims=True)
hpS = Sx - blur(Sx, 3); cS = blur(np.abs(lum(hpS)), 10) + 1
hpT = T - blur(T, 3); cT = blur(np.abs(lum(hpT)), 10) + 1
big = blur(hole[..., None].astype(float), 12)[..., 0] > .02          # zone touchée par le virevoltant (élargie)
cTi = harm(np.where(big[..., None], 0, cT), big)
Sx = blur(Sx, 3) + hpS * np.clip(cTi / cS, .7, 1.8)
D = T - Sx                                         # correction = interpolation harmonique de (T - S) depuis le bord
D[hole] = 0
# grossier puis fin
f = 4; hs = hole[::f, ::f]; Ds = D[::f, ::f].copy()
Ds[hs] = (T - Sx)[~hole].mean(0)
Ds = jacobi(Ds, hs, 3000)
up = np.repeat(np.repeat(Ds, f, 0), f, 1)[:D.shape[0], :D.shape[1]]
D = np.where(hole[..., None], up, D)
D = jacobi(D, hole, 1500)
R = np.clip(Sx + D, 0, 255)
alpha = hole.astype(np.float64)
# bord doux de 2 px
for _ in range(2): alpha = np.maximum(alpha, (np.roll(alpha, 1, 0) + np.roll(alpha, -1, 0) + np.roll(alpha, 1, 1) + np.roll(alpha, -1, 1)) / 4 * .5 + alpha * .5 * 0)
rgba = np.dstack([R, alpha * 255]).astype(np.uint8)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{x1-x0}x{y1-y0}', '-i', '-', out], input=rgba.tobytes(), check=True)
full = img.copy(); full[y0:y1, x0:x1] = T * (1 - alpha[..., None]) + R * alpha[..., None]
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-i', '-', '-vf', 'crop=700:600:450:1450', out.replace('.png', '-check.png')], input=full.astype(np.uint8).tobytes(), check=True)
print(json.dumps({'x': x0, 'y': y0, 'w': x1 - x0, 'h': y1 - y0}))
