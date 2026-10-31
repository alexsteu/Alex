// Ce que toutes les boutiques partagent : la rue, les voisins, l'heure du jour, le réverbère, et l'enseigne du fond.
// Chaque métier a son heure : la nuit (restaurant), le petit matin (boulangerie), le plein jour (coiffure),
// la fin d'après-midi dorée (institut), le crépuscule rose (onglerie). C'est elle qui donne le ton de la scène.
const TIMES = {
  night: { env: 'cobblestone_street_night', ei: .55, rot: 1.2, sky: {}, sun: [0x9fb2ff, .7, [-9, 16, 14]], hemi: [0x5068c0, 0x2a2018, .7], lamp: 25, spill: .2 },
  dawn: { env: 'spruit_sunrise', ei: .5, rot: 2.4, sky: { top: 0x6f93c9, mid: 0xb7c3d8, hor: 0xf4c9a0, stars: 0 }, sun: [0xffc58a, 3.2, [16, 5.5, 9]], hemi: [0xbcd0ee, 0x6e5a48, .55], lamp: 0, spill: .06, dark: .35 },
  day: { env: 'urban_street_01', ei: .75, rot: .4, sky: { top: 0x8fb3dd, mid: 0xc4d6ea, hor: 0xe9eef2, stars: 0 }, sun: [0xfff4e6, 2.6, [-7, 16, 12]], hemi: [0xdfeaf7, 0x8d8679, .9], lamp: 0, spill: 0, dark: .25 },
  golden: { env: 'venice_sunset', ei: .55, rot: 0, sky: { top: 0x5d7fb8, mid: 0xc9a98f, hor: 0xffb46e, stars: 0 }, sun: [0xffa860, 3.6, [-15, 4.2, 10]], hemi: [0xa9b9d9, 0x6a4b33, .55], lamp: 0, spill: .08, dark: .4 },
  dusk: { env: 'qwantani_dusk_2', ei: .45, rot: 1.0, sky: { top: 0x2c2f6b, mid: 0x9a6fa3, hor: 0xf5a6a0, stars: .4 }, sun: [0xff9fb0, .9, [12, 6, 10]], hemi: [0x8a7fc8, 0x3a2a30, .65], lamp: 18, spill: .16 },
};
export function street(THREE, kit, scene, o = {}) {
  const T = TIMES[o.time ?? 'night'];
  kit.sky(scene, T.sky); kit.env(scene, T.env, T.ei, T.rot);
  kit.street(scene, { wet: o.time === 'night' || !o.time, road: o.road, walk: o.walk });
  const day = T.dark ? { lit: () => false } : {};
  const shop = kit.shopfront(scene, { spillOp: T.spill, ...day, ...(o.shop || {}) });
  const nb = o.neighbours ?? {};
  kit.shopfront(scene, { x: -9.6, wall: o.leftWall ?? 0xd9c9b4, shutter: 0x6a5546, dark: true, seed: 2, floors: 4, darkOp: T.dark, ...day, ...(nb.left || {}) });
  kit.shopfront(scene, { x: 9.6, wall: o.rightWall ?? 0xe6d9c3, shutter: 0x5b6670, dark: true, seed: 5, darkOp: T.dark, ...day, ...(nb.right || {}) });
  const sun = new THREE.DirectionalLight(T.sun[0], T.sun[1]); sun.position.set(...T.sun[2]); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -8, far: 70 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02; scene.add(sun);
  scene.add(new THREE.HemisphereLight(...T.hemi));
  const lx = o.lampX ?? -5.4;
  if (o.streetLamp !== false) {
    kit.model('street_lamp_01', { pos: [lx, .14, 2.85], h: 4.4, parent: scene });
    if (T.lamp) { const sl = new THREE.PointLight(0xffc38a, T.lamp, 14, 2); sl.position.set(lx, 4.1, 2.4); scene.add(sl); }
  }
  return shop;
}
export function wallPin(THREE, y, w, h, z) {
  return [new THREE.Vector3(-w / 2, y + h / 2, z), new THREE.Vector3(w / 2, y + h / 2, z), new THREE.Vector3(w / 2, y - h / 2, z), new THREE.Vector3(-w / 2, y - h / 2, z)];
}
// Une guirlande d'ampoules tendue entre deux points, qui pend un peu (chaînette)
export function stringLights(THREE, kit, parent, a, b, n = 14, sag = .45, o = {}) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), pts = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, p = A.clone().lerp(B, t); p.y -= sag * 4 * t * (1 - t); pts.push(p); }
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, .008, 5), kit.std(0x111111, { r: .6 })); parent.add(wire);
  const bulbM = kit.std(0xffffff, { e: o.color ?? 0xffc684, ei: o.ei ?? 4 });
  for (let i = 1; i < n; i++) {
    const t = i / n, p = A.clone().lerp(B, t); p.y -= sag * 4 * t * (1 - t) + .06;
    const bl = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), bulbM); bl.position.copy(p); bl.userData.noOcclude = true; parent.add(bl);
    if (i % 4 === 2) { const L = new THREE.PointLight(o.color ?? 0xffc684, o.i ?? 1.6, 4, 2); L.position.copy(p); parent.add(L); }
  }
}
