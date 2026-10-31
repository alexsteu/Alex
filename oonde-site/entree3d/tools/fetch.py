"""Télécharge des ressources CC0 de Poly Haven (polyhaven.com) en 1k : modèles glTF, textures, HDRI.
python3 tools/fetch.py model:WoodenChair_01 tex:wood_floor hdri:warm_bar"""
import json, sys, os, urllib.request, concurrent.futures as cf
A = os.path.join(os.path.dirname(__file__), '..', 'assets')
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'oonde-entree3d'}), timeout=120).read()
def save(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    os.makedirs(os.path.dirname(path), exist_ok=True); open(path, 'wb').write(get(url))
def one(spec, res='1k'):
    kind, name = spec.split(':')
    f = json.loads(get(f'https://api.polyhaven.com/files/{name}'))
    if kind == 'model':
        g = f['gltf'].get(res) or f['gltf'][sorted(f['gltf'])[0]]
        d = os.path.join(A, 'models', name); save(g['gltf']['url'], os.path.join(d, os.path.basename(g['gltf']['url'])))
        for p, v in g['gltf'].get('include', {}).items(): save(v['url'], os.path.join(d, p))
    elif kind == 'tex':
        d = os.path.join(A, 'tex', name)
        for key, out in (('Diffuse', 'diff'), ('nor_gl', 'nor'), ('Rough', 'rough'), ('AO', 'ao'), ('arm', 'arm')):
            if key in f and res in f[key]: save(f[key][res]['jpg']['url'], os.path.join(d, out + '.jpg'))
    elif kind == 'hdri':
        save(f['hdri'][res]['hdr']['url'], os.path.join(A, 'hdri', name + '.hdr'))
    return spec
if __name__ == '__main__':
    with cf.ThreadPoolExecutor(6) as ex:
        def safe(s):
            try: return 'ok ' + one(s)
            except Exception as e: return f'ÉCHEC {s} : {e!r}'
        for r in ex.map(safe, sys.argv[1:]): print(r)
