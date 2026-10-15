// node tools/plist.mjs rue d 200 > plist.json : où placer les images d'un plan-séquence pour qu'entre deux images
// voisines, l'image change d'autant (rotation, glissement, avancée, zoom), au lieu d'un pas régulier sur la courbe.
// Le lecteur (v2/partials/rue.js) lit ces positions dans pins.json : le défilement avance alors d'un pas égal à l'œil.
import * as THREE from '../node_modules/three/build/three.module.js';
const [,, name, mode, N, STOP = '.88'] = process.argv;
const { camPath } = await import(`../scenes/${name}.js`);
const path = camPath(mode === 'm'), FOV = 42, stop = +STOP;
const C = new THREE.CatmullRomCurve3(path.map(k => new THREE.Vector3(...k.pos)), false, 'centripetal');
const T = new THREE.CatmullRomCurve3(path.map(k => new THREE.Vector3(...k.tgt)), false, 'centripetal');
function cam(p) {   // le même calcul que kit.camAt
  const n = path.length - 1; let i = 0; while (i < n - 1 && p > path[i + 1].p) i++;
  const a = path[i], b = path[i + 1], t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))), u = (i + t) / n;
  const fa = a.fov ?? FOV, fb = b.fov ?? FOV; return { pos: C.getPoint(u), tgt: T.getPoint(u), fov: fa + (fb - fa) * t };
}
const G = 40000, m = new Float64Array(G + 1); let prev = cam(0);
for (let i = 1; i <= G; i++) {
  const c = cam(i / G), f = c.fov * Math.PI / 180, d1 = c.tgt.clone().sub(c.pos), D = d1.length(); d1.normalize();
  const mv = c.pos.clone().sub(prev.pos), fw = Math.abs(mv.dot(d1)), side = mv.addScaledVector(d1, -mv.dot(d1)).length();
  const rot = prev.tgt.clone().sub(prev.pos).angleTo(d1) / f;          // en largeurs d'image
  const tr = side / (2 * D * Math.tan(f / 2)), fz = 1.6 * fw / D, zm = Math.abs(c.fov - prev.fov) / c.fov;
  m[i] = m[i - 1] + Math.hypot(rot, tr, fz, zm) + .3 / G; prev = c;   // un petit plancher : les passages lents gardent des images
}
const at = p => m[Math.round(p * G)], inv = v => { let lo = 0, hi = G; while (lo < hi) { const md = (lo + hi) >> 1; if (m[md] < v) lo = md + 1; else hi = md; } return lo / G; };
const n = +N, tot = m[G], s1 = at(stop), k1 = Math.round((n - 1) * s1 / tot), ps = [];
for (let i = 0; i <= k1; i++) ps.push(inv(s1 * i / k1));
for (let i = 1; i < n - k1; i++) ps.push(inv(s1 + (tot - s1) * i / (n - 1 - k1)));
ps[0] = 0; ps[k1] = stop; ps[n - 1] = 1;
const step = Math.max(...ps.slice(1).map((p, i) => at(p) - at(ps[i])));
console.error(`${name} ${mode}: ${tot.toFixed(1)} largeurs d'image, arrêt image ${k1}/${n}, ouverture (p<.12) ${ps.filter(p => p < .12).length} images, pas max ${step.toFixed(3)}`);
console.log(JSON.stringify(ps.map(p => +p.toFixed(5))));
