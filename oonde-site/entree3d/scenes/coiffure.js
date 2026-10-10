// Coiffure : un salon clair, parquet en chevrons, trois postes face aux miroirs, accueil, coin d'attente, mur du fond vert sauge.
export default async function ({ THREE, kit, scene, portrait }) {
  kit.sky(scene); kit.env(scene, 'cobblestone_street_night', .55, 1.2);
  kit.street(scene);
  const shop = kit.shopfront(scene, { stone: 'white_sandstone_blocks_02', wall: 0xe4e0d8, shutter: 0x5d6a72, base: 0xd9d3c8, frame: 0x141518, seed: 1 });
  kit.shopfront(scene, { x: -9.6, wall: 0xd8c3a8, shutter: 0x4e5f53, dark: true, seed: 3, floors: 4 });
  kit.shopfront(scene, { x: 9.6, wall: 0xcfd3cf, shutter: 0x705a4a, dark: true, seed: 6 });
  const moon = new THREE.DirectionalLight(0x9fb2ff, .7); moon.position.set(-9, 16, 14); moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -14, right: 14, top: 14, bottom: -6, far: 60 }); moon.shadow.bias = -.0004; scene.add(moon);
  scene.add(new THREE.HemisphereLight(0x5068c0, 0x2a2018, .7));
  kit.model('street_lamp_01', { pos: [5.4, .14, 2.85], h: 4.4, parent: scene });
  const sl = new THREE.PointLight(0xffc38a, 25, 14, 2); sl.position.set(5.4, 4.1, 2.4); scene.add(sl);

  const D = 6.5;
  const R = kit.room(scene, { d: D,
    floor: kit.pbr('terrazzo_tiles', { s: 1.4, roughness: .7, env: .6 }),
    wall: kit.pbr('clay_plaster', { s: 2.5, color: 0xf3eee6 }),
    back: kit.std(0x56665b, { r: .85 }),
    ceiling: kit.std(0xf2efe9, { r: .95 }),
  });
  const g = R.g;
  const brass = kit.std(0xc6a165, { m: 1, r: .28 }), oak = kit.pbr('wood_floor', { s: 1.2, roughness: .55, color: 0xbfae98 }), marble = kit.pbr('marble_01', { s: 1.2, roughness: .2 });
  const mir = kit.mirror(); const mirrors = [];
  // les trois postes : miroir haut à cadre laiton, tablette, flacons, fauteuil, globe au-dessus
  for (const z of [-2.2, -3.7, -5.2]) {
    kit.box(.04, 1.62, .86, brass, -3.57, 1.72, z, { parent: g, cast: false });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(.78, 1.54), mir); m.rotation.y = Math.PI / 2; m.position.set(-3.545, 1.72, z); m.userData.noOcclude = true; g.add(m); mirrors.push(m);
    kit.box(.36, .04, .95, oak, -3.42, .9, z, { parent: g });
    kit.bottles(g, -3.42, .92, z + .22, 3, [0x2b2f2c, 0xe9e2d6, 0x9c6b4e], { dir: [0, 0, 1], step: .09 });
    kit.model('BarberShopChair_01', { pos: [-2.55, .14, z], ry: Math.PI / 2, h: 1.05, parent: g });
    for (const dz of [-.47, .47]) { const led = new THREE.Mesh(new THREE.BoxGeometry(.03, 1.4, .03), kit.std(0xffffff, { e: 0xffe3c2, ei: 1.1 })); led.position.set(-3.52, 1.72, z + dz); g.add(led); }
    const ml = new THREE.PointLight(0xffe3c2, .9, 2.5, 2); ml.position.set(-3.2, 1.8, z); g.add(ml);
    kit.model('modern_ceiling_lamp_01', { pos: [-2.9, 2.55, z], h: .55, parent: g, cast: false });
    kit.pendant(g, -2.9, 2.62, z, { i: 2.4, color: 0xffe0bd, r: .03 });
  }
  // l'accueil, près de l'entrée
  kit.box(.62, 1.02, 1.5, oak, 2.75, .65, -1.7, { parent: g }); kit.box(.72, .05, 1.6, marble, 2.72, 1.18, -1.7, { parent: g });
  kit.model('ceramic_vase_02', { pos: [2.75, 1.205, -1.2], h: .32, parent: g });
  kit.model('calathea_orbifolia_01', { pos: [2.9, .14, -.9], h: .9, parent: g });
  // étagère de produits
  kit.model('steel_frame_shelves_01', { pos: [3.3, .14, -3.1], ry: -Math.PI / 2, h: 1.9, parent: g, tint: 0x2a2a2a });
  // coin d'attente
  kit.model('sofa_02', { pos: [3.05, .14, -4.6], ry: -Math.PI / 2, h: .8, parent: g, tint: 0xd8cbb8 });
  kit.model('coffee_table_round_01', { pos: [2.05, .14, -4.6], h: .42, parent: g });
  kit.model('pachira_aquatica_01', { pos: [3.0, .14, -6.0], h: 1.8, parent: g });
  // mur du fond : des lattes de chêne derrière le nom, une console basse et deux vases
  for (let k = 0; k < 23; k++) kit.box(.07, 2.25, .05, oak, -1.65 + k * .15, 1.0 + 1.125, -D + .04, { parent: g, cast: false });
  // mur du fond : une console basse et deux vases sous le nom
  kit.box(2.8, .5, .4, oak, 0, .39, -D + .22, { parent: g });
  kit.model('ceramic_vase_03', { pos: [-1.0, .64, -D + .22], h: .42, parent: g }); kit.model('ceramic_vase_02', { pos: [1.05, .64, -D + .22], h: .3, parent: g });
  kit.model('potted_plant_01', { pos: [-3.0, .14, -6.0], h: 1.2, parent: g });
  // lumière générale, douce
  for (const z of [-2.0, -4.4]) kit.panel(g, .4, 3.13, z, 1.6, .5, 20);
  const wl = new THREE.PointLight(0xffd9b0, 1.6, 3.5, 2); wl.position.set(0, 2.9, -D + .7); g.add(wl);
  const wy = 2.1, ww = 3.4, wh = .58;
  const wall = [new THREE.Vector3(-ww / 2, wy + wh / 2, -D + .01), new THREE.Vector3(ww / 2, wy + wh / 2, -D + .01), new THREE.Vector3(ww / 2, wy - wh / 2, -D + .01), new THREE.Vector3(-ww / 2, wy - wh / 2, -D + .01)];
  // dehors : deux grands pots de part et d'autre de la porte
  for (const x of [-1.25, 1.25]) { kit.model('planter_pot_clay', { pos: [x, .14, .55], h: .55, parent: scene }); kit.model('potted_plant_04', { pos: [x, .62, .55], h: .9, parent: scene }); }
  kit.model('planter_box_01', { pos: [-4.1, .14, .55], h: .7, parent: scene });

  const path = kit.entryPath(portrait, portrait ? [
    { p: .76, pos: [0.4, 1.58, -0.9], tgt: [-0.6, 1.6, -D] },
    { p: 1, pos: [0.9, 1.6, -0.9], tgt: [-0.6, 1.6, -D], fov: 66 },
  ] : [
    { p: .76, pos: [0.7, 1.58, -1.0], tgt: [-0.9, 1.6, -D] },
    { p: 1, pos: [1.7, 1.62, -1.0], tgt: [-1.1, 1.58, -D], fov: 54 },
  ]);
  return {
    path, fov: 46, bloom: [.18, .4, 1.2], exposure: 1.35,
    pins: [{ id: 'sign', corners: shop.sign }, { id: 'wall', corners: wall }],
    after() { kit.dimEnv(g, .25, .3); mir.envMap = kit.cubeEnv(scene, [-.5, 1.6, -3.7]); mir.envMapIntensity = .55; for (const m of mirrors) m.material = mir; },
    update(p) { shop.openDoor(Math.min(1, Math.max(0, (p - .38) / .16))); },
  };
}
