// Boulangerie : carrelage, étagères de pains, vitrine réfrigérée de gâteaux, caisse, paniers, lumière dorée.
import { street, wallPin } from '../kit/common.js';
export default async function ({ THREE, kit, scene, portrait }) {
  const shop = street(THREE, kit, scene, { shop: { stone: 'large_sandstone_blocks', wall: 0xeee2c8, shutter: 0x4d5f6e, base: 0x5a3b2a, frame: 0x2a1d16, seed: 8 }, leftWall: 0xdcd3c3, rightWall: 0xe2cfb4, lampX: 5.4 });
  const D = 6.2;
  const R = kit.room(scene, { d: D,
    floor: kit.pbr('interior_tiles', { s: 1.4, roughness: .45, env: .7 }),
    wall: kit.pbr('long_white_tiles', { s: 1.2, roughness: .35, color: 0xf3ede2 }),
    back: kit.pbr('plastered_wall', { s: 2.4, color: 0xe9d3b4 }),
    ceiling: kit.std(0xf1ebe0, { r: .95 }) });
  const g = R.g;
  const wood = kit.pbr('dark_wood', { s: 1.2, roughness: .5 }), marble = kit.pbr('marble_01', { s: 1.2, roughness: .25 }), brass = kit.std(0xc9a46a, { m: 1, r: .3 });
  // le comptoir vitré en travers, avec les gâteaux
  kit.box(3.6, .95, .7, wood, -.4, .615, -3.9, { parent: g }); kit.box(3.7, .05, .78, marble, -.4, 1.115, -3.9, { parent: g });
  const gl = kit.glass({ op: .12 });
  const vit = new THREE.Mesh(new THREE.BoxGeometry(2.2, .42, .62), gl); vit.position.set(-1.0, 1.35, -3.9); vit.userData.noOcclude = true; g.add(vit);
  kit.box(2.2, .02, .62, kit.std(0xf4efe6, { r: .5 }), -1.0, 1.15, -3.9, { parent: g, cast: false });
  [['strawberry_chocolate_cake', -1.75], ['carrot_cake', -1.25], ['strawberry_chocolate_cake', -.75], ['carrot_cake', -.25]].forEach(([n, x]) => kit.model(n, { pos: [x, 1.16, -3.9], h: .12, parent: g }));
  const vl = new THREE.PointLight(0xfff1dc, .6, 1.4, 2); vl.position.set(-1.0, 1.52, -3.9); g.add(vl);
  kit.model('CashRegister_01', { pos: [.95, 1.14, -3.95], ry: Math.PI, h: .3, parent: g });
  // les pains : étagères le long du mur du fond et paniers
  // trois longues planches de pains sur le mur du fond, de part et d'autre du nom
  for (const [y, n] of [[.75, 0], [1.2, 1], [1.65, 2]]) for (const side of [-1, 1]) {
    const cx = side * 1.9; kit.box(2.2, .04, .42, wood, cx, y, -D + .23, { parent: g });
    for (let k = 0; k < 7; k++) { const x = cx - .9 + k * .3; kit.model((k + n) % 3 === 0 ? 'croissant' : 'hamburger_buns', { pos: [x, y + .02, -D + .23 + ((k % 2) - .5) * .12], ry: k * 1.3, h: (k + n) % 3 === 0 ? .07 : .1, parent: g }); }
  }
  for (const x of [-1.9, 1.9]) { const L = new THREE.PointLight(0xffcf96, 1, 3, 2); L.position.set(x, 2.2, -D + .8); g.add(L); }
  for (const [x, z] of [[2.7, -1.6], [2.7, -2.4], [-2.9, -1.8]]) { kit.model(x > 0 ? 'wicker_basket_01' : 'wicker_basket_02', { pos: [x, .14, z], h: .38, parent: g }); for (let k = 0; k < 3; k++) kit.model('croissant', { pos: [x - .08 + k * .08, .52, z], ry: k * 2, h: .06, parent: g }); }
  kit.model('wooden_crate_01', { pos: [2.85, .14, -3.4], ry: .2, h: .45, parent: g });
  kit.model('standing_chalkboard_01', { pos: [-2.9, .14, -3.2], ry: .6, h: 1.0, parent: g });
  // suspensions en laiton au-dessus du comptoir
  for (const x of [-1.6, -.4, .8]) { const cord = kit.box(.01, .7, .01, kit.std(0x111111), x, 2.8, -3.9, { parent: g, cast: false }); const sh = new THREE.Mesh(new THREE.ConeGeometry(.2, .22, 28, 1, true), kit.std(0xc9a46a, { m: 1, r: .3, side: THREE.DoubleSide })); sh.position.set(x, 2.38, -3.9); g.add(sh); kit.pendant(g, x, 2.3, -3.9, { i: 2.4, color: 0xffcb8a }); }
  kit.panel(g, 0, 3.13, -1.8, 1.6, .5, 12, 0xffe6c4);
  kit.panel(g, 0, 3.13, -5.3, 2.4, .4, 9, 0xffe0b8);
  const wall = wallPin(THREE, 2.55, 2.4, .5, -D + .01);
  // dehors : l'ardoise et des caisses de fleurs
  kit.model('standing_chalkboard_01', { pos: [1.2, .14, 1.0], ry: -.35, h: 1.0, parent: scene });
  for (const x of [-4.1, 4.1]) kit.model('planter_box_01', { pos: [x, .14, .55], h: .7, parent: scene });

  const path = kit.entryPath(portrait, portrait ? [
    { p: .76, pos: [0.3, 1.6, -0.9], tgt: [0, 1.55, -D] },
    { p: 1, pos: [0.6, 1.62, -0.8], tgt: [-0.1, 1.55, -D], fov: 66 },
  ] : [
    { p: .76, pos: [0.4, 1.6, -1.0], tgt: [0, 1.6, -D] },
    { p: 1, pos: [0.9, 1.64, -0.9], tgt: [-0.2, 1.55, -D], fov: 54 },
  ]);
  return { path, fov: 46, bloom: [.22, .45, 1.1], exposure: 1.25,
    pins: [{ id: 'sign', corners: shop.sign }, { id: 'wall', corners: wall }],
    after() { kit.dimEnv(g, .3, .3); },
    update(p) { shop.openDoor(Math.min(1, Math.max(0, (p - .38) / .16))); } };
}
