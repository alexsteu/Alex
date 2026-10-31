#!/usr/bin/env python3
"""Speed ramp + slow motion a partir d'un clip.
Usage: ramp.py in.mp4 out.mp4 "0:1,1.2:1,1.5:0.15,3.2:0.15,3.5:2.5,4:2.5"
La courbe = paires temps_source:vitesse (1 = normal, 0.15 = slow-mo x6.7, 2.5 = accelere).
Les temps sont en secondes de la SOURCE.
Le slow-mo utilise ffmpeg minterpolate (interpolation par flux optique, mci) a 8x la cadence,
les passages rapides ajoutent un flou de mouvement (moyenne de frames)."""
import sys, subprocess, numpy as np, cv2, os, tempfile
src, out, curve = sys.argv[1], sys.argv[2], sys.argv[3]
FPS_OUT = 30
pts = [tuple(map(float, p.split(':'))) for p in curve.split(',')]
cap = cv2.VideoCapture(src); fps = cap.get(5); n = int(cap.get(7)); W = int(cap.get(3)); H = int(cap.get(4)); cap.release()
dur = n / fps
K = 8  # facteur d'interpolation
tmp = tempfile.mkdtemp()
hi = src + f'.x{K}.mp4'  # cache : l'interpolation est lente (~1 min/s de 720p), on la garde pour d'autres courbes
if not os.path.exists(hi): subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-vf',f"minterpolate=fps={fps*K}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1",
                '-c:v','libx264','-crf','12','-preset','fast',hi], check=True)
def speed(t):
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    return float(np.interp(t, xs, ys))
# parcourt le temps source au rythme de la courbe
times=[]; t=0.0
while t < dur - 1e-3:
    times.append(t); t += speed(t) / FPS_OUT
cap = cv2.VideoCapture(hi); frames=[]
while True:
    ok,f = cap.read()
    if not ok: break
    frames.append(f)
cap.release()
NF=len(frames)
w = cv2.VideoWriter(os.path.join(tmp,'o.avi'), cv2.VideoWriter_fourcc(*'MJPG'), FPS_OUT, (W,H))
for t in times:
    i = min(NF-1, int(round(t*fps*K)))
    s = speed(t)
    span = int(min(K*2, max(1, round(s*K*0.5))))  # flou de mouvement ~180 degres
    if span > 1:
        acc = np.mean([frames[min(NF-1,i+j)].astype(np.float32) for j in range(span)], axis=0).astype(np.uint8)
    else: acc = frames[i]
    w.write(acc)
w.release()
subprocess.run(['ffmpeg','-v','error','-y','-i',os.path.join(tmp,'o.avi'),'-c:v','libx264','-crf','16','-pix_fmt','yuv420p',out], check=True)
print(f"{out}: {len(times)/FPS_OUT:.2f}s depuis {dur:.2f}s source")
