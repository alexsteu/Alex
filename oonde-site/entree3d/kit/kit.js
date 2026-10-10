// La boîte à outils commune : matières Poly Haven (CC0), modèles glTF, ciel de l'heure bleue, rue, façade de boutique, caméra.
// Toutes les scènes partagent la même ouverture : la rue le soir, la vitrine allumée, l'enseigne, la porte qui s'ouvre.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

let R, pmrem; const jobs = []; const texCache = {}; const gltfCache = {};
export function init(r) { R = r; pmrem = new THREE.PMREMGenerator(r); RectAreaLightUniformsLib.init(); }
export const ready = () => Promise.all(jobs);
const TL = new THREE.TextureLoader(), GL = new GLTFLoader();
const A = new URL('../assets/', import.meta.url).href;

function loadTex(url, srgb) {
  if (texCache[url]) return texCache[url];
  let done; jobs.push(new Promise(res => (done = res)));
  const t = TL.load(url, done, undefined, () => { console.error('texture', url); done(); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return (texCache[url] = t);
}
// Une matière Poly Haven : diff, nor, arm (occlusion, rugosité, métal) ; `s` = taille d'un carreau de texture en mètres
export function pbr(name, o = {}) {
  const d = A + 'tex/' + name + '/';
  const m = new THREE.MeshStandardMaterial({ color: o.color ?? 0xffffff, roughness: o.roughness ?? 1, metalness: o.metalness ?? 0, envMapIntensity: o.env ?? 1 });
  m.map = loadTex(d + 'diff.jpg', true); m.normalMap = loadTex(d + 'nor.jpg');
  m.normalScale = new THREE.Vector2(o.ns ?? 1, -(o.ns ?? 1));
  if (!o.noArm) { const arm = loadTex(d + 'arm.jpg'); m.roughnessMap = arm; m.aoMap = arm; if (o.metal) m.metalnessMap = arm; }
  m.userData.s = o.s ?? 1;
  return m;
}
export const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.r ?? .6, metalness: o.m ?? 0, emissive: o.e ?? 0, emissiveIntensity: o.ei ?? 1, envMapIntensity: o.env ?? 1, side: o.side ?? THREE.FrontSide, transparent: !!o.t, opacity: o.op ?? 1 });
export const glass = (o = {}) => { const g = new THREE.MeshPhysicalMaterial({ color: o.color ?? 0xdfe8ee, roughness: .04, metalness: 0, transparent: true, opacity: o.op ?? .14, envMapIntensity: o.env ?? 1.6, depthWrite: false, side: THREE.DoubleSide }); return g; };

// Les UV en mètres : une texture garde la même taille sur toutes les faces, quelle que soit la boîte
function worldUV(geo, w, h, d, s) {
  const uv = geo.attributes.uv; const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / s, uv.getY(i) * dims[f][1] / s); }
  geo.setAttribute('uv1', uv.clone());
}
export function box(w, h, d, mat, x = 0, y = 0, z = 0, o = {}) {
  const g = new THREE.BoxGeometry(w, h, d); worldUV(g, w, h, d, (mat.userData && mat.userData.s) || 1);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = o.cast ?? true; m.receiveShadow = true;
  if (o.parent) o.parent.add(m); return m;
}
export function plane(w, h, mat, o = {}) {
  const g = new THREE.PlaneGeometry(w, h); const s = (mat.userData && mat.userData.s) || 1;
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / s, uv.getY(i) * h / s);
  g.setAttribute('uv1', uv.clone());
  const m = new THREE.Mesh(g, mat); m.receiveShadow = true; return m;
}

