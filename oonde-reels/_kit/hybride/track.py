#!/usr/bin/env python3
"""Incruste un element graphique (motion design) sur une video reelle en suivant le decor.
Suivi plan (mur, ecran, vitrine, table) par points KLT + homographie, comme un « planar track » After Effects/Mocha.
Usage: track.py plate.mp4 calque out.mp4 "x1,y1 x2,y2 x3,y3 x4,y4" [--match 0.6] [--start 0]
- calque : un PNG RGBA, ou un dossier de PNG RGBA numerotes (animation rendue avec Remotion/PIL), lu a 30 i/s
- les 4 coins (pixels de la 1re frame) = ou poser le calque (haut-gauche, haut-droit, bas-droit, bas-gauche)
- --match : integre le calque a la lumiere du plan (teinte + luminosite locales), 0 = aucun
Sortie : video + fichier .track.json (homographies) reutilisable pour d'autres calques."""
import sys, os, json, glob, numpy as np, cv2, argparse
ap = argparse.ArgumentParser(); ap.add_argument('plate'); ap.add_argument('layer'); ap.add_argument('out'); ap.add_argument('corners')
ap.add_argument('--match', type=float, default=0.6); ap.add_argument('--start', type=int, default=0); ap.add_argument('--gain', type=float, default=1.0, help='intensite de la lumiere en mode add'); ap.add_argument('--mode', default='over', help='over (objet opaque) ou add (lumiere projetee, ecran, neon)')
a = ap.parse_args()
C0 = np.array([list(map(float,p.split(','))) for p in a.corners.split()], np.float32)
if os.path.isdir(a.layer): L = sorted(glob.glob(os.path.join(a.layer,'*.png')))
else: L = [a.layer]
def layer(i):
    p = L[min(i, len(L)-1)]; im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im.shape[2] == 3: im = np.dstack([im, np.full(im.shape[:2],255,np.uint8)])
    return im
cap = cv2.VideoCapture(a.plate); fps = cap.get(5); W=int(cap.get(3)); H=int(cap.get(4))
tmp = a.out + '.avi'; vw = cv2.VideoWriter(tmp, cv2.VideoWriter_fourcc(*'MJPG'), fps, (W,H))
ok, f0 = cap.read(); g0 = cv2.cvtColor(f0, cv2.COLOR_BGR2GRAY)
# points a suivre : autour de la zone (le decor rigide), pas dedans si elle est vide
mask = np.zeros_like(g0); cv2.fillConvexPoly(mask, cv2.convexHull(C0.astype(np.int32)), 255)
mask = cv2.dilate(mask, np.ones((151,151),np.uint8))
p0 = cv2.goodFeaturesToTrack(g0, 600, 0.005, 8, mask=mask)
Hcum = np.eye(3); Hs=[]; prev=g0; pts=p0; ref=p0.copy(); i=0; frame=f0
while True:
    if i>0:
        ok, frame = cap.read()
        if not ok: break
        g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, pts, None, winSize=(31,31), maxLevel=4)
        good = st.ravel()==1
        Hm, inl = cv2.findHomography(ref[good], nxt[good], cv2.RANSAC, 2.0)
        Hcum = Hm if Hm is not None else Hcum
        pts, ref, prev = nxt[good].reshape(-1,1,2), ref[good].reshape(-1,1,2), g
        if len(pts) < 80:  # re-detection, on garde la reference via Hcum
            newp = cv2.goodFeaturesToTrack(g, 600, 0.005, 8, mask=cv2.warpPerspective(mask, Hcum, (W,H)))
            pts = newp; ref = cv2.perspectiveTransform(newp, np.linalg.inv(Hcum))
    Hs.append(Hcum.tolist())
    Ci = cv2.perspectiveTransform(C0.reshape(-1,1,2), Hcum).reshape(-1,2)
    out = frame
    if i >= a.start:
        im = layer(i - a.start); h, w = im.shape[:2]
        M = cv2.getPerspectiveTransform(np.float32([[0,0],[w,0],[w,h],[0,h]]), Ci.astype(np.float32))
        wp = cv2.warpPerspective(im, M, (W,H), flags=cv2.INTER_CUBIC)
        al = (wp[...,3:4].astype(np.float32)/255)
        rgb = wp[...,:3].astype(np.float32)
        if a.match > 0:  # integration lumiere : teinte et niveau moyens du decor autour
            env = cv2.GaussianBlur(frame, (0,0), 60).astype(np.float32)
            tint = env / max(1, env.mean()) ; lum = env.mean()/128
            rgb = rgb*(1-a.match) + a.match*np.clip(rgb*tint*min(1.2,max(0.5,lum)),0,255)
            al = cv2.GaussianBlur(al,(0,0),0.8)[...,None] if al.ndim==3 else al
        if a.mode=='add':  # lumiere projetee : reflechie selon la couleur du support (fenetres sombres = moins de lumiere)
            alb = np.clip(cv2.GaussianBlur(frame,(0,0),1.5).astype(np.float32)/185.0, 0, 1.25)
            rgb = rgb*alb*a.gain
        out = (frame.astype(np.float32) + rgb*al) if a.mode=='add' else (frame.astype(np.float32)*(1-al) + rgb*al)
        n = np.random.normal(0, 5, out.shape[:2])[...,None]*al  # grain identique au plan
        out = np.clip(out+n,0,255).astype(np.uint8)
    vw.write(out); i+=1
vw.release()
os.system(f"ffmpeg -v error -y -i '{tmp}' -c:v libx264 -crf 16 -pix_fmt yuv420p '{a.out}' && rm '{tmp}'")
json.dump({'fps':fps,'corners':C0.tolist(),'H':Hs}, open(a.out+'.track.json','w'))
print('ok', i, 'frames')
