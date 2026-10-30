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
  // le ciel : un dégradé chaud, du crème en haut au papier à l'horizon
  { const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#c9ced3'); g.addColorStop(.38, '#ddd6cd'); g.addColorStop(.6, '#ebdcc9'); g.addColorStop(.8, '#efede7'); g.addColorStop(1, '#efede7'); x.fillStyle = g; x.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t; } scene.fog = new THREE.Fog(PAPER, 13, 32);
  // le grain du papier : un bruit fin en relief, à peine visible, qui accroche la lumière rasante
  const grain = (() => { const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'), im = x.createImageData(512, 512);
    let sd = 7; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 512 * 512; i++) { const v = 118 + r() * 20 + (r() < .015 ? 30 : 0); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    x.putImageData(im, 0, 0); x.filter = 'blur(.6px)'; x.drawImage(c, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(44, 44); return t; })();
  const paperM = new THREE.MeshStandardMaterial({ color: PAPER, roughness: .92, envMapIntensity: .45, bumpMap: grain, bumpScale: .35 });
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
  const ink = new THREE.MeshPhysicalMaterial({ color: 0x14161b, roughness: .5, metalness: 0, clearcoat: .55, clearcoatRoughness: .32, envMapIntensity: .7 });
  const ring = new THREE.Mesh(rg, ink); ring.position.set(0, RO + .025, 0); ring.castShadow = ring.receiveShadow = true; scene.add(ring);
  // un petit socle de carton sous l'anneau : il tient debout comme un objet posé
  const plinth = new THREE.Group();   // plus de socle : l'anneau tient seul, comme le logo

  // le point bleu, seule matière brillante de la scène
  const RD = 10.54 * k, TD = .07;
  const dot = new THREE.Mesh(new THREE.CylinderGeometry(RD, RD, TD, 96, 1), new THREE.MeshPhysicalMaterial({ color: 0x2038ec, roughness: .3, clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: .8, emissive: 0x2038ec, emissiveIntensity: .05 }));
  dot.castShadow = true; dot.receiveShadow = true; dot.position.copy(ring.position); dot.rotation.x = Math.PI / 2; scene.add(dot);
  const dotStart = ring.position.clone();

  // les maquettes : carton gris, façade en plâtre blanc, menuiseries en chêne clair, socle blanc
  const plaster = kit.std(0xf3f1eb, { r: .9 }), card = kit.std(0xa7a297, { r: .95 }), board = kit.std(0xfbfaf7, { r: .85 });
  const oak = kit.pbr('wood_floor', { s: .6, color: 0xd9bf98, roughness: .6, env: .5 });
  // la vitrine : un verre sombre, et derrière, la salle allumée (une lueur chaude qui monte du bas, 2700 K)
  // chaque métier a sa salle, floue derrière le verre : sa couleur de fond, un objet au milieu, un reflet de ciel en haut
  const ROOMS = { restaurant: ['#ffd29a', '#d9874a'], boulangerie: ['#ffe0a6', '#e0a256'], coiffure: ['#f6e3c4', '#a7b39c'],
    institut: ['#fbe4d6', '#d6a891'], onglerie: ['#fbd9e2', '#c98a9d'], logement: ['#ffe2b4', '#c79a6c'], x: ['#ffd59a', '#eba25c'] };
  function room(kind) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 160; const g = c.getContext('2d'), [lo, mid] = ROOMS[kind];
    const gr = g.createLinearGradient(0, 160, 0, 0); gr.addColorStop(0, lo); gr.addColorStop(.55, mid); gr.addColorStop(1, '#3a2414');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 160); g.filter = 'blur(2.5px)';
    const ink = a => `rgba(38,22,12,${a})`; g.fillStyle = ink(.8);
    const disc = (x, y, rx, ry) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); };
    if (kind === 'restaurant') { for (const x of [34, 94]) { g.fillRect(x - 20, 104, 40, 5); g.fillRect(x - 3, 108, 6, 30); } g.fillStyle = 'rgba(255,236,200,.95)'; disc(34, 52, 6, 6); disc(94, 52, 6, 6); }
    else if (kind === 'boulangerie') { g.fillRect(10, 112, 108, 30); g.fillStyle = 'rgba(150,84,30,.9)'; for (const y of [62, 82]) for (let x = 20; x < 110; x += 22) disc(x, y, 9, 5); g.fillStyle = ink(.8); g.fillRect(12, 70, 104, 3); g.fillRect(12, 90, 104, 3); }
    else if (kind === 'coiffure') { g.fillStyle = 'rgba(255,250,235,.9)'; for (const x of [22, 58, 94]) g.fillRect(x, 30, 16, 52); g.fillStyle = ink(.4); for (const x of [30, 66, 102]) { g.fillRect(x - 9, 108, 18, 12); g.fillRect(x - 2, 120, 4, 20); } }
    else if (kind === 'institut') { g.fillStyle = 'rgba(70,100,58,.85)'; disc(64, 96, 22, 30); g.fillStyle = ink(.8); g.fillRect(52, 120, 24, 22); }
    else if (kind === 'onglerie') { for (const y of [48, 68, 88]) { g.fillRect(14, y + 8, 100, 2); for (let x = 20; x < 112; x += 10) { g.fillStyle = `hsl(${(x * 7 + y * 3) % 360},55%,45%)`; g.fillRect(x, y, 5, 8); } g.fillStyle = ink(.8); } g.fillRect(28, 112, 72, 8); }
    else if (kind === 'logement') { g.fillRect(14, 104, 100, 22); g.fillRect(14, 92, 16, 34); g.fillRect(98, 92, 16, 34); g.fillStyle = 'rgba(255,244,214,.95)'; disc(64, 40, 10, 10); }
    g.fillStyle = 'rgba(255,240,205,.9)'; if (kind === 'x') disc(64, 34, 9, 9);
    g.filter = 'none';
    const sky = g.createLinearGradient(0, 0, 0, 56); sky.addColorStop(0, 'rgba(214,226,244,.32)'); sky.addColorStop(1, 'rgba(214,226,244,0)');
    g.fillStyle = sky; g.fillRect(0, 0, 128, 56);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: .04, metalness: .1, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: .95, envMapIntensity: 1.8 });
  }
  const frost = room('x');
  const glow = kit.std(0xfff1dc, { r: .4, e: 0xffc788, ei: 1.6 });
  // les enseignes sont peintes dans l'image, dans la typo de la marque : nettes, éclairées comme le reste de la maquette
  const fonts = [['Instrument Sans', 'instrument-600', 600], ['IBM Plex Mono', 'plexmono-600', 600], ['Cormorant Garamond', 'cormorant-garamond-latin-400-normal', 400]];
  await Promise.all(fonts.map(([f, file, w]) => new FontFace(f, `url(assets/fonts/${file}.woff2)`, { weight: String(w) }).load().then(ff => document.fonts.add(ff)).catch(() => {})));
  function signTex(text, o) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * o.ratio); const x = c.getContext('2d');
    x.fillStyle = o.bg; x.fillRect(0, 0, c.width, c.height);
    if (o.rule) { x.strokeStyle = o.rule; x.lineWidth = 10; x.strokeRect(14, 14, c.width - 28, c.height - 28); }
    x.fillStyle = o.fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    let fs = c.height * (o.size ?? .5); const font = () => `${o.weight ?? 600} ${fs}px "${o.font ?? 'Instrument Sans'}"`;
    x.font = font(); if ('letterSpacing' in x) x.letterSpacing = (o.ls ?? .16) * fs + 'px';
    while (x.measureText(text).width > c.width * .84 && fs > 10) { fs *= .95; x.font = font(); if ('letterSpacing' in x) x.letterSpacing = (o.ls ?? .16) * fs + 'px'; }
    x.fillText(text, c.width / 2 + (o.ls ?? .16) * fs / 2, c.height * .53);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return new THREE.MeshStandardMaterial({ map: t, roughness: o.r ?? .7, metalness: 0 });
  }
  function stripes(a2, b2) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 8; const x = c.getContext('2d');
    for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? b2 : a2; x.fillRect(i * 16, 0, 16, 8); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshStandardMaterial({ map: t, roughness: .85, side: THREE.DoubleSide });
  }
  // chaque maquette reprend la façade de sa démo : le bistrot au store vert, la boulangerie en bois bordeaux, le salon
  // en béton clair, l'institut à arcades, l'onglerie rose, la maison à pignon
  const kinds = [
    { id: 'restaurant', w: 1.05, h: 1.25, front: 0xe6dac5, acc: 0x1f4a3b, sign: { bg: '#1f4a3b', fg: '#efe3c8', font: 'Cormorant Garamond', weight: 400, ls: .1, size: .62, txt: 'Restaurant' } },
    { id: 'boulangerie', w: .95, h: 1.4, front: 0xf1e5ce, acc: 0x5a1c22, sign: { bg: '#5a1c22', fg: '#d8b46a', rule: '#c9a25e', font: 'Cormorant Garamond', weight: 400, ls: .12, size: .58, txt: 'Boulangerie' } },
    { id: 'coiffure', w: 1.0, h: 1.55, front: 0xdedcd7, acc: 0x18191c, sign: { bg: '#dedcd7', fg: '#18191c', ls: .3, size: .42, txt: 'COIFFURE' } },
    { id: 'institut', w: .95, h: 1.35, front: 0xeed9c4, acc: 0x9c7a5b, sign: { bg: '#eed9c4', fg: '#5e3f2a', font: 'Cormorant Garamond', weight: 400, ls: .16, size: .74, txt: 'Institut' } },
    { id: 'onglerie', w: .85, h: 1.7, front: 0xf1d2d6, acc: 0xd78b9b, sign: { bg: '#fbf3f2', fg: '#c46f84', ls: .26, size: .42, txt: 'ONGLERIE' } },
    { id: 'logement', w: 1.05, h: 1.08, front: 0xf4efe6, acc: 0x9b7a58, sign: { bg: '#f4efe6', fg: '#4a3a2c', ls: .3, size: .4, txt: 'LOGEMENT' } },
  ];
  const sc = portrait ? .86 : 1, R = portrait ? 3.0 : 3.1, span = portrait ? 40 : 48;
  const facades = []; const pins = [];
  const blackM = kit.std(0x18191c, { r: .4, m: .3 }), goldM = kit.std(0xc9a25e, { m: .9, r: .35 });
  kinds.forEach((K, i) => {
    const th = THREE.MathUtils.degToRad(-span + (2 * span) * i / (kinds.length - 1));
    const root = new THREE.Group(); root.position.set(C.x + R * Math.sin(th), 0, C.z - R * Math.cos(th));
    root.lookAt(C.x, 0, C.z); root.scale.setScalar(sc); scene.add(root);
    const D = .5, W = K.w, H = K.h;
    kit.box(W + .3, .035, D + .4, board, 0, .0175, -.05, { parent: root });                      // socle posé sur le papier
    // la charnière : la maquette se déplie depuis le bord avant du socle, comme un livre animé
    const hinge = new THREE.Group(); hinge.position.set(0, .035, D / 2 + .02); root.add(hinge);
    const b = new THREE.Group(); b.position.set(0, 0, -(D / 2 + .02)); hinge.add(b);
    const frontM = kit.std(K.front, { r: .88 }), accM = kit.std(K.acc, { r: .6 });
    kit.box(W - .02, H - .01, D, kit.std(new THREE.Color(K.front).multiplyScalar(.86), { r: .95 }), 0, H / 2, 0, { parent: b });  // le corps
    kit.box(W, H, .022, frontM, 0, H / 2, D / 2 + .011, { parent: b });                                    // la façade, chants visibles
    kit.box(W + .05, .04, D + .06, plaster, 0, H + .02, 0, { parent: b });                                 // la corniche
    const f = D / 2 + .024;
    // l'enseigne, peinte
    const sw = W * .84, sh2 = .19, sy = .86;
    kit.box(sw, sh2, .012, kit.std(new THREE.Color(K.sign.bg), { r: .7 }), 0, sy, f + .006, { parent: b });
    const face = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh2), signTex(K.sign.txt, { ratio: sh2 / sw, ...K.sign })); face.position.set(0, sy, f + .0125); face.receiveShadow = true; b.add(face);
    if (K.id === 'boulangerie' || K.id === 'restaurant') kit.box(sw + .03, sh2 + .03, .008, K.id === 'boulangerie' ? goldM : accM, 0, sy, f + .001, { parent: b });
    const sz = f + .013;
    const local = [[-sw / 2, sy + sh2 / 2], [sw / 2, sy + sh2 / 2], [sw / 2, sy - sh2 / 2], [-sw / 2, sy - sh2 / 2]].map(([x, y]) => new THREE.Vector3(x, y, sz));
    const world = local.map(v => v.clone());
    const roomM = room(K.id);
    const door = (x, w = .2, h = .5, m = oak) => { kit.box(w + .03, h + .02, .012, accM, x, h / 2 + .01, f + .002, { parent: b }); kit.box(w, h, .016, m, x, h / 2, f + .004, { parent: b }); };
    // une fenêtre : verre allumé, cadre, petits bois
    const win = (x, y, w, h, o = {}) => { const fm = o.frame ?? accM;
      kit.box(w + .025, h + .025, .01, fm, x, y, f + .001, { parent: b }); kit.box(w, h, .014, o.lit === false || y > .7 ? frost : roomM, x, y, f + .004, { parent: b });
      const [nc, nr] = o.grid ?? [w > .3 ? 2 : 1, 2];
      for (let c = 1; c < nc; c++) kit.box(.006, h, .006, fm, x - w / 2 + c * w / nc, y, f + .012, { parent: b });
      for (let r = 1; r < nr; r++) kit.box(w, .006, .006, fm, x, y - h / 2 + r * h / nr, f + .012, { parent: b }); };
    const archWin = (x, y0, w, h, m) => { const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(-w / 2, h - w / 2); sh.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0);
      const fr = new THREE.Mesh(new THREE.ShapeGeometry(sh, 24), accM); fr.scale.set(1 + .05 / w, 1 + .03 / h, 1); fr.position.set(x, y0 - .015, f + .002); b.add(fr);
      const gm = new THREE.Mesh(new THREE.ShapeGeometry(sh, 24), m); gm.position.set(x, y0, f + .006); b.add(gm); };
    const lamp = x => { kit.box(.016, .03, .03, accM, x, .62, f + .012, { parent: b }); kit.box(.034, .05, .034, glow, x, .6, f + .03, { parent: b });
      const pl = new THREE.PointLight(0xffb36a, .7, .7, 2); pl.position.set(x, .55, f + .08); b.add(pl); };
    const awning = (x, w, a2, b2) => { const m = stripes(a2, b2); const a = new THREE.Mesh(new THREE.PlaneGeometry(w, .2), m); a.rotation.x = -Math.PI / 2 + .5; a.position.set(x, .68, f + .085); a.castShadow = true; b.add(a);
      const v = new THREE.Mesh(new THREE.PlaneGeometry(w, .045), m); v.position.set(x, .6, f + .17); b.add(v); };
    if (K.id === 'restaurant') {
      win(-.17, .36, .52, .44, { grid: [3, 2] }); door(.34); awning(-.04, .86, '#1f4a3b', '#e9dfca'); lamp(.34 + .15);
      for (const x of [-.32, -.04]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .1, 20), oak); t.position.set(x, .05, f + .2); t.castShadow = true; b.add(t); }
      win(-.27, 1.08, .16, .16); win(.27, 1.08, .16, .16);
    } else if (K.id === 'boulangerie') {
      // la devanture en bois peint : un coffre bordeaux sur tout le rez, filet doré, petits carreaux
      const bord = kit.std(0x5a1c22, { r: .45 });
      kit.box(W - .04, .74, .003, bord, 0, .37, f + .0005, { parent: b }); kit.box(W - .02, .012, .012, goldM, 0, .742, f + .004, { parent: b });
      win(-.16, .4, .42, .44, { frame: goldM, grid: [4, 3] }); door(.3, .18, .52, bord); lamp(.3 + .13);
      win(-.2, 1.15, .2, .22); win(.2, 1.15, .2, .22);
    } else if (K.id === 'coiffure') {
      // le béton clair : une grande baie sans montants, des bandeaux vitrés aux étages
      kit.box(.66, .64, .014, roomM, -.12, .35, f + .004, { parent: b }); kit.box(.68, .66, .008, blackM, -.12, .35, f + .001, { parent: b });
      door(.35, .16, .56, kit.std(0x23252a, { r: .2, m: .4 }));
      for (const y of [1.15, 1.4]) { kit.box(W - .14, .16, .012, frost, 0, y, f + .004, { parent: b }); kit.box(W - .12, .006, .016, blackM, 0, y - .083, f + .008, { parent: b }); }
    } else if (K.id === 'institut') {
      // l'enduit à la chaux, deux arcades : la vitrine et la porte
      archWin(-.16, .1, .36, .54, roomM); archWin(.27, .02, .2, .5, oak); lamp(.27 + .16);
      archWin(0, 1.02, .26, .24, frost);
    } else if (K.id === 'onglerie') {
      win(-.12, .36, .36, .46, { frame: kit.std(0xd8b07a, { m: .8, r: .3 }) }); door(.27, .18); awning(-.03, .7, '#e7a9b6', '#fbefee'); lamp(.27 + .13);
      win(0, 1.15, .2, .26); win(0, 1.5, .2, .2);
    } else {
      // le logement : une maison à pignon, volets en chêne
      const roof = new THREE.Shape(); roof.moveTo(-W / 2 - .05, 0); roof.lineTo(0, .3); roof.lineTo(W / 2 + .05, 0); roof.lineTo(-W / 2 - .05, 0);
      const rgeo = new THREE.ExtrudeGeometry(roof, { depth: D + .08, bevelEnabled: false }); rgeo.translate(0, 0, -(D + .08) / 2);
      const rm = new THREE.Mesh(rgeo, kit.std(0x8c8378, { r: .85 })); rm.position.y = H + .04; rm.castShadow = rm.receiveShadow = true; b.add(rm);
      door(0, .22, .52); for (const x of [-.32, .32]) { win(x, .4, .2, .26); kit.box(.06, .26, .012, oak, x - .14, .4, f + .006, { parent: b }); kit.box(.06, .26, .012, oak, x + .14, .4, f + .006, { parent: b }); }
      lamp(-.17);
    }
    b.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const pop = K.id === 'logement' ? .245 : .24 + i * .008;
    facades.push({ root, hinge, local, world, pop, r: R });
    pins.push({ id: K.id, corners: world });
  });

  // la lumière d'une table d'architecte : une grande source douce au-dessus, un peu en arrière, et le ciel du studio
  const sun = new THREE.DirectionalLight(0xffd3a1, 3.4); sun.position.set(-9, 3.6, .5); sun.target.position.set(0, 0, -2.5);
  sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 });
  sun.shadow.bias = -.0003; sun.shadow.normalBias = .02; sun.shadow.radius = 6; scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0xdfe7ff, 0xe8dccb, .55));
  const soft = new THREE.RectAreaLight(0xfff3e4, 1.2, 8, 6); soft.position.set(0, 7, -2); soft.lookAt(0, 0, -2.6); scene.add(soft);

  // l'onde : un front qui part du point d'impact, se soulève en relief et s'amortit ; derrière lui, des sillons fins
  const P_IMPACT = portrait ? .2 : .2, SPEED = 32;
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
    { p: .31, pos: [0, 1.6, -.35], tgt: [0, .6, -4.6], fov: 60 },
    { p: .44, pos: [.6, 3.0, -.2], tgt: [0, .45, -4.6], fov: 64 },
    { p: .62, pos: [1.2, 3.3, .3], tgt: [0, .5, -5.0] },
    { p: .8, pos: [.4, 2.3, 1.6], tgt: [0, .6, -5.3], fov: 58 },
    { p: 1, pos: [0, 1.75, 2.2], tgt: [0, 1.25, -5.4], fov: 56 },
  ] : [
    { p: 0, pos: [0, 1.55, 8.6], tgt: [0, 1.55, 0], fov: 30 },
    { p: .1, pos: [0, 1.55, 7.4], tgt: [0, 1.55, 0], fov: 32 },
    { p: .22, pos: [0, 1.55, 2.6], tgt: [0, 1.4, -2], fov: 42 },
    { p: .265, pos: [0, 1.53, .9], tgt: [0, 1.1, -2.8], fov: 45 },
    { p: .31, pos: [0, 1.6, -.2], tgt: [0, .6, -4.4], fov: 43 },
    { p: .44, pos: [.6, 2.6, -.1], tgt: [0, .45, -4.4], fov: 46 },
    { p: .62, pos: [.95, 2.5, -.2], tgt: [0, .35, -4.7], fov: 49 },
    { p: .8, pos: [.3, 2.0, -.6], tgt: [0, .4, -5.1], fov: 52 },
    { p: 1, pos: [0, 1.75, -.85], tgt: [0, .55, -5.3], fov: 52 },
  ];

  const m4 = new THREE.Matrix4();
  return {
    path, fov: 40, bloom: [.04, .3, 1.4], exposure: 1.22, vignette: .18, ao: .7,
    pins,
    update(p) {
      ring.visible = plinth.visible = p < .32;   // passé derrière la caméra : il ne doit plus cacher la lumière ni rien d'autre
      // le point : il sort de l'anneau, retombe en arc derrière lui, rebondit, puis s'enfonce à moitié dans le papier
      // le point : un disque debout dans l'anneau ; il bascule en arrière, retombe à plat sur le papier et rebondit à peine
      const a = clamp((p - .12) / (P_IMPACT - .12)), land = new THREE.Vector3(C.x, TD / 2, C.z);
      dot.scale.setScalar(1);
      if (p < .12) { dot.position.copy(dotStart); dot.rotation.x = Math.PI / 2; }
      else if (p < P_IMPACT) { dot.position.lerpVectors(dotStart, land, a); dot.position.y = dotStart.y + (land.y - dotStart.y) * a * a + .45 * Math.sin(Math.PI * a) * (1 - a); dot.rotation.x = Math.PI / 2 * (1 - ease(a)); }
      else { const b2 = clamp((p - P_IMPACT) / .05); dot.position.copy(land); dot.position.y = land.y + .05 * Math.sin(Math.PI * b2) * (1 - b2); dot.rotation.x = 0;
        const g3 = ease(clamp((p - .22) / .4)); dot.scale.setScalar(1 - .45 * g3); dot.position.z = land.z - 2.15 * g3; dot.position.x = land.x - .35 * g3; dot.position.y *= 1 - .45 * g3; }   // il glisse, plus petit, jusqu'au pied des maquettes
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