// Un modèle Poly Haven : posé au sol, mis à l'échelle si `h` (hauteur voulue) est donné
export function model(name, o = {}) {
  const holder = new THREE.Group(); holder.position.set(...(o.pos || [0, 0, 0])); holder.rotation.y = o.ry || 0;
  if (o.parent) o.parent.add(holder);
  if (!gltfCache[name]) gltfCache[name] = new Promise((res, rej) => {
    GL.load(A + 'models/' + name + '/' + name + '_1k.gltf', g => res(g.scene), undefined, rej);
  });
  jobs.push(gltfCache[name].then(src => {
    const m = src.clone(true);
    m.traverse(c => { if (c.isMesh) { c.castShadow = o.cast ?? true; c.receiveShadow = true; if (o.tint && c.material) { c.material = c.material.clone(); c.material.color.multiply(new THREE.Color(o.tint)); } if (c.material) { c.material.envMapIntensity = o.env ?? 1; if (o.mat) { c.material = c.material.clone(); Object.assign(c.material, o.mat); if (o.mat.metalness === 0) c.material.metalnessMap = null; } } } });
    const b = new THREE.Box3().setFromObject(m); const size = b.getSize(new THREE.Vector3());
    const k = o.h ? o.h / size.y : (o.scale || 1); m.scale.setScalar(k);
    const b2 = new THREE.Box3().setFromObject(m); const c = b2.getCenter(new THREE.Vector3());
    m.position.x -= c.x; m.position.z -= c.z; m.position.y -= b2.min.y;
    holder.add(m); holder.userData.size = b2.getSize(new THREE.Vector3());
  }));
  return holder;
}

// L'éclairage d'ambiance et les reflets viennent d'une photo HDR ; ses lampadaires (des milliers de fois plus clairs
// que le reste) feraient des taches dans les reflets : on écrête la photo à `clip`
export function env(scene, name, intensity = 1, rot = 0, clip = 3) {
  jobs.push(new Promise(res => new RGBELoader().setDataType(THREE.FloatType).load(A + 'hdri/' + name + '.hdr', t => {
    const d = t.image.data; for (let i = 0; i < d.length; i++) if (d[i] > clip) d[i] = clip;
    t.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmrem.fromEquirectangular(t).texture; scene.environmentIntensity = intensity;
    scene.environmentRotation = new THREE.Euler(0, rot, 0); res();
  })));
}

