// La rue au crépuscule : l'ouverture de oonde.ch. Un seul plan-séquence.
// On ouvre serré sur un réverbère dont l'ampoule est le point bleu du logo, on recule, la rue apparaît ;
// la caméra longe six vitrines allumées (restaurant, boulangerie, coiffure, institut, onglerie), puis se pose
// face à la dernière façade, enseigne vide (pin `sign`) : la page y écrit le nom du visiteur. À la fin, la porte s'ouvre.
// Pins : `sign` (l'enseigne vide) et une par métier (le nom du métier s'inscrit au passage).
export default async function ({ THREE, kit, scene, portrait }) {
  const BLUE = 0x2038ec;
  // v21 : ?va=1 : le film du glissement, à la hauteur de l'arrêt, d'une façade à l'autre (le lecteur s'y déplace quand on choisit un métier) ;
  // ?int=<métier>&at=1 : la suite derrière la façade de ce métier (toute la rue glisse pour la poser en x = 0 : la caméra et la salle ne bougent pas).
  const Q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
  const INT = Q.get('int'), VA = Q.get('va') === '1', AT = !!INT && Q.get('at') === '1', SIX = VA || AT;
  const St = new THREE.Group(); scene.add(St);
  kit.sky(scene, { top: 0x1d2156, mid: 0x7d5f98, hor: 0xf0a08e, stars: .35 });
  kit.env(scene, 'qwantani_dusk_2', .26, 1.0);
  // la rue, longue : pavés à peine mouillés, trottoir, bordure
  const g0 = new THREE.Group(); St.add(g0);
  const cob = kit.pbr('cobblestone_floor_08', { s: 2.2, roughness: .32, ns: 1.2, env: 2.0 });
  const road = kit.plane(150, 30, cob); road.rotation.x = -Math.PI / 2; road.position.set(-24, 0, 18.2); g0.add(road);
  const pav = kit.pbr('concrete_pavement', { s: 1.6, env: .9 });
  kit.box(150, .14, 3.2, pav, -24, .07, 1.6, { cast: false, parent: g0 });
  kit.box(150, .16, .22, kit.std(0x8d8a84, { r: .8 }), -24, .08, 3.15, { cast: false, parent: g0 });

  const lit = (f, i) => (f * 5 + i * 3) % 4 === 1;   // quelques fenêtres allumées aux étages
  const S = 9.6;   // v20.1 : les façades font exactement S de large (9,4 laissait une fente de 20 cm où le ciel passait)
  // les six façades, de gauche à droite : on les longe dans cet ordre
  const shops = [
    { id: 'restaurant', x: -5 * S, o: { stone: 'large_sandstone_blocks', wall: 0xefe1cc, shutter: 0x4f6259, base: 0x22352e, frame: 0x17191c, awning: ['#1f4a3b', '#d8cdb6'], awningDepth: 1.5, signY: 3.72, signH: .56 }, warm: 0xffb066 },
    { id: 'boulangerie', x: -4 * S, o: { facade: 'wood', paint: 0x5a1c22, trim: 0xc9a25e, signStyle: 'fascia', signW: 5.4, signH: .6, grid: [4, 3], wall: 0xf2e6cf, shutter: 0x7a3b33, base: 0x5a1c22, frame: 0x3a1215, lamps: false }, warm: 0xffc27a },
    { id: 'coiffure', x: -3 * S, o: { modern: true, facade: 'modern', concrete: false, concreteTint: 0xc9c6bf, thin: true, mullion: false, signStyle: 'none', signW: 4.6, signH: .5, signY: 3.62, wall: 0xe9e6e0, plaster: 'painted_plaster_wall', frame: 0x141518, lamps: false, floors: 3, windows: 3 }, warm: 0xffe6c8 },
    { id: 'institut', x: -2 * S, o: { facade: 'arch', signStyle: 'none', signW: 3.6, signH: .42, signY: 3.72, stone: 'plastered_wall', stoneTint: 0xe9dccd, wall: 0xeedfd2, plaster: 'painted_plaster_wall', shutter: 0x9a8a76, base: 0xd9c8b6, frame: 0x3a2e26, lamps: false, mullion: false }, warm: 0xffcf9a },
    { id: 'onglerie', x: -1 * S, o: { facade: 'stone', stone: 'long_white_tiles', stoneTint: 0xf6e1e2, wall: 0xf0d4d6, plaster: 'clay_plaster', shutter: 0xd99aa6, base: 0xe9c3c8, frame: 0xd8b7a0, awning: ['#e7a9b6', '#fbefee'], awningDepth: 1.2, signFrame: 0xd8b07a }, warm: 0xffd6d6 },
  ];
  // v21 : le logement, à droite de la vôtre (à la place du voisin éteint) : seulement dans le glissement et les suites « at »
  if (SIX) shops.push({ id: 'logement', x: S, o: { stone: 'plastered_wall', stoneTint: 0xddd3c3, wall: 0xe6d9c3, plaster: 'painted_plaster_wall', shutter: 0x55636c, base: 0x2e3a40, frame: 0x22282c, awning: ['#3d4a52', '#ebe5d8'], awningDepth: 1.1, signFrame: 0x7a7468 }, warm: 0xffc996 });
  const X0 = AT ? -shops.find(s => s.id === INT).x : 0; St.position.x = X0;
  const pins = [];
  for (const s of shops) {
    const f = kit.shopfront(St, { w: S,  x: s.x, seed: s.x, lit, spillOp: .2, spill: s.warm, ...s.o }); s.f = f;
    pins.push({ id: s.id, corners: f.sign.map(v => v.clone().add(new THREE.Vector3(s.x + X0, 0, 0))) });
    if (AT && s.id === INT) continue;   // derrière cette façade-là : la salle du métier (plus bas)
    // l'intérieur, vu par la vitrine : sol, mur du fond chaud, une lumière
    const g = new THREE.Group(); g.position.x = s.x; St.add(g);
    const fl = kit.plane(7.2, 3.5, kit.std(0x6b5444, { r: .6 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, .15, -1.75); g.add(fl);
    const bk = kit.plane(7.2, 3.2, kit.pbr('plastered_wall', { s: 2.4, color: 0xd8c2a8 })); bk.position.set(0, 1.6, -3.4); g.add(bk);
    // un comptoir et des étagères en silhouette, éclairés par l'arrière : la vitrine a de la profondeur
    const wd = kit.std(0x3b2a20, { r: .55 });
    if (s.id !== 'logement') { kit.box(2.4, 1.0, .55, wd, 1.6, .64, -2.6, { parent: g }); kit.box(2.5, .04, .62, kit.std(0xc9b49a, { r: .35 }), 1.6, 1.16, -2.6, { parent: g });
    for (const y of [1.35, 1.85, 2.35]) kit.box(2.6, .04, .3, wd, -1.8, y, -3.25, { parent: g, cast: false }); }
    const glowB = new THREE.PointLight(s.warm, 3.6, 5, 2); glowB.position.set(0, 1.6, -2.6); g.add(glowB);
    const ce = kit.plane(7.2, 3.5, kit.std(0xe8ddcf, { r: .9 })); ce.rotation.x = Math.PI / 2; ce.position.set(0, 3.14, -1.75); g.add(ce);
    for (const sx of [-1, 1]) { const w = kit.plane(3.5, 3.2, kit.std(0x8a7360, { r: .9 })); w.rotation.y = -sx * Math.PI / 2; w.position.set(sx * 3.6, 1.6, -1.75); g.add(w); }
    for (const x of [-2, 0, 2]) kit.pendant(g, x, 2.8, -1.4, { i: 2.2, dist: 6, color: s.warm, r: .04 });
    if (s.id === 'restaurant') { for (const x of [-2.4, 2.4]) kit.model('outdoor_table_chair_set_01', { pos: [x, .14, 1.5], ry: x < 0 ? .3 : -.2, h: .95, parent: g }); kit.model('standing_chalkboard_01', { pos: [1.0, .14, 1.0], ry: -.35, h: 1.0, parent: g }); for (const x of [-2, 0, 2]) kit.model('round_wooden_table_01', { pos: [x, .15, -1.6], h: .76, parent: g, tint: 0x8a6a52 }); }
    if (s.id === 'boulangerie') { kit.model('wooden_display_shelves_01', { pos: [-1.8, .15, -2.6], h: 1.8, parent: g }); kit.model('wooden_display_shelves_01', { pos: [1.8, .15, -2.6], h: 1.8, parent: g }); kit.model('wooden_crate_01', { pos: [-2.5, .14, .7], ry: .1, h: .42, parent: g }); kit.model('wicker_basket_02', { pos: [-2.5, .56, .7], h: .3, parent: g }); }
    if (s.id === 'coiffure') { for (const x of [-2.2, 0, 2.2]) kit.model('BarberShopChair_01', { pos: [x, .15, -2.2], h: 1.05, parent: g }); kit.model('potted_plant_04', { pos: [3, .15, -.8], h: 1.3, parent: g }); }
    if (s.id === 'institut') { kit.model('mid_century_lounge_chair', { pos: [-1.8, .15, -2], ry: .4, h: .85, parent: g }); kit.model('ceramic_vase_02', { pos: [1.8, .15, -1.2], h: .6, parent: g }); kit.model('pachira_aquatica_01', { pos: [2.6, .15, -2.4], h: 1.6, parent: g }); }
    if (s.id === 'logement') { kit.model('Sofa_01', { pos: [-1.4, .15, -2.6], h: .85, parent: g }); kit.model('throw_pillows_01', { pos: [-1.4, .55, -2.5], h: .38, parent: g }); kit.model('coffee_table_round_01', { pos: [-1.3, .15, -1.3], h: .42, parent: g }); kit.model('potted_plant_02', { pos: [2.6, .15, -2.6], h: 1.4, parent: g }); kit.model('mid_century_lounge_chair', { pos: [1.4, .15, -1.9], ry: -.5, h: .85, parent: g }); }
    if (s.id === 'onglerie') { const pol = [0xc2182b, 0xe2566f, 0xf2a7b5, 0x8e2440, 0xb38bd0, 0xe8743b, 0x4b6fa8]; for (let r = 0; r < 4; r++) kit.bottles(g, -1.7, 1.0 + r * .32, -3.3, 30, pol.slice(r % 3).concat(pol), { dir: [1, 0, 0], step: .11, h: .1, r: .02 }); kit.model('modern_arm_chair_01', { pos: [1.6, .15, -1.8], h: .82, parent: g, tint: 0xf1d8d3 }); }
  }
  // les voisins aux deux bouts, éteints
  kit.shopfront(St, { w: S,  x: -6 * S, wall: 0xd9c9b4, shutter: 0x6a5546, dark: true, seed: 2, floors: 4, lit });
  if (!SIX) kit.shopfront(St, { w: S,  x: S, wall: 0xe6d9c3, shutter: 0x5b6670, dark: true, seed: 5, lit });
  else kit.shopfront(St, { w: S,  x: 2 * S, wall: 0xd8cbb6, shutter: 0x6a5c4e, dark: true, seed: 7, lit });

  // ——— la façade d'arrivée : la vôtre, enseigne vide ———
  const T = kit.shopfront(St, { w: S,  x: 0, stone: 'white_sandstone_blocks_02', wall: 0xeee3d3, shutter: 0x3f4a56, base: 0x23272d, frame: 0x15171a, signW: 5.2, signH: .66, signFrame: 0x3a3c40, spillOp: .24, lit });
  // v19 : ?int=restaurant… derrière cette même façade, la salle du métier (celle de sa démo), et la caméra continue
  // depuis l'arrêt : la porte s'ouvre, on entre, on s'arrête dans la salle. Le dehors du métier (sa rue, sa terrasse) est laissé
  // de côté : on ne garde que ce que kit.room() construit, posé dans cette scène.
  let M = null;
  if (INT) {
    const mod = await import(`./${INT}.js`), dummy = new THREE.Group();
    const kp = { ...kit, room: (sc, o) => kit.room(scene, o), cubeEnv: (sc, ...r) => kit.cubeEnv(scene, ...r) };
    M = await mod.default({ THREE, kit: kp, scene: dummy, portrait });
  }
  const R = INT ? { g: new THREE.Group() } : kit.room(scene, { d: 6.2,
    floor: kit.pbr('wood_floor', { s: 2, roughness: .7, color: 0xe7d3bb }),
    wall: kit.pbr('plastered_wall', { s: 2.4, color: 0xf4e8da }),
    back: kit.std(0xd9c2a6, { r: .85 }),
    ceiling: kit.std(0xf3ece3, { r: .95 }) });
  const g = R.g;
  if (!INT) {
  for (const [x, z] of [[-1.8, -1.8], [1.8, -1.8], [0, -3.8]]) { kit.model('hanging_industrial_lamp', { pos: [x, 2.35, z], h: .7, parent: g, cast: false }); kit.pendant(g, x, 2.4, z, { i: 3.2, dist: 7 }); }
  kit.model('potted_plant_02', { pos: [-2.9, .14, -5.4], h: 1.4, parent: g });
  kit.model('pachira_aquatica_01', { pos: [3.0, .14, -4.8], h: 1.6, parent: g });
  kit.model('wooden_table_02', { pos: [0, .14, -4.4], h: .8, parent: g });
  kit.model('modern_wooden_cabinet', { pos: [-2.4, .14, -5.9], h: 1.1, parent: g });
  kit.model('mid_century_lounge_chair', { pos: [2.2, .14, -3.0], ry: -.6, h: .85, parent: g });
  kit.model('fancy_picture_frame_01', { pos: [0, 1.7, -6.15], h: .9, parent: g, cast: false });
  const wb = new THREE.PointLight(0xffd2a0, 1.6, 4, 2); wb.position.set(0, 2.6, -5.4); g.add(wb);
  kit.model('ceramic_vase_03', { pos: [.4, .94, -4.4], h: .3, parent: g });
  const fill = new THREE.PointLight(0xffc48a, 3.0, 10, 2); fill.position.set(0, 2.8, -2); g.add(fill);
  }
  pins.push({ id: 'sign', corners: T.sign.map(v => v.clone().add(new THREE.Vector3(X0, 0, 0))) });

  // le réverbère du début : son globe est le point bleu
  const LX = HEAD[0];
  // un lampadaire à globe : mât fin en fonte, crosse, globe opalin qui brille bleu
  const iron = kit.std(0x15171b, { m: .7, r: .4 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.05, .09, 4.1, 20), iron); post.position.set(LX, .14 + 2.05, 2.85); post.castShadow = true; St.add(post);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.16, .2, .5, 20), iron); foot.position.set(LX, .39, 2.85); St.add(foot);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(.13, .06, .14, 24), iron); cup.position.set(LX, 4.28, 2.85); St.add(cup);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(.26, 48, 32), kit.std(0x000000, { e: BLUE, ei: 2.4 })); glow.userData.noOcclude = true; St.add(glow);
  const bl = new THREE.PointLight(0x5b6cff, 9, 12, 2); St.add(bl);
  // un second réverbère, chaud, au milieu de la rue
  kit.model('street_lamp_01', { pos: [-2.5 * S, .14, 2.85], h: 4.4, parent: St });
  const wl = new THREE.PointLight(0xffc38a, 14, 14, 2); wl.position.set(-2.5 * S, 4.1, 2.4); St.add(wl);

  // le crépuscule : un soleil rose très bas, le ciel bleu violet
  const sun = new THREE.DirectionalLight(0xff9fb0, .45); sun.position.set(-30, 6, 14); sun.target.position.set(-20, 0, 0); sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 2048); Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 16, bottom: -8, far: 90 }); sun.shadow.bias = -.0004; sun.shadow.normalBias = .02; St.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0x5a66b8, 0x2a2028, .32));

  const head = HEAD;
  glow.position.set(...head); bl.position.set(head[0], head[1] - .1, head[2] + .1);
  const door = AT ? shops.find(s => s.id === INT).f : T;
  if (M) {
    const path = camIn(portrait, M.path, M.fov), e1 = M.exposure ?? 1, sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
    return {
      path, fov: M.fov, bloom: [.42, .55, .9], exposure: .9,
      pins: [{ id: 'sign', corners: door.sign.map(v => v.clone().add(new THREE.Vector3(AT ? 0 : X0, 0, 0))) }, ...M.pins.filter(q => q.id === 'wall')],
      after() { return M.after?.(); },
      update(p) { door.openDoor(sm((p - .03) / .3)); },
      // l'œil s'habitue : de la rue (0,9) à la lumière de la salle, pendant le passage de la porte
      expAt(p) { return .9 + (e1 - .9) * sm((p - .25) / .35); },
      bloomAt(p) { return .42 + ((M.bloom?.[0] ?? .3) - .42) * sm((p - .25) / .35); },
    };
  }
  if (VA) return { path: Q.get('ap') === '1' ? camAp(portrait) : camVa(portrait), fov: 42, bloom: [.42, .55, .9], exposure: .9, pins, after() { kit.dimEnv(g, .3, .45); } };
  const path = camPath(portrait);
  return {
    path, fov: 42, bloom: [.42, .55, .9], exposure: .9,
    pins,
    after() { kit.dimEnv(g, .3, .45); },
    update(p) { T.openDoor(Math.min(1, Math.max(0, (p - .9) / .1))); },
  };
}
// v19 : la suite, depuis l'arrêt (p .88 de la rue) : la même pose, la porte, puis la fin du parcours du métier (ses clés dès le seuil)
export function camIn(portrait, mp, mfov) {
  const st = camPath(portrait).find(k => k.p === .88), f0 = st.fov;
  const tail = mp.filter(k => k.p >= .48), p0 = tail[0].p;
  const keys = [{ p: 0, pos: st.pos, tgt: st.tgt, fov: f0 },
    { p: .22, pos: [0, 1.64, portrait ? 5.6 : 5.2], tgt: [0, 1.8, -2], fov: f0 + (mfov - f0) * .4 }];
  tail.forEach((k, i) => keys.push({ p: .4 + .6 * (k.p - p0) / (1 - p0), pos: k.pos, tgt: k.tgt, fov: k.fov ?? mfov }));
  return keys;
}

