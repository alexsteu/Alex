// Onglerie : claire et rose poudré, deux tables de manucure avec lampes, un mur entier de vernis en couleurs.
import { street, wallPin } from '../kit/common.js';
export default async function ({ THREE, kit, scene, portrait }) {
  const shop = street(THREE, kit, scene, { shop: { stone: 'white_sandstone_blocks_02', wall: 0xf0dfdc, shutter: 0x6f7a80, base: 0xe9dcd8, frame: 0x1b1a1c, seed: 7 }, leftWall: 0xe2d4bf, rightWall: 0xcfc9c0 });
  const D = 6.2;
  const R = kit.room(scene, { d: D,
    floor: kit.pbr('marble_tiles', { s: 1.6, roughness: .35, env: .8 }),
    wall: kit.std(0xf4ebe8, { r: .9 }),
    back: kit.std(0xe8c9c6, { r: .85 }),
    ceiling: kit.std(0xf7f4f2, { r: .95 }) });
  const g = R.g;
  const white = kit.std(0xf7f5f2, { r: .4 }), gold = kit.std(0xd2b07a, { m: 1, r: .3 }), rose = kit.std(0xd9a9a6, { r: .7 });
  // le mur de vernis, à gauche : six étagères, des dizaines de couleurs
  const pol = [0xc2182b, 0xe2566f, 0xf2a7b5, 0x8e2440, 0xf6d6cf, 0x6b2c5e, 0xb38bd0, 0x2f2a33, 0xe8743b, 0xf3c3a5, 0x9e1b32, 0xd96f9a, 0x4b6fa8, 0x7fb3a4, 0xf0e1d8];
  for (let r = 0; r < 6; r++) { kit.box(.2, .025, 3.4, white, -3.5, .95 + r * .3, -3.3, { parent: g }); kit.bottles(g, -3.5, .965 + r * .3, -3.3, 30, pol.slice(r % 5).concat(pol), { dir: [0, 0, 1], step: .112, h: .1, r: .02, cap: 0xe9e2d6 }); }
  kit.box(.03, 2.1, 3.55, white, -3.6 + .02, 1.62, -3.3, { parent: g, cast: false }); for (const dz of [-1.79, 1.79]) kit.box(.05, 2.1, .03, gold, -3.57, 1.62, -3.3 + dz, { parent: g, cast: false });
  // deux tables de manucure, une lampe chacune, fauteuil client et tabouret
  for (const z of [-2.6, -4.3]) {
    kit.box(1.25, .05, .6, white, .55, .78, z, { parent: g }); kit.box(.05, .63, .55, white, -.05, .46, z, { parent: g }); kit.box(.05, .63, .55, white, 1.15, .46, z, { parent: g });
    kit.box(.3, .015, .2, kit.std(0xf2d9d4, { r: .9 }), .55, .81, z, { parent: g });
    kit.model('desk_lamp_arm_01', { pos: [1.0, .805, z - .18], ry: 2.6, h: .45, parent: g });
    const L = new THREE.PointLight(0xfff0e0, .25, 1.5, 2); L.position.set(.75, 1.2, z - .1); g.add(L);
    kit.model('modern_arm_chair_01', { pos: [-.55, .14, z], ry: Math.PI / 2, h: .82, parent: g, tint: 0xf1d8d3 });
    kit.model('GreenChair_01', { pos: [1.7, .14, z], ry: -Math.PI / 2, h: .8, parent: g, tint: 0xf3e3e0 });
  }
  // à droite : accueil et canapé
  kit.box(.6, 1.0, 1.3, white, 2.8, .64, -1.6, { parent: g }); kit.box(.68, .04, 1.38, gold, 2.78, 1.16, -1.6, { parent: g });
  kit.model('ceramic_vase_02', { pos: [2.8, 1.18, -1.2], h: .28, parent: g });
  kit.model('sofa_02', { pos: [3.05, .14, -4.6], ry: -Math.PI / 2, h: .78, parent: g, tint: 0xf0d4cf });
  kit.model('potted_plant_02', { pos: [3.0, .14, -5.8], h: 1.3, parent: g });
  kit.model('anthurium_botany_01', { pos: [-2.9, .14, -5.7], h: .9, parent: g });
  // mur du fond : un miroir rond cerclé d'or sous le nom, une console
  const mir = kit.mirror(); const rm = new THREE.Mesh(new THREE.CircleGeometry(.55, 48), mir); rm.position.set(0, 1.35, -D + .03); rm.userData.noOcclude = true; g.add(rm);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.56, .025, 12, 64), gold); ring.position.set(0, 1.35, -D + .04); g.add(ring);
  kit.box(1.8, .08, .35, white, 0, .7, -D + .18, { parent: g });
  kit.model('ceramic_vase_03', { pos: [.6, .74, -D + .18], h: .3, parent: g });
  // lumière claire
  for (const z of [-2.2, -4.6]) kit.panel(g, .4, 3.13, z, 1.6, .5, 13, 0xfff0e2);
  const wl = new THREE.PointLight(0xffe2d0, 1.2, 3.5, 2); wl.position.set(0, 2.9, -D + .7); g.add(wl);
  const wall = wallPin(THREE, 2.45, 3.0, .55, -D + .01);
  for (const x of [-1.25, 1.25]) { kit.model('planter_pot_clay', { pos: [x, .14, .55], h: .5, parent: scene, tint: 0xf3e6e2 }); kit.model('potted_plant_04', { pos: [x, .57, .55], h: .8, parent: scene }); }

  const path = kit.entryPath(portrait, portrait ? [
    { p: .76, pos: [0.6, 1.58, -0.8], tgt: [-0.4, 1.6, -D] },
    { p: 1, pos: [1.2, 1.6, -0.6], tgt: [-0.5, 1.6, -D], fov: 66 },
  ] : [
    { p: .76, pos: [0.8, 1.58, -0.9], tgt: [-0.9, 1.6, -D] },
    { p: 1, pos: [1.8, 1.62, -0.8], tgt: [-1.1, 1.55, -D], fov: 54 },
  ]);
  return { path, fov: 46, bloom: [.18, .4, 1.2], exposure: 1.3,
    pins: [{ id: 'sign', corners: shop.sign }, { id: 'wall', corners: wall }],
    after() { kit.dimEnv(g, .3, .25); mir.envMap = kit.cubeEnv(scene, [0, 1.4, -3.5]); mir.envMapIntensity = .6; },
    update(p) { shop.openDoor(Math.min(1, Math.max(0, (p - .38) / .16))); } };
}
