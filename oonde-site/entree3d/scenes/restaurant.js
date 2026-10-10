// Restaurant : un bistrot dans une rue pavée, le soir. Terrasse, ardoise, salle chaude, comptoir, banquette.
// Enseignes remplies par la page : `sign` (bandeau de façade) et `wall` (le nom au mur du fond).
export default async function ({ THREE, kit, scene, portrait }) {
  kit.sky(scene); kit.env(scene, 'cobblestone_street_night', .55, 1.2);
  kit.street(scene);
  const shop = kit.shopfront(scene, { stone: 'large_sandstone_blocks', wall: 0xefe1cc, shutter: 0x4f6259, base: 0x22352e, frame: 0x17191c });
  kit.shopfront(scene, { x: -9.6, wall: 0xd9c9b4, shutter: 0x6a5546, dark: true, seed: 2, floors: 4 });
  kit.shopfront(scene, { x: 9.6, wall: 0xe6d9c3, shutter: 0x5b6670, dark: true, seed: 5 });
  // la nuit : une lune froide qui dessine les ombres, un ciel qui éclaire un peu
  const moon = new THREE.DirectionalLight(0x9fb2ff, .7); moon.position.set(-9, 16, 14); moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -14, right: 14, top: 14, bottom: -6, far: 60 }); moon.shadow.bias = -.0004; scene.add(moon);
  scene.add(new THREE.HemisphereLight(0x5068c0, 0x2a2018, .7));
  // réverbère
  kit.model('street_lamp_01', { pos: [-5.4, .14, 2.85], h: 4.4, parent: scene });
  const sl = new THREE.PointLight(0xffc38a, 25, 14, 2); sl.position.set(-5.4, 4.1, 2.4); scene.add(sl);

  // ——— la salle ———
  const R = kit.room(scene, {
    floor: kit.pbr('wood_floor', { s: 2.2, roughness: .7, env: .8 }),
    wall: kit.pbr('plastered_wall', { s: 2.5, color: 0xdcb48e }),
    ceiling: kit.std(0xe7dccb, { r: .95 }),
  });
  const g = R.g;
  const green = kit.std(0x203a31, { r: .55 }), wood = kit.pbr('dark_wood', { s: 1.2, roughness: .5 }), marble = kit.pbr('marble_01', { s: 1.4, roughness: .25, env: 1.2 });
  // soubassement vert sur les murs, avec une moulure
  kit.box(.06, 1.05, 7.4, green, -3.57, .67, -4.3, { parent: g }); kit.box(7.1, 1.05, .06, green, 0, .67, -7.97, { parent: g });
  kit.box(.08, .05, 7.4, wood, -3.55, 1.2, -4.3, { parent: g }); kit.box(7.1, .05, .08, wood, 0, 1.2, -7.95, { parent: g });
  // banquette en cuir au fond
  const leather = kit.pbr('fabric_leather_02', { s: .8, color: 0x7a2f22, roughness: .6 });
  kit.box(6.2, .45, .62, wood, 0, .36, -7.6, { parent: g }); kit.box(6.2, .14, .6, leather, 0, .65, -7.6, { parent: g }); kit.box(6.2, .62, .16, leather, 0, 1.0, -7.86, { parent: g });
  // tables et chaises
  const tables = [[-2.2, -3.4], [0.1, -4.4], [-2.2, -5.9], [1.0, -6.8], [-0.9, -6.8]];
  tables.forEach(([x, z], i) => {
    kit.model('round_wooden_table_01', { pos: [x, .14, z], h: .76, parent: g, tint: 0x8a6a52, mat: { metalness: 0, roughness: .62 } });
    // nappe blanche, deux assiettes, le bougeoir
    const cloth = kit.std(0xe4ddd0, { r: .95 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.57, .57, .012, 48), cloth); top.position.set(x, .908, z); top.receiveShadow = true; g.add(top);
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.575, .6, .32, 48, 1, true), kit.std(0xdcd4c6, { r: .95, side: THREE.DoubleSide })); skirt.position.set(x, .75, z); g.add(skirt);
    for (const dz of [-.25, .25]) { const pl = new THREE.Mesh(new THREE.CylinderGeometry(.13, .1, .015, 32), kit.std(0xfbfbf8, { r: .25 })); pl.position.set(x - .05, .922, z + dz); pl.castShadow = true; g.add(pl); }
    kit.model('brass_candleholders', { pos: [x + .18, .915, z], h: .2, parent: g, mat: { roughness: .4 } });
    if (z > -6.5) for (const [dx, dz, ry] of [[-.62, .1, Math.PI / 2], [.62, -.05, -Math.PI / 2]]) kit.model(i % 2 ? 'WoodenChair_01' : 'dining_chair_02', { pos: [x + dx, .14, z + dz], ry: ry + (i * .3 - .4) * .2, h: .9, parent: g });
  });
  // le comptoir à droite, avec son étagère de bouteilles
  kit.box(.62, 1.02, 3.6, wood, 2.9, .65, -4.7, { parent: g }); kit.box(.74, .05, 3.7, marble, 2.86, 1.18, -4.7, { parent: g });
  kit.box(.24, .03, 3.4, wood, 3.47, 1.75, -4.7, { parent: g }); kit.box(.24, .03, 3.4, wood, 3.47, 2.15, -4.7, { parent: g });
  for (let k = 0; k < 4; k++) { kit.model('wine_bottles_01', { pos: [3.45, 1.765, -3.4 - k * .82], ry: Math.PI / 2, h: .33, parent: g }); kit.model('wine_bottles_01', { pos: [3.45, 2.165, -3.8 - k * .7], ry: -Math.PI / 2, h: .33, parent: g }); }
  for (let k = 0; k < 3; k++) kit.model('bar_chair_round_01', { pos: [2.25, .14, -3.5 - k * 1.1], h: .8, parent: g });
  // plantes
  kit.model('potted_plant_04', { pos: [-3.1, .14, -1.0], h: 1.3, parent: g });
  kit.model('potted_plant_02', { pos: [3.05, .14, -7.4], h: 1.3, parent: g });
  // suspensions
  for (const [x, z] of [[-2.2, -3.4], [0.1, -4.4], [-2.2, -5.9], [2.6, -4.0], [2.6, -5.6]]) {
    kit.model('hanging_industrial_lamp', { pos: [x, 2.35, z], h: .8, parent: g, cast: false });
    kit.pendant(g, x, 2.38, z, { i: 3, dist: 6 });
  }
  const fill = new THREE.PointLight(0xffb87a, 3.5, 12, 2); fill.position.set(0, 2.9, -2); g.add(fill);
  // poutres, appliques, cadres
  for (let k = 0; k < 6; k++) kit.box(7.1, .22, .2, wood, 0, 3.04, -1.2 - k * 1.3, { parent: g, cast: false });
  kit.box(6.4, .04, .05, kit.std(0xb8925a, { m: 1, r: .3 }), 0, 1.22, -7.93, { parent: g });
  for (const x of [-2.6, 2.6]) { kit.model('industrial_wall_sconce', { pos: [x, 1.85, -7.9], h: .32, parent: g, cast: false }); const sc = new THREE.PointLight(0xffb36b, .7, 3, 2); sc.position.set(x, 2.05, -7.7); g.add(sc); }
  [['hanging_picture_frame_01', -2.6], ['hanging_picture_frame_02', -4.6], ['hanging_picture_frame_01', -6.4]].forEach(([n, z]) => kit.model(n, { pos: [-3.56, 1.55, z], ry: Math.PI / 2, h: .75, parent: g, cast: false }));
  // le nom au mur du fond (rempli par la page)
  const wy = 2.15, ww = 3.6, wh = .62;
  const wall = [new THREE.Vector3(-ww / 2, wy + wh / 2, -7.99), new THREE.Vector3(ww / 2, wy + wh / 2, -7.99), new THREE.Vector3(ww / 2, wy - wh / 2, -7.99), new THREE.Vector3(-ww / 2, wy - wh / 2, -7.99)];
  const wl = new THREE.PointLight(0xffd2a0, 1.2, 3, 2); wl.position.set(0, 2.6, -7.4); g.add(wl);

  // ——— la terrasse ———
  for (const x of [-2.5, 2.6]) kit.model('outdoor_table_chair_set_01', { pos: [x, .14, 1.45], ry: x < 0 ? .3 : -.2, h: .95, parent: scene });
  kit.model('standing_chalkboard_01', { pos: [1.15, .14, 1.0], ry: -.35, h: 1.0, parent: scene });
  for (const x of [-4.1, 4.1]) kit.model('planter_box_01', { pos: [x, .14, .55], h: .7, parent: scene });

  const path = portrait ? [
    { p: 0, pos: [0.2, 1.7, 12.5], tgt: [0, 2.45, 0], fov: 58 },
    { p: .2, pos: [0.15, 1.65, 8.6], tgt: [0, 2.3, 0] },
    { p: .36, pos: [0.05, 1.6, 5], tgt: [0, 1.9, -1] },
    { p: .48, pos: [0, 1.58, 2.0], tgt: [0, 1.6, -3] },
    { p: .6, pos: [0, 1.56, -.3], tgt: [0, 1.6, -5] },
    { p: .76, pos: [0.1, 1.55, -1.2], tgt: [0, 1.65, -8] },
    { p: 1, pos: [0.2, 1.55, -1.6], tgt: [0, 1.7, -8], fov: 64 },
  ] : [
    { p: 0, pos: [0.3, 1.7, 12.5], tgt: [0, 2.85, 0], fov: 40 },
    { p: .2, pos: [0.2, 1.65, 8.2], tgt: [0, 2.55, 0] },
    { p: .36, pos: [0.05, 1.6, 4.4], tgt: [0, 2.0, -1] },
    { p: .48, pos: [0, 1.58, 1.9], tgt: [0, 1.65, -3] },
    { p: .6, pos: [0, 1.56, -.3], tgt: [0, 1.6, -5] },
    { p: .76, pos: [0.25, 1.55, -1.4], tgt: [0, 1.65, -8] },
    { p: 1, pos: [0.5, 1.55, -2.2], tgt: [-0.1, 1.65, -8], fov: 48 },
  ];
  return {
    path, fov: 46, bloom: [.32, .5, .95],
    pins: [{ id: 'sign', corners: shop.sign }, { id: 'wall', corners: wall }],
    after() { kit.dimEnv(g, .22, .45); },
    update(p) { shop.openDoor(Math.min(1, Math.max(0, (p - .38) / .16))); },
  };
}