// v21 : le glissement, à la pose de l'arrêt (p .88), de la façade du restaurant (-5S) à celle du logement (+S) ; une façade tous les 1/6
export function camVa(portrait) {
  const st = camPath(portrait).find(k => k.p === .88), S = 9.6;
  return Array.from({ length: 7 }, (_, k) => { const x = (k - 5) * S; return { p: k / 6, pos: [st.pos[0] + x, st.pos[1], st.pos[2]], tgt: [st.tgt[0] + x, st.tgt[1], st.tgt[2]], fov: st.fov }; });
}
// v22 : l'approche (?va=1&ap=1) : l'affiche est votre façade, de face, depuis le trottoir d'en face (l'enseigne vide au tiers haut ;
// sur ordinateur, dans le tiers droit, la caméra décalée sans tourner : l'enseigne reste un rectangle). La caméra traverse la rue
// en filant vers la gauche jusqu'à la pose de l'image 0 du glissement (le restaurant) : la marche le rejoue ensuite jusqu'à la vôtre.
export function camAp(portrait) {
  const v0 = camVa(portrait)[0];
  return portrait ? [
    { p: 0, pos: [0, 2.15, 20.5], tgt: [0, .05, 0], fov: 58 },
    { p: .45, pos: [-20, 1.95, 16.5], tgt: [-27, 1.4, 0], fov: 58 },
    { p: .8, pos: [-40, 1.78, 12.5], tgt: [-45, 2.3, 0], fov: 58 },
    { p: 1, pos: v0.pos, tgt: v0.tgt, fov: v0.fov },
  ] : [
    { p: 0, pos: [-4.2, 2.3, 19], tgt: [-4.2, 1.19, 0], fov: 42 },
    { p: .45, pos: [-22, 2.0, 14.5], tgt: [-30, 1.6, 0], fov: 42 },
    { p: .8, pos: [-41, 1.78, 10.4], tgt: [-46, 2.15, 0], fov: 42 },
    { p: 1, pos: v0.pos, tgt: v0.tgt, fov: v0.fov },
  ];
}
// La caméra, à part : render.html la suit, et tools/plist.mjs y place les images (autant de changement entre deux images).
// L'ouverture : un seul tour autour du réverbère, à rayon croissant, le globe au centre ; puis le recul sur la rue.
// (La v16 faisait ce tour en trois clés : la caméra frôlait le mur et l'image sautait.)
export const HEAD = [-5 * 9.6 - 5.4, 4.6, 2.85];
export function camPath(portrait) {
  const H = HEAD, sm = x => x * x * (3 - 2 * x), mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const k0 = portrait ? { pos: [H[0] - .5, H[1] - 1.2, H[2] - 1.9], tgt: [H[0] + .1, H[1] + .25, H[2] + 1], fov: 50 }
                      : { pos: [H[0] - .5, H[1] - 1.1, H[2] - 2.1], tgt: [H[0] + 1.0, H[1] + .05, H[2] + 1], fov: 36 };   // le globe dans le tiers droit : le titre à gauche
  const k1 = portrait ? { pos: [H[0] + 2.2, 3.2, 8.5], tgt: [H[0] + 4, 2.6, 0], fov: 54 } : { pos: [H[0] + 1.8, 3.3, 8], tgt: [H[0] + 5, 2.6, 0], fov: 40 };
  const ang = o => Math.atan2(o[2] - H[2], o[0] - H[0]), rad = o => Math.hypot(o[0] - H[0], o[2] - H[2]);
  const th0 = ang(k0.pos), th1 = ang(k1.pos) - 2 * Math.PI, r0 = rad(k0.pos), r1 = rad(k1.pos);   // par le côté gauche, loin des stores
  const globe = [H[0], H[1] - .15, H[2]], K = 10, keys = [{ p: 0, ...k0 }];
  for (let j = 1; j < K; j++) {
    const s = j / K, e = sm(s), th = th0 + (th1 - th0) * e, r = r0 + (r1 - r0) * e * e, y = k0.pos[1] + (k1.pos[1] - k0.pos[1]) * e;
    const tgt = s < .3 ? mix(k0.tgt, globe, sm(s / .3)) : mix(globe, k1.tgt, sm((s - .3) / .7));
    keys.push({ p: .12 * s, pos: [H[0] + r * Math.cos(th), y, H[2] + r * Math.sin(th)], tgt, fov: k0.fov + (k1.fov - k0.fov) * e });
  }
  keys.push({ p: .12, ...k1 });
  return keys.concat(portrait ? [
    { p: .26, pos: [-43, 2.0, 10.5], tgt: [-38, 2.3, 0], fov: 58 },
    { p: .44, pos: [-30, 1.8, 10.5], tgt: [-25, 2.2, 0], fov: 58 },
    { p: .62, pos: [-17, 1.75, 10.5], tgt: [-12, 2.2, 0], fov: 58 },
    { p: .78, pos: [-5, 1.72, 11.2], tgt: [-1, 2.3, 0], fov: 58 },
    { p: .88, pos: [0, 1.72, 11.4], tgt: [0, 2.55, 0], fov: 58 },
    { p: 1, pos: [0, 1.66, 6.4], tgt: [0, 1.9, -2], fov: 56 },
  ] : [
    { p: .26, pos: [-44, 2.0, 8.6], tgt: [-36, 2.3, 0], fov: 42 },
    { p: .44, pos: [-31, 1.8, 8.6], tgt: [-23, 2.2, 0], fov: 42 },
    { p: .62, pos: [-18, 1.75, 8.6], tgt: [-10, 2.2, 0], fov: 42 },
    { p: .78, pos: [-5.5, 1.72, 8.8], tgt: [-.8, 2.25, 0], fov: 42 },
    { p: .88, pos: [0, 1.72, 9.4], tgt: [0, 2.3, 0], fov: 42 },
    { p: 1, pos: [0, 1.66, 5.6], tgt: [0, 1.85, -2], fov: 44 },
  ]);
}
