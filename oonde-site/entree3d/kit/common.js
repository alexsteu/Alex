// Ce que toutes les boutiques partagent : la rue, les voisins, la nuit, le réverbère, et l'enseigne du fond
export function street(THREE, kit, scene, o = {}) {
  kit.sky(scene); kit.env(scene, 'cobblestone_street_night', .55, 1.2);
  kit.street(scene);
  const shop = kit.shopfront(scene, o.shop || {});
  kit.shopfront(scene, { x: -9.6, wall: o.leftWall ?? 0xd9c9b4, shutter: 0x6a5546, dark: true, seed: 2, floors: 4 });
  kit.shopfront(scene, { x: 9.6, wall: o.rightWall ?? 0xe6d9c3, shutter: 0x5b6670, dark: true, seed: 5 });
  const moon = new THREE.DirectionalLight(0x9fb2ff, .7); moon.position.set(-9, 16, 14); moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -14, right: 14, top: 14, bottom: -6, far: 60 }); moon.shadow.bias = -.0004; scene.add(moon);
  scene.add(new THREE.HemisphereLight(0x5068c0, 0x2a2018, .7));
  const lx = o.lampX ?? -5.4;
  kit.model('street_lamp_01', { pos: [lx, .14, 2.85], h: 4.4, parent: scene });
  const sl = new THREE.PointLight(0xffc38a, 25, 14, 2); sl.position.set(lx, 4.1, 2.4); scene.add(sl);
  return shop;
}
export function wallPin(THREE, y, w, h, z) {
  return [new THREE.Vector3(-w / 2, y + h / 2, z), new THREE.Vector3(w / 2, y + h / 2, z), new THREE.Vector3(w / 2, y - h / 2, z), new THREE.Vector3(-w / 2, y - h / 2, z)];
}