// Le ciel de l'heure bleue : bleu profond en haut, rose orangé à l'horizon, quelques étoiles
export function sky(scene, o = {}) {
  const top = new THREE.Color(o.top ?? 0x0b1a44), mid = new THREE.Color(o.mid ?? 0x34407a), hor = new THREE.Color(o.hor ?? 0xd99a86);
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { top: { value: top }, mid: { value: mid }, hor: { value: hor } },
    vertexShader: 'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `uniform vec3 top,mid,hor;varying vec3 vP;
    float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
    void main(){float y=clamp(vP.y,0.,1.);vec3 c=mix(hor,mid,smoothstep(0.,.22,y));c=mix(c,top,smoothstep(.2,.75,y));
    vec3 q=floor(vP*420.);float s=step(.9985,h(q))*smoothstep(.25,.6,y);c+=s*.55;gl_FragColor=vec4(c,1.);}` });
  const m = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), mat); m.userData.noOcclude = true; scene.add(m);
}

// La rue : pavés mouillés, trottoir, bordure ; un reflet chaud de la vitrine sur le trottoir
export function street(scene, o = {}) {
  const g = new THREE.Group(); scene.add(g);
  const cob = pbr(o.road ?? 'cobblestone_floor_08', { s: 2.2, roughness: .55, ns: 1.2, env: 1.4 });
  const road = plane(60, 30, cob); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, 3.2 + 15); g.add(road);
  const pav = pbr(o.walk ?? 'concrete_pavement', { s: 1.6, env: .9 });
  const walk = box(60, .14, 3.2, pav, 0, .07, 1.6, { cast: false }); g.add(walk);
  box(60, .16, .22, std(0x8d8a84, { r: .8 }), 0, .08, 3.15, { cast: false, parent: g });
  return g;
}

// L'immeuble : rez-de-chaussée en pierre avec la vitrine, étages crépis, fenêtres à volets, corniches
export function building(scene, o = {}) {
  const g = new THREE.Group(); g.position.x = o.x ?? 0; scene.add(g);
  const W = o.w ?? 9.4, floors = o.floors ?? 3, gf = 4.1, fh = 3.1, H = gf + floors * fh;
  const plaster = pbr(o.plaster ?? 'plastered_wall_04', { s: 3, color: o.wall ?? 0xf1e6d6 });
  const stone = pbr(o.stone ?? 'white_sandstone_blocks_02', { s: 1.4, color: o.stoneTint ?? 0xffffff });
  // étages
  const up = box(W, H - gf, .5, plaster, 0, gf + (H - gf) / 2, -.25, { parent: g });
  box(W + .2, .22, .62, stone, 0, gf + .05, -.2, { parent: g });              // corniche du rez
  box(W + .3, .35, .8, stone, 0, H + .1, -.2, { parent: g });                 // corniche du toit
  const roofM = std(0x2b2d33, { r: .7 }); const roof = box(W + .3, 2.2, 4, roofM, 0, H + 1.2, -2.6, { parent: g }); roof.rotation.x = -.5;
  const shutterM = std(o.shutter ?? 0x56685c, { r: .7 }); const frameM = std(0xf4efe6, { r: .5 });
  const nwin = o.windows ?? 3;
  for (let f = 0; f < floors; f++) for (let i = 0; i < nwin; i++) {
    const x = (i - (nwin - 1) / 2) * (W / nwin), y = gf + f * fh + 1.55;
    const lit = o.lit ? o.lit(f, i) : ((f * 7 + i * 3 + (o.seed ?? 0)) % 4 === 0);
    box(1.1, 1.6, .08, stone, x, y, .02, { parent: g, cast: false });         // encadrement
    const glassIn = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.4), lit ? std(0x2a1a0c, { e: 0xffb066, ei: 1.6 }) : std(0x0d1118, { r: .15, m: .3, env: 1.4 }));
    glassIn.position.set(x, y, .07); g.add(glassIn);
    if (lit) { const cur = new THREE.Mesh(new THREE.PlaneGeometry(.3, 1.4), std(0xf5e2c4, { e: 0xffc58a, ei: .8 })); cur.position.set(x - .3, y, .075); g.add(cur); }
    box(.05, 1.4, .05, frameM, x, y, .1, { parent: g, cast: false }); box(.9, .05, .05, frameM, x, y + .2, .1, { parent: g, cast: false });
    box(.1, .08, .3, stone, x, y - .83, .17, { parent: g });                   // appui
    box(1.06, .1, .32, stone, x, y - .82, .14, { parent: g });
    for (const s of [-1, 1]) { const sh = box(.48, 1.55, .04, shutterM, x + s * .82, y, .1, { parent: g }); sh.rotation.y = s * .12; }
  }
  return { g, W, H, gf, stone, plaster };
}

// La devanture : piliers et bandeau en pierre, enseigne (rectangle `sign`, remplie par la page), vitrines, porte double vitrée
export function shopfront(scene, o = {}) {
  const b = building(scene, o); const g = b.g; const W = b.W, gf = b.gf;
  const ow = o.openW ?? 7.2, oh = 3.15;                              // ouverture de la vitrine
  const pier = (W - ow) / 2;
  for (const s of [-1, 1]) box(pier, gf, .6, b.stone, s * (ow / 2 + pier / 2), gf / 2, -.3, { parent: g });
  box(ow, gf - oh, .6, b.stone, 0, oh + (gf - oh) / 2, -.3, { parent: g });   // linteau
  // le bandeau de l'enseigne : un panneau sombre en léger relief ; la page y pose le nom et la couleur
  const sw = o.signW ?? 5.6, sh = .62, sy = oh + (gf - oh) / 2 + .02;
  const signM = std(0x15171b, { r: .35, m: .2 });
  box(sw + .12, sh + .12, .08, std(0x2a2b2e, { r: .4, m: .6 }), 0, sy, .04, { parent: g });
  box(sw, sh, .06, signM, 0, sy, .07, { parent: g });
  const sz = .105; const sign = [new THREE.Vector3(-sw / 2, sy + sh / 2, sz), new THREE.Vector3(sw / 2, sy + sh / 2, sz), new THREE.Vector3(sw / 2, sy - sh / 2, sz), new THREE.Vector3(-sw / 2, sy - sh / 2, sz)];
  // deux appliques au-dessus de l'enseigne
  if (!o.dark) for (const s of [-1, 1]) {
    const arm = box(.04, .04, .5, std(0x1b1c1f, { m: .8, r: .35 }), s * sw * .32, sy + .55, .3, { parent: g });
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.11, .14, 20, 1, true), std(0x1b1c1f, { m: .8, r: .35, side: THREE.DoubleSide })); shade.position.set(s * sw * .32, sy + .5, .55); g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), std(0xffffff, { e: 0xffd7a0, ei: 3 })); bulb.position.set(s * sw * .32, sy + .45, .55); bulb.userData.noOcclude = true; g.add(bulb);
    const L = new THREE.SpotLight(0xffc98f, 4, 3.2, .9, .6, 2); L.position.set(s * sw * .32, sy + .45, .55); L.target.position.set(s * sw * .32, sy - .3, 0); g.add(L, L.target);
  }
  // la menuiserie : soubassement, montants noirs, vitres, imposte
  const metal = std(o.frame ?? 0x16181b, { r: .32, m: .7 });
  const base = std(o.base ?? 0x1d2226, { r: .55 });
  const dw = o.doorW ?? 1.5, dh = 2.55;
  for (const s of [-1, 1]) {
    const x0 = s * dw / 2, x1 = s * ow / 2, cx = (x0 + x1) / 2, ww = Math.abs(x1 - x0);
    box(ww, .55, .12, base, cx, .275 + .14, .02, { parent: g });
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(ww, oh - .55 - .14), glass()); gl.position.set(cx, .69 + (oh - .69) / 2, .02); gl.userData.noOcclude = true; g.add(gl);
    box(.07, oh, .1, metal, x1 - s * .035, oh / 2, .02, { parent: g }); box(.06, oh, .1, metal, x0 + s * .03, oh / 2, .02, { parent: g });
    box(ww, .06, .1, metal, cx, .69, .02, { parent: g }); box(ww, .06, .1, metal, cx, oh - .03, .02, { parent: g });
    if (o.mullion !== false) box(.04, oh - .69, .08, metal, cx, (oh + .69) / 2, .02, { parent: g });
  }
  if (o.dark) { const bk = new THREE.Mesh(new THREE.PlaneGeometry(ow, oh), std(0x0c0e12, { r: .9, e: 0x1a1410, ei: .6 })); bk.position.set(0, oh / 2, -.9); g.add(bk); }
  box(dw, .06, .1, metal, 0, dh, .02, { parent: g });
  const tr = new THREE.Mesh(new THREE.PlaneGeometry(dw, oh - dh), glass()); tr.position.set(0, (oh + dh) / 2, .02); tr.userData.noOcclude = true; g.add(tr);
  // les deux battants, charnières sur les côtés, s'ouvrent vers l'intérieur
  const leaves = [];
  for (const s of [-1, 1]) {
    const hinge = new THREE.Group(); hinge.position.set(s * dw / 2, .14, 0); g.add(hinge);
    const lw = dw / 2 - .01;
    const fr = (w, h, x, y) => box(w, h, .05, metal, x, y, 0, { parent: hinge });
    fr(.07, dh - .14, -s * .035, (dh - .14) / 2); fr(.07, dh - .14, -s * (lw - .035), (dh - .14) / 2);
    fr(lw, .07, -s * lw / 2, .035); fr(lw, .12, -s * lw / 2, dh - .14 - .06); fr(lw, .14, -s * lw / 2, .07);
    const gp = new THREE.Mesh(new THREE.PlaneGeometry(lw - .14, dh - .14 - .3), glass()); gp.position.set(-s * lw / 2, (dh - .14) / 2 + .02, 0); gp.userData.noOcclude = true; hinge.add(gp);
    const handle = box(.025, .45, .025, std(0xc9a46a, { m: 1, r: .25 }), -s * (lw - .12), 1.05, -.05, { parent: hinge }); handle.position.z = .05;
    leaves.push({ hinge, s });
  }
  // le seuil et un paillasson
  box(dw + .1, .03, .5, std(0x3a3c40, { r: .9 }), 0, .155, .3, { parent: g });
  const openDoor = (t) => { const e = t * t * (3 - 2 * t); for (const L of leaves) L.hinge.rotation.y = L.s * -e * 1.65; };
  // le reflet chaud de la vitrine sur le trottoir (ce que fait la lumière qui sort de la boutique)
  if (!o.dark) {
  const spill = new THREE.Mesh(new THREE.PlaneGeometry(ow * 1.25, 3.4), new THREE.MeshBasicMaterial({ color: o.spill ?? 0xffa75a, transparent: true, opacity: o.spillOp ?? .2, depthWrite: false, blending: THREE.AdditiveBlending,
    map: radial() }));
  spill.rotation.x = -Math.PI / 2; spill.position.set(0, .145, 1.6); spill.userData.noOcclude = true; g.add(spill);
  }
  return { ...b, sign, openDoor, ow, oh, dw, dh };
}
let _rad; function radial() { if (_rad) return _rad; const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const gr = x.createRadialGradient(128, 30, 4, 128, 30, 230); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 256, 256); _rad = new THREE.CanvasTexture(c); return _rad; }

// L'intérieur : une pièce derrière la façade (z de 0 à -d)
export function room(scene, o = {}) {
  const g = new THREE.Group(); scene.add(g);
  const w = o.w ?? 7.2, d = o.d ?? 8, h = o.h ?? 3.15;
  const fl = plane(w, d, o.floor); fl.rotation.x = -Math.PI / 2; fl.position.set(0, .14, -d / 2); g.add(fl);
  const ce = plane(w, d, o.ceiling ?? std(0xece6dc, { r: .9 })); ce.rotation.x = Math.PI / 2; ce.position.set(0, h, -d / 2); g.add(ce);
  const back = plane(w, h, o.back ?? o.wall); back.position.set(0, h / 2, -d); g.add(back);
  const L = plane(d, h, o.left ?? o.wall); L.rotation.y = Math.PI / 2; L.position.set(-w / 2, h / 2, -d / 2); g.add(L);
  const Rr = plane(d, h, o.right ?? o.wall); Rr.rotation.y = -Math.PI / 2; Rr.position.set(w / 2, h / 2, -d / 2); g.add(Rr);
  return { g, w, d, h };
}
// Une suspension : modèle + ampoule qui éclaire
export function pendant(parent, x, y, z, o = {}) {
  const L = new THREE.PointLight(o.color ?? 0xffb46b, o.i ?? 6, o.dist ?? 7, 2); L.position.set(x, y, z); L.castShadow = !!o.shadow;
  if (o.shadow) { L.shadow.mapSize.set(512, 512); L.shadow.bias = -.002; L.shadow.radius = 4; }
  parent.add(L);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(o.r ?? .05, 14, 10), std(0xffffff, { e: o.color ?? 0xffc07a, ei: o.ei ?? 3 })); bulb.position.set(x, y, z); bulb.castShadow = false; bulb.userData.noOcclude = true; parent.add(bulb);
  return L;
}

// La caméra : une courbe dans les positions, une autre dans les points regardés, au rythme des clés p
export function camAt(cam, path, p, fovs) {
  if (!path._c) {
    path._c = new THREE.CatmullRomCurve3(path.map(k => new THREE.Vector3(...k.pos)), false, 'centripetal');
    path._t = new THREE.CatmullRomCurve3(path.map(k => new THREE.Vector3(...k.tgt)), false, 'centripetal');
  }
  const n = path.length - 1; let i = 0; while (i < n - 1 && p > path[i + 1].p) i++;
  const a = path[i], b = path[i + 1]; const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
  const u = (i + t) / n;
  cam.position.copy(path._c.getPoint(u)); cam.lookAt(path._t.getPoint(u));
  const fa = a.fov ?? fovs ?? 50, fb = b.fov ?? fovs ?? 50; cam.fov = fa + (fb - fa) * t; cam.updateProjectionMatrix();
}

// À l'intérieur, le ciel de la rue ne doit presque plus se refléter : on baisse les reflets de tout un groupe
export function dimEnv(group, k = .25, minRough = 0) {
  group.traverse(o => { if (o.isMesh && o.material) for (const m of [].concat(o.material)) { if (m.userData._dim) continue; m.userData._dim = 1; m.envMapIntensity = (m.envMapIntensity ?? 1) * k; if (m.roughness !== undefined) m.roughness = Math.max(m.roughness, minRough); } });
}

// Le parcours commun : de l'autre côté de la rue jusqu'à la porte, la porte s'ouvre (p .38 → .54), puis la fin propre à chaque scène
export function entryPath(portrait, end) {
  const start = portrait ? [
    { p: 0, pos: [0.2, 1.7, 12.5], tgt: [0, 2.45, 0], fov: 58 },
    { p: .2, pos: [0.15, 1.65, 8.6], tgt: [0, 2.3, 0] },
    { p: .36, pos: [0.05, 1.6, 5], tgt: [0, 1.9, -1] },
    { p: .48, pos: [0, 1.58, 2.0], tgt: [0, 1.6, -3] },
    { p: .6, pos: [0, 1.56, -.3], tgt: [0, 1.6, -5] },
  ] : [
    { p: 0, pos: [0.3, 1.7, 12.5], tgt: [0, 2.85, 0], fov: 40 },
    { p: .2, pos: [0.2, 1.65, 8.2], tgt: [0, 2.55, 0] },
    { p: .36, pos: [0.05, 1.6, 4.4], tgt: [0, 2.0, -1] },
    { p: .48, pos: [0, 1.58, 1.9], tgt: [0, 1.65, -3] },
    { p: .6, pos: [0, 1.56, -.3], tgt: [0, 1.6, -5] },
  ];
  return start.concat(end);
}
// Les reflets d'une pièce : une photo à 360° prise une fois, au point `pos`, pour les miroirs et les surfaces brillantes
export function cubeEnv(scene, pos, size = 256) {
  const rt = new THREE.WebGLCubeRenderTarget(size, { type: THREE.FloatType }); const cc = new THREE.CubeCamera(.05, 40, rt);
  cc.position.set(...pos); scene.add(cc); cc.update(R, scene); return rt.texture;
}
export function mirror() { return new THREE.MeshStandardMaterial({ color: 0xe8ecef, metalness: 1, roughness: .02, envMapIntensity: 1 }); }
// Des flacons sur une étagère : cylindres, épaules, bouchons, en couleurs données
export function bottles(parent, x, y, z, n, colors, o = {}) {
  const dir = o.dir ?? [0, 0, 1], step = o.step ?? .11;
  for (let i = 0; i < n; i++) {
    const h = (o.h ?? .18) * (.75 + ((i * 37) % 10) / 20), r = (o.r ?? .03) * (.8 + ((i * 53) % 10) / 25);
    const col = colors[i % colors.length];
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 18), new THREE.MeshStandardMaterial({ color: col, roughness: .25, metalness: 0, envMapIntensity: .6 }));
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * .55, r * .6, h * .22, 14), new THREE.MeshStandardMaterial({ color: o.cap ?? 0x1a1a1a, roughness: .3, metalness: .4 }));
    const px = x + dir[0] * (i - (n - 1) / 2) * step, pz = z + dir[2] * (i - (n - 1) / 2) * step;
    body.position.set(px, y + h / 2, pz); cap.position.set(px, y + h + h * .11, pz); body.castShadow = cap.castShadow = true; parent.add(body, cap);
  }
}

// Un panneau lumineux au plafond (lumière douce, sans tache) : la lumière vers le bas, et le panneau visible
export function panel(parent, x, y, z, w, d, i = 4, color = 0xffe7cc, o = {}) {
  const L = new THREE.RectAreaLight(color, i, w, d); L.position.set(x, y - .01, z); L.lookAt(x, 0, z); parent.add(L);
  if (o.visible !== false) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .02, d), std(0xffffff, { e: color, ei: o.ei ?? 1.4 })); m.position.set(x, y, z); m.castShadow = false; m.userData.noOcclude = true; parent.add(m); }
  return L;
}
