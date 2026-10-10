// Institut de soins : une cabine claire et chaude, enduit à la chaux, deux niches en arc éclairées, lit de soin, fauteuil, bougies.
import { street, wallPin } from '../kit/common.js';
export default async function ({ THREE, kit, scene, portrait }) {
  const shop = street(THREE, kit, scene, { shop: { stone: 'plastered_wall', stoneTint: 0xe9dccd, wall: 0xeedfd2, shutter: 0x8a7a6c, base: 0xe3d6c8, frame: 0x2a2420, seed: 4 }, leftWall: 0xd3c7b8, rightWall: 0xe8d6c4, lampX: 5.4 });
  const D = 6.2;
  const R = kit.room(scene, { d: D,
    floor: kit.pbr('wood_floor', { s: 2, roughness: .7, color: 0xf3e7d6 }),
    wall: kit.pbr('plastered_wall', { s: 2.4, color: 0xf7ece0 }),
    ceiling: kit.std(0xf3ece3, { r: .95 }) });
  const g = R.g;
  const oak = kit.pbr('wood_floor', { s: 1.2, roughness: .55, color: 0xd9c2a3 }), linen = kit.std(0xf6f1ea, { r: .95 }), sage = kit.std(0xb98a70, { r: .95 });
  // deux niches en arc dans le mur du fond, éclairées de l'intérieur
  const arch = (w, h) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0); return s; };
  for (const x of [-2.25, 2.25]) {
    const ni = new THREE.Mesh(new THREE.ShapeGeometry(arch(1.25, 2.3), 24), kit.std(0xf6e3cc, { r: .9, e: 0xffc995, ei: .18 })); ni.position.set(x, .6, -D + .02); g.add(ni);
    const L = new THREE.PointLight(0xffc792, 1.1, 2.6, 2); L.position.set(x, 2.3, -D + .45); g.add(L);
    kit.box(1.15, .04, .32, oak, x, 1.35, -D + .18, { parent: g }); kit.box(1.15, .04, .32, oak, x, .62, -D + .18, { parent: g });
    kit.model(x < 0 ? 'ceramic_vase_03' : 'brass_vase_01', { pos: [x - .3, 1.37, -D + .18], h: .36, parent: g });
    kit.model('wooden_candlestick', { pos: [x + .3, 1.37, -D + .18], h: .25, parent: g });
    for (let k = 0; k < 3; k++) { const tw = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .38, 20), linen); tw.rotation.z = Math.PI / 2; tw.position.set(x - .1 + (k % 2) * .05, .72 + k * .15, -D + .18); g.add(tw); }
  }
  // le lit de soin, le long du mur de gauche, avec une serviette pliée
  kit.box(.75, .5, 1.95, oak, -2.6, .39, -3.3, { parent: g });
  kit.box(.8, .16, 2.0, kit.std(0xe9ded2, { r: .85 }), -2.6, .72, -3.3, { parent: g });
  kit.box(.82, .02, .9, linen, -2.6, .81, -2.8, { parent: g });
  kit.box(.35, .08, .25, linen, -2.6, .84, -4.0, { parent: g });
  kit.model('wooden_bowl_01', { pos: [-2.0, .14, -4.7], h: .14, parent: g });
  // le fauteuil et la petite table, à droite
  kit.model('modern_arm_chair_01', { pos: [2.5, .14, -3.6], ry: -Math.PI / 2 - .5, h: .85, parent: g, tint: 0xe7dccd });
  kit.model('side_table_01', { pos: [2.65, .14, -2.7], h: .52, parent: g });
  kit.model('tea_set_01', { pos: [2.65, .67, -2.7], h: .14, parent: g });
  kit.model('anthurium_botany_01', { pos: [3.0, .14, -4.8], h: 1.1, parent: g });
  kit.model('pachira_aquatica_01', { pos: [-3.0, .14, -5.5], h: 1.7, parent: g });
  // un banc bas sous le nom, avec des bougies
  kit.box(2.4, .42, .42, oak, 0, .35, -D + .25, { parent: g });
  for (const x of [-.7, -.45, .55]) kit.model('wooden_candlestick', { pos: [x, .56, -D + .25], h: .18 + (x > 0 ? .06 : 0), parent: g });
  kit.box(1.0, .015, 1.6, sage, 0.3, .145, -3.2, { parent: g, cast: false });   // un tapis
  // lumière : basse et chaude
  kit.panel(g, 0, 3.13, -2.2, 1.4, .45, 14, 0xffdcb4); kit.panel(g, 0, 3.13, -4.6, 1.4, .45, 10, 0xffdcb4);
  for (const x of [-1.3, 1.3]) { const L = new THREE.PointLight(0xffc68f, 1.2, 4, 2); L.position.set(x, 2.5, -D + .6); g.add(L); }
  const cl = new THREE.PointLight(0xff9c50, .5, 2, 2); cl.position.set(-.4, .9, -D + .5); g.add(cl);
  const wall = wallPin(THREE, 2.25, 2.9, .5, -D + .01);
  // dehors : deux pots et une lanterne
  for (const x of [-1.25, 1.25]) { kit.model('planter_pot_clay', { pos: [x, .14, .55], h: .5, parent: scene }); kit.model('calathea_orbifolia_01', { pos: [x, .57, .55], h: .7, parent: scene }); }

  const path = kit.entryPath(portrait, portrait ? [
    { p: .76, pos: [0.2, 1.58, -0.8], tgt: [0, 1.65, -D] },
    { p: 1, pos: [0.4, 1.6, -0.6], tgt: [-0.1, 1.65, -D], fov: 66 },
  ] : [
    { p: .76, pos: [0.3, 1.58, -1.0], tgt: [0, 1.65, -D] },
    { p: 1, pos: [0.6, 1.6, -0.8], tgt: [-0.15, 1.62, -D], fov: 54 },
  ]);
  return { path, fov: 46, bloom: [.2, .45, 1.15], exposure: 1.3,
    pins: [{ id: 'sign', corners: shop.sign }, { id: 'wall', corners: wall }],
    after() { kit.dimEnv(g, .25, .3); },
    update(p) { shop.openDoor(Math.min(1, Math.max(0, (p - .38) / .16))); } };
}
