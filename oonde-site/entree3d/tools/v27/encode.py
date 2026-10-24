#!/usr/bin/env python3
"""v27 : les images rendues (out/v27/f/<job>-<k>/f*.png, 60 i/s) → les clips H.264 (v2/video/e3d/<k>/*.mp4), les affiches nettes
(v2/img/e3d/v/<k>/*.jpg|avif : poster, stop-<métier>, door-<métier>, room-<métier>, blur.webp) et les enseignes (v2/img/e3d/v/pins.json).
encode.py m|d [job …]  (sans job : tous ceux qui sont finis, done.txt)"""
import sys, json, subprocess, glob, os, pathlib
from PIL import Image, ImageFilter
k = sys.argv[1]; only = sys.argv[2:]
HERE = pathlib.Path(__file__).resolve().parents[2] / 'out' / 'v27'; V2 = pathlib.Path(__file__).resolve().parents[3] / 'v2'   # lancé depuis entree3d/tools/v27 : les images dans out/v27
VD = V2 / 'video' / 'e3d' / k; PD = V2 / 'img' / 'e3d' / 'v' / k; VD.mkdir(parents=True, exist_ok=True); PD.mkdir(parents=True, exist_ok=True)
done = {l.split()[1] for l in (HERE / 'done.txt').read_text().splitlines() if l.startswith('done ') and l.split()[2] == k} if (HERE / 'done.txt').exists() else set()
jobs = only or sorted(done)
CLIPS = {'in': ['in'], 'e-restaurant': ['e-restaurant'], 'e-coiffure': ['e-coiffure'], 'e-institut': ['e-institut'],
         'g-rc': ['g-restaurant-coiffure', '-g-coiffure-restaurant'], 'g-ci': ['g-coiffure-institut', '-g-institut-coiffure'], 'g-ri': ['g-restaurant-institut', '-g-institut-restaurant']}
PO = os.environ.get('PINS_ONLY')   # PINS_ONLY=1 : seulement pins.json (les clips et affiches sont déjà là)
def enc(src, out, rev, crf):
    if PO: return
    cmd = ['ffmpeg', '-y', '-v', 'error', '-framerate', '60', '-i', str(src / 'f%03d.png')]
    vf = ['format=yuv420p'] + (['reverse'] if rev else [])
    cmd += ['-vf', ','.join(vf), '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.2', '-preset', 'slow', '-crf', str(crf), '-g', '60', '-keyint_min', '60', '-sc_threshold', '0', '-bf', '2', '-movflags', '+faststart', '-an', str(out)]
    subprocess.run(cmd, check=True)
    # le même clip en VP9 (WebM), pour les Chromium sans codecs propriétaires (rue.js, VX)
    cmd = ['ffmpeg', '-y', '-v', 'error', '-framerate', '60', '-i', str(src / 'f%03d.png'), '-vf', ','.join(vf), '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', '0', '-crf', str(crf + 10), '-row-mt', '1', '-cpu-used', '3', '-g', '60', '-an', str(out.with_suffix('.webm'))]
    subprocess.run(cmd, check=True)
def still(png, name, w=None):
    im = Image.open(png).convert('RGB')
    if PO: return im
    if w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(PD / f'{name}.jpg', quality=86, optimize=True, progressive=True)
    im.save(PD / f'{name}.avif', quality=62, speed=4)
    return im
def last(src): return sorted(src.glob('f*.png'))[-1]
pins_f = V2 / 'img' / 'e3d' / 'v' / 'pins.json'
P = json.loads(pins_f.read_text()) if pins_f.exists() else {}
P.setdefault(k, {'stop': {}, 'room': {}, 'walk': {}}); P[k].setdefault('walk', {})
def pin(src, i, pid):
    j = json.loads((src / f'f{i:03d}.json').read_text()); q = next(x for x in j['pins'] if x['id'] == pid); return q['c']
for job in jobs:
    src = HERE / 'f' / f'{job}-{k}'; n = len(list(src.glob('f*.png')))
    if job not in CLIPS or not n: print('?', job); continue
    for name in CLIPS[job]:
        rev = name.startswith('-'); name = name.lstrip('-')
        crf = 24 if job.startswith('e-') else 27 if job.startswith('g-') else 26   # ≈ 1,6 Mo l'entrée (1,5 s, la salle est riche), ≈ 1,1 Mo l'intro, ≈ 0,5 Mo un glissement
        enc(src, VD / f'{name}.mp4', rev, crf); print(name, n, 'images', os.path.getsize(VD / f'{name}.mp4') // 1024, 'Ko mp4', os.path.getsize(VD / f'{name}.webm') // 1024, 'Ko webm', 'x' if PO else '')
    if job == 'in':
        im = still(src / 'f000.png', 'poster', 720 if k == 'm' else 1280)
        im.resize((24, round(im.height * 24 / im.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1)).save(PD / 'blur.webp', quality=60)
        still(last(src), 'stop-coiffure'); P[k]['stop']['coiffure'] = pin(src, n - 1, 'coiffure')
    elif job == 'g-rc': still(src / 'f000.png', 'stop-restaurant'); P[k]['stop']['restaurant'] = pin(src, 0, 'restaurant')
    elif job == 'g-ci': still(last(src), 'stop-institut'); P[k]['stop']['institut'] = pin(src, n - 1, 'institut')
    if job.startswith('e-'):
        m = job[2:]; still(src / 'f000.png', 'door-' + m); still(last(src), 'room-' + m); P[k]['room'][m] = pin(src, n - 1, 'wall')
        walk = []   # le mur du fond, image par image (rue.js le suit pendant l'entrée) : [visibilité, coins]
        for i in range(n):
            j = json.loads((src / f'f{i:03d}.json').read_text()); q = next(x for x in j['pins'] if x['id'] == 'wall'); walk.append([round(q['vis'], 2), [[round(a, 4), round(b, 4)] for a, b in q['c']]])
        P[k]['walk'][m] = walk
        P[k]['stop'].setdefault(m, pin(src, 0, 'sign'))   # à défaut du clip de la rue : l'enseigne vue du seuil (même cadrage)
pins_f.write_text(json.dumps(P, separators=(',', ':')))
print('pins', json.dumps({kk: {s: sorted(v) for s, v in P[kk].items()} for kk in P}))
