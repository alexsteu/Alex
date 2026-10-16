// Logement (v19) : un appartement d'hôtes en ville, derrière la façade de la rue. Un salon chaud : canapé, table basse et thé,
// fauteuil, lampes, plantes, une console sous le nom au mur. Ne sert que par la rue (?int=logement) : son dehors est laissé de côté.
import { street, wallPin } from '../kit/common.js';
export default async function ({ THREE, kit, scene, portrait }) {
  const shop = street(THREE, kit, scene, { time: 'night', shop: {} });
  const D = 6.6;
  const R = kit.room(scene, { d: D,
    floor: kit.pbr('wood_floor', { s: 2, roughness: .65, color: 0xe2cdb2 }),
    wall: kit.pbr('plastered_wall', { s: 2.4, color: 0xefe4d6 }),
    back: kit.pbr('plastered_wall', { s: 2.4, color: 0x8f9c8c }),
    ceiling: kit.std(0xf1ebe2, { r: .95 }) });
  const g = R.g;
  const oak = kit.pbr('wood_floor', { s: 1.2, roughness: .5, color: 0xc9a982 }), wool = kit.std(0xd8cbb8, { r: .95 });
  // un grand tapis, le canapé dos au mur de gauche, face au fauteuil ; la table basse et le thé au milieu
  kit.box(3.2, .015, 2.3, wool, -.2, .145, -3.6, { parent: g, cast: false });
  kit.model('Sofa_01', { pos: [-2.55, .14, -3.6], ry: Math.PI / 2, h: .85, parent: g });
  kit.model('throw_pillows_01', { pos: [-2.6, .55, -3.2], ry: Math.PI / 2, h: .38, parent: g });
  kit.model('coffee_table_round_01', { pos: [-.6, .14, -3.6], h: .42, parent: g });
  kit.model('tea_set_01', { pos: [-.6, .56, -3.6], h: .14, parent: g });
  kit.model('mid_century_lounge_chair', { pos: [1.5, .14, -3.3], ry: -Math.PI / 2 - .35, h: .85, parent: g });
  kit.model('Ottoman_01', { pos: [.75, .14, -2.4], h: .4, parent: g });
  kit.model('side_table_tall_01', { pos: [2.6, .14, -4.4], h: .7, parent: g });
  kit.model('desk_lamp_arm_01', { pos: [2.6, .84, -4.4], ry: -.6, h: .45, parent: g, cast: false });
  // la console sous le nom, deux vases, une pile de livres en boîtes
  kit.box(2.6, .08, .42, oak, 0, .9, -D + .24, { parent: g }); for (const x of [-1.2, 1.2]) kit.box(.06, .76, .38, oak, x, .52, -D + .24, { parent: g });
  kit.model('ceramic_vase_02', { pos: [-.85, .94, -D + .24], h: .38, parent: g });
  kit.model('brass_vase_03', { pos: [.9, .94, -D + .24], h: .3, parent: g });
  for (let k = 0; k < 3; k++) kit.box(.34, .05, .24, kit.std([0x6b4a3a, 0xd8c8b0, 0x3d4a52][k], { r: .8 }), .2, .965 + k * .05, -D + .24, { parent: g });
  // des plantes, le cabinet, un cadre et une horloge sur le mur de droite
  kit.model('calathea_orbifolia_01', { pos: [-2.9, .14, -5.7], h: 1.1, parent: g });
  kit.model('pachira_aquatica_01', { pos: [3.0, .14, -5.8], h: 1.7, parent: g });
  kit.model('vintage_cabinet_01', { pos: [3.25, .14, -2.4], ry: -Math.PI / 2, h: 1.2, parent: g });
  kit.model('fancy_picture_frame_01', { pos: [-3.56, 1.75, -3.6], ry: Math.PI / 2, h: .8, parent: g, cast: false });
  kit.model('wall_clock', { pos: [3.56, 2.1, -4.6], ry: -Math.PI / 2, h: .4, parent: g, cast: false });
  // lumière : une suspension, deux appliques sur le mur du fond, la lampe de lecture
  kit.model('modern_ceiling_lamp_01', { pos: [-.6, 2.5, -3.6], h: .55, parent: g, cast: false }); kit.pendant(g, -.6, 2.55, -3.6, { i: 3.4, dist: 7, color: 0xffc58a });
  for (const x of [-1.9, 1.9]) { kit.model('industrial_wall_sconce', { pos: [x, 1.85, -D + .05], h: .3, parent: g, cast: false }); const L = new THREE.PointLight(0xffb878, .9, 3, 2); L.position.set(x, 2.05, -D + .3); g.add(L); }
  const rl = new THREE.PointLight(0xffc48a, 1.4, 3, 2); rl.position.set(2.5, 1.2, -4.3); g.add(rl);
  const fill = new THREE.PointLight(0xffc48a, 2.4, 10, 2); fill.position.set(0, 2.8, -2); g.add(fill);
  const wall = wallPin(THREE, 2.2, 2.8, .52, -D + .01);

  const path = portrait ? [
    { p: 0, pos: [0, 1.9, 9], tgt: [0, 2.2, 0], fov: 58 },
    { p: .48, pos: [0, 1.58, 2.0], tgt: [0, 1.6, -3] },
    { p: .6, pos: [0, 1.56, -.3], tgt: [0, 1.6, -5] },
    { p: .76, pos: [0.3, 1.58, -0.9], tgt: [-0.3, 1.6, -D] },
    { p: 1, pos: [0.7, 1.6, -0.8], tgt: [-0.4, 1.6, -D], fov: 66 },
  ] : [
    { p: 0, pos: [0, 1.9, 9], tgt: [0, 2.2, 0], fov: 42 },
    { p: .48, pos: [0, 1.58, 1.9], tgt: [0, 1.65, -3] },
    { p: .6, pos: [0, 1.56, -.3], tgt: [0, 1.6, -5] },
    { p: .76, pos: [0.4, 1.58, -1.0], tgt: [-0.4, 1.6, -D] },
    { p: 1, pos: [1.0, 1.62, -0.9], tgt: [-0.6, 1.58, -D], fov: 54 },
  ];
  return { path, fov: 46, bloom: [.2, .45, 1.15], exposure: 1.25,
    pins: [{ id: 'sign', corners: shop.sign }, { id: 'wall', corners: wall }],
    after() { kit.dimEnv(g, .25, .3); },
    update(p) { shop.openDoor(Math.min(1, Math.max(0, (p - .38) / .16))); } };
}
