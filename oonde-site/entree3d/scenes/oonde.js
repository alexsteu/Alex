// L'univers OONDE : aucun lieu inventé. Sur un fond de papier, le O du logo se tient debout, le point bleu au centre.
// La caméra s'approche, le point tombe et lance une onde dans le papier, on traverse l'anneau, et sur l'onde se lèvent
// six maquettes de commerces (restaurant, boulangerie, coiffure, institut, onglerie, logement). Les enseignes restent
// vierges : la page y pose le métier (et le nom du visiteur) en HTML.
export default async function ({ THREE, kit, scene, portrait }) {
  kit.env(scene, 'studio_small_09', .32, .4, 2);
  const C = new THREE.Vector3(0, 0, -2.8);                      // là où tombe le point : le centre de l'onde
  const ease = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
  const clamp = t => Math.min(1, Math.max(0, t));

  // le papier : un sol qui se soulève (l'onde) et se perd au loin dans la même teinte (fond infini, sans horizon)
  const PAPER = 0xefede7;
  scene.background = new THREE.Color(PAPER); scene.fog = new THREE.Fog(PAPER, 13, 32);
  const paperM = kit.std(PAPER, { r: .93, env: .45 });
  const N = 300, SZ = 34;
  const fg = new THREE.PlaneGeometry(SZ, SZ, N, N); fg.rotateX(-Math.PI / 2); fg.translate(0, 0, -SZ / 2 + 10);
  const floor = new THREE.Mesh(fg, paperM); floor.receiveShadow = true; floor.castShadow = true; scene.add(floor);
  const base = Float32Array.from(fg.attributes.position.array);

  // le O : un anneau d'encre mate aux proportions du logo (fût 8,06 pour un rayon de 26,97), arêtes adoucies
  const RO = 1.5, k = RO / 31.0, rIn = 22.94 * k, dep = .26;
  const sh = new THREE.Shape(); sh.absarc(0, 0, RO, 0, Math.PI * 2, false);
  const hole = new THREE.Path(); hole.absarc(0, 0, rIn, 0, Math.PI * 2, true); sh.holes.push(hole);
  const rg = new THREE.ExtrudeGeometry(sh, { depth: dep, bevelEnabled: true, bevelThickness: .025, bevelSize: .025, bevelSegments: 4, curveSegments: 128 });
  rg.translate(0, 0, -dep / 2);
  const ink = kit.std(0x15171c, { r: .62, env: .6 });
  const ring = new THREE.Mesh(rg, ink); ring.position.set(0, RO + .025, 0); ring.castShadow = ring.receiveShadow = true; scene.add(ring);
  // un petit socle de carton sous l'anneau : il tient debout comme un objet posé
  kit.box(1.1, .05, .5, kit.std(0xe9e6de, { r: .9 }), 0, .025, 0, { parent: scene });

  // le point bleu, seule matière brillante de la scène
  const RD = 10.54 * k, TD = .07;
  const dot = new THREE.Mesh(new THREE.CylinderGeometry(RD, RD, TD, 96, 1), kit.std(0x2038ec, { r: .38, env: .7, e: 0x2038ec, ei: .06 }));
  dot.castShadow = true; dot.receiveShadow = true; dot.position.copy(ring.position); dot.rotation.x = Math.PI / 2; scene.add(dot);
  const dotStart = ring.position.clone();

  // les maquettes : carton gris, façade en plâtre blanc, menuiseries en chêne clair, socle blanc
  const plaster = kit.std(0xf3f1eb, { r: .9 }), card = kit.std(0xa7a297, { r: .95 }), board = kit.std(0xfbfaf7, { r: .85 });
  const oak = kit.pbr('wood_floor', { s: .6, color: 0xd9bf98, roughness: .6, env: .5 });
  const frost = kit.std(0x23262d, { r: .05, m: .2, e: 0xffa25a, ei: .07, env: 2.2 });   // la vitrine : verre teinté, la salle allumée derrière
  const glow = kit.std(0xfff1dc, { r: .4, e: 0xffc788, ei: 1.6 });
  const paperSign = kit.std(0xfdfcf8, { r: .88 });
  const kinds = [
    { id: 'restaurant', w: 1.05, h: 1.25, acc: 0xb0664c },
    { id: 'boulangerie', w: .95, h: 1.4, acc: 0xc79a52 },
    { id: 'coiffure', w: 1.0, h: 1.55, acc: 0x8e9c8a },
    { id: 'institut', w: .95, h: 1.35, acc: 0xd3b2a4 },
    { id: 'onglerie', w: .85, h: 1.7, acc: 0x6e7884 },
    { id: 'logement', w: 1.05, h: 1.08, acc: 0x9b8d7a },
  ];
  const sc = portrait ? .86 : 1, R = portrait ? 3.0 : 3.1, span = portrait ? 40 : 48;
  const facades = []; const pins = [];
  kinds.forEach((K, i) => {
    const th = THREE.MathUtils.degToRad(-span + (2 * span) * i / (kinds.length - 1));
    const root = new THREE.Group(); root.position.set(C.x + R * Math.sin(th), 0, C.z - R * Math.cos(th));
    root.lookAt(C.x, 0, C.z); root.scale.setScalar(sc); scene.add(root);
    const D = .5, W = K.w, H = K.h;
    // socle posé sur le papier
    kit.box(W + .3, .035, D + .4, board, 0, .0175, -.05, { parent: root });
    // la charnière : la maquette se déplie depuis le bord avant du socle, comme un livre animé
    const hinge = new THREE.Group(); hinge.position.set(0, .035, D / 2 + .02); root.add(hinge);
    const b = new THREE.Group(); b.position.set(0, 0, -(D / 2 + .02)); hinge.add(b);
    kit.box(W - .02, H - .01, D, card, 0, H / 2, 0, { parent: b });                       // le corps en carton
    const front = kit.std(new THREE.Color(0xf6f4ee).lerp(new THREE.Color(K.acc), .07), { r: .9 });
    kit.box(W, H, .022, front, 0, H / 2, D / 2 + .011, { parent: b });                  // la façade en plâtre, chants visibles
    kit.box(W + .05, .04, D + .06, plaster, 0, H + .02, 0, { parent: b });              // la corniche
    const f = D / 2 + .024;
    const accM = kit.std(K.acc, { r: .8 });
    // enseigne : un bandeau de papier vierge
    const sw = W * .84, sh2 = .19, sy = .86;
    kit.box(sw, sh2, .012, paperSign, 0, sy, f + .006, { parent: b });
    kit.box(sw + .02, .008, .02, accM, 0, sy - sh2 / 2 - .006, f + .008, { parent: b });
    const sz = f + .016;
    const local = [[-sw / 2, sy + sh2 / 2], [sw / 2, sy + sh2 / 2], [sw / 2, sy - sh2 / 2], [-sw / 2, sy - sh2 / 2]].map(([x, y]) => new THREE.Vector3(x, y, sz));
    const world = local.map(v => v.clone());
    // porte en chêne et vitrine dépolie, selon le métier
    const door = (x, w = .2, h = .5) => { kit.box(w + .03, h + .02, .012, plaster, x, h / 2 + .01, f + .002, { parent: b }); kit.box(w, h, .016, oak, x, h / 2, f + .004, { parent: b }); };
    const win = (x, y, w, h) => { kit.box(w + .03, h + .03, .01, accM, x, y, f + .001, { parent: b }); kit.box(w, h, .014, frost, x, y, f + .004, { parent: b });
      if (w > .3) kit.box(.008, h, .006, accM, x, y, f + .012, { parent: b }); kit.box(w, .008, .006, accM, x, y - h * .18, f + .012, { parent: b }); };
    const lamp = x => { kit.box(.016, .03, .03, accM, x, .62, f + .012, { parent: b }); kit.box(.034, .05, .034, glow, x, .6, f + .03, { parent: b }); };
    const awning = (x, w) => { const a = kit.box(w, .012, .14, accM, x, sy - .16, f + .07, { parent: b }); a.rotation.x = .38; };
    if (K.id === 'restaurant') {
      win(-.17, .36, .52, .44); door(.34); awning(-.17, .6); lamp(.34 + .15);
      for (const x of [-.3, -.02]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .1, 20), oak); t.position.set(x, .05, f + .17); t.castShadow = true; b.add(t); }
      win(-.27, 1.08, .16, .16); win(.27, 1.08, .16, .16);
    } else if (K.id === 'boulangerie') {
      win(-.15, .36, .42, .4); door(.3, .18); awning(-.15, .5); lamp(.3 + .13);
      win(0, 1.15, .3, .22);
    } else if (K.id === 'coiffure') {
      win(-.16, .37, .46, .5); door(.32, .18, .52); lamp(.32 - .13);
      for (let s = 0; s < 6; s++) kit.box(.018, .38, .02, oak, -.36 + s * .06, 1.2, f + .01, { parent: b });
      win(.22, 1.2, .26, .3);
    } else if (K.id === 'institut') {
      const rw = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .014, 48), frost); rw.rotation.x = Math.PI / 2; rw.position.set(-.16, .4, f + .004); b.add(rw);
      const rr = new THREE.Mesh(new THREE.TorusGeometry(.2, .012, 10, 48), accM); rr.position.set(-.16, .4, f + .006); b.add(rr);
      door(.28, .2); win(0, 1.12, .5, .2); lamp(.28 + .15);
    } else if (K.id === 'onglerie') {
      win(-.12, .36, .36, .46); door(.27, .18); awning(-.12, .44); lamp(.27 + .13);
      win(0, 1.15, .2, .26); win(0, 1.5, .2, .2);
    } else {
      // le logement : une maison à pignon, volets en chêne
      const roof = new THREE.Shape(); roof.moveTo(-W / 2 - .05, 0); roof.lineTo(0, .3); roof.lineTo(W / 2 + .05, 0); roof.lineTo(-W / 2 - .05, 0);
      const rgeo = new THREE.ExtrudeGeometry(roof, { depth: D + .08, bevelEnabled: false }); rgeo.translate(0, 0, -(D + .08) / 2);
      const rm = new THREE.Mesh(rgeo, card); rm.position.y = H + .04; rm.castShadow = rm.receiveShadow = true; b.add(rm);
      door(0, .22, .52); for (const x of [-.32, .32]) { win(x, .4, .2, .26); kit.box(.06, .26, .012, oak, x - .14, .4, f + .006, { parent: b }); kit.box(.06, .26, .012, oak, x + .14, .4, f + .006, { parent: b }); }
      lamp(-.17);
    }
    b.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const pop = .41 + i * .034;
    facades.push({ root, hinge, local, world, pop, r: R });
    pins.push({ id: K.id, corners: world });
  });

  // la lumière d'une table d'architecte : une grande source douce au-dessus, un peu en arrière, et le ciel du studio
  const sun = new THREE.DirectionalLight(0xffe4c4, 3.1); sun.position.set(-8, 5.2, 1); sun.target.position.set(0, 0, -2.5);
  sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 });
  sun.shadow.bias = -.0003; sun.shadow.normalBias = .02; sun.shadow.radius = 6; scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0xf4f2ff, 0xe8dccb, .62));
  const soft = new THREE.RectAreaLight(0xfff3e4, 1.2, 8, 6); soft.position.set(0, 7, -2); soft.lookAt(0, 0, -2.6); scene.add(soft);

  // l'onde : un front qui part du point d'impact, se soulève en relief et s'amortit ; derrière lui, des sillons fins
  const P_IMPACT = portrait ? .2 : .2, SPEED = 14;
  function wave(r, p) {
    const t = p - P_IMPACT; if (t <= 0) return 0;
    const front = t * SPEED, damp = 1 / (1 + .35 * r);
    const crest = .34 * Math.exp(-(((r - front) / .75) ** 2)) * damp * clamp(1.3 - t * 1.4);
    const behind = r < front ? .03 * Math.cos((r - front) * 9) * Math.exp(-(front - r) * .25) * clamp(t * 6) : 0;
    const grooves = r < front ? -.012 * Math.max(0, Math.cos(r * 5.2)) ** 6 : 0;    // l'onde reste gravée dans le papier
    return crest + behind + grooves;
  }
  const pos = fg.attributes.position;
  function shapeFloor(p) {
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3], z = base[i * 3 + 2]; const r = Math.hypot(x - C.x, z - C.z);
      pos.setY(i, r > 11 ? 0 : wave(r, p) * clamp((11 - r) / 3));
    }
    pos.needsUpdate = true; fg.computeVertexNormals();
  }

  // le parcours de la caméra : lire le logo, s'approcher, voir le point tomber, traverser l'anneau, survoler l'onde,
  // tourner autour pendant que les maquettes se lèvent, puis se poser face à elles
  const path = portrait ? [
    { p: 0, pos: [0, 1.55, 9.6], tgt: [0, 1.55, 0], fov: 42 },
    { p: .1, pos: [0, 1.55, 8.4], tgt: [0, 1.55, 0] },
    { p: .22, pos: [0, 1.55, 3.6], tgt: [0, 1.4, -2], fov: 52 },
    { p: .265, pos: [0, 1.53, 1.4], tgt: [0, 1.1, -2.8], fov: 56 },
    { p: .31, pos: [0, 1.5, -.35], tgt: [0, .5, -3.6], fov: 60 },
    { p: .44, pos: [.4, 4.2, -.8], tgt: [0, 0, -3.1], fov: 66 },
    { p: .62, pos: [1.9, 3.7, -.6], tgt: [0, .3, -3.6] },
    { p: .8, pos: [.5, 2.6, -1.4], tgt: [0, .6, -5.4], fov: 66 },
    { p: 1, pos: [0, 2.1, -1.55], tgt: [0, .42, -6.0], fov: 66 },
  ] : [
    { p: 0, pos: [0, 1.55, 8.6], tgt: [0, 1.55, 0], fov: 30 },
    { p: .1, pos: [0, 1.55, 7.4], tgt: [0, 1.55, 0], fov: 32 },
    { p: .22, pos: [0, 1.55, 2.6], tgt: [0, 1.4, -2], fov: 42 },
    { p: .265, pos: [0, 1.53, .9], tgt: [0, 1.1, -2.8], fov: 45 },
    { p: .31, pos: [0, 1.5, -.35], tgt: [0, .5, -3.6], fov: 48 },
    { p: .44, pos: [.4, 3.6, -.7], tgt: [0, 0, -3.0], fov: 50 },
    { p: .62, pos: [2.2, 2.9, -.9], tgt: [0, .4, -3.4] },
    { p: .8, pos: [.7, 2.45, -.4], tgt: [0, .2, -4.6], fov: 52 },
    { p: 1, pos: [0, 2.3, -.25], tgt: [0, .05, -5.0], fov: 54 },
  ];

  const m4 = new THREE.Matrix4();
  return {
    path, fov: 40, bloom: [.04, .3, 1.4], exposure: 1.22, vignette: .18, ao: .7,
    pins,
    update(p) {
      ring.visible = p < .5;   // passé derrière la caméra : il ne doit plus cacher la lumière ni rien d'autre
      // le point : il sort de l'anneau, retombe en arc derrière lui, rebondit, puis s'enfonce à moitié dans le papier
      // le point : un disque debout dans l'anneau ; il bascule en arrière, retombe à plat sur le papier et rebondit à peine
      const a = clamp((p - .12) / (P_IMPACT - .12)), land = new THREE.Vector3(C.x, TD / 2, C.z);
      if (p < .12) { dot.position.copy(dotStart); dot.rotation.x = Math.PI / 2; }
      else if (p < P_IMPACT) { dot.position.lerpVectors(dotStart, land, a); dot.position.y = dotStart.y + (land.y - dotStart.y) * a * a + .45 * Math.sin(Math.PI * a) * (1 - a); dot.rotation.x = Math.PI / 2 * (1 - ease(a)); }
      else { const b2 = clamp((p - P_IMPACT) / .05); dot.position.copy(land); dot.position.y = land.y + .05 * Math.sin(Math.PI * b2) * (1 - b2); dot.rotation.x = 0; }
      shapeFloor(p);
      for (const F of facades) {
        const t = clamp((p - F.pop) / .075);
        const e = t >= 1 ? 1 : 1 - Math.pow(1 - t, 3) * Math.cos(t * 2.2);              // se déplie et dépasse un peu
        F.hinge.rotation.x = -Math.PI / 2 * (1 - e);
        const up = clamp((p - (P_IMPACT + F.r / SPEED - .03)) / .05);
        F.root.position.y = wave(F.r, p) - .5 * (1 - up);
        F.root.updateMatrixWorld(true);
        m4.copy(F.hinge.children[0].matrixWorld);
        F.local.forEach((v, j) => F.world[j].copy(v).applyMatrix4(m4));
      }
    },
  };
}
