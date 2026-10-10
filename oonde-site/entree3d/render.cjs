// node render.cjs --scene restaurant --w 1280 --h 800 --ss 2 --n 96 --out out/restaurant/d   (ou --p 0,.5,1 pour des images fixes)
const { chromium } = require('playwright'); const sharp = require('sharp'); const fs = require('fs'); const path = require('path');
const a = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map(s => { const [k, ...v] = s.trim().split(' '); return [k, v.join(' ')]; }));
const W = +a.w || 1280, H = +a.h || 800, SS = +a.ss || 1, out = a.out || 'out/test', fmt = a.fmt || 'webp', port = a.port || 8791;
const ps = a.p ? a.p.split(',').map(Number) : Array.from({ length: +a.n || 96 }, (_, i) => i / ((+a.n || 96) - 1));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: Math.min(W * SS, 3000), height: Math.min(H * SS, 3000) } });
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text().slice(0, 300)); });
  pg.on('pageerror', e => console.log('[err]', e.message));
  await pg.goto(`http://localhost:${port}/render.html?scene=${a.scene || 'restaurant'}&w=${W}&h=${H}&ss=${SS}${a.q ? '&' + a.q : ''}`);
  await pg.waitForFunction('window.READY === true', null, { timeout: 600000 });
  const pins = []; const t0 = Date.now();
  for (let i = 0; i < ps.length; i++) {
    const r = await pg.evaluate(p => { const r = window.frame(p); return { ...r, img: document.querySelector('canvas').toDataURL('image/png') }; }, ps[i]);
    const buf = Buffer.from(r.img.split(',')[1], 'base64');
    const name = a.p ? `p${String(ps[i]).replace('.', '_')}` : `f${String(i).padStart(3, '0')}`;
    let im = sharp(buf).resize(W, H, { kernel: 'lanczos3' });
    if (fmt === 'webp') await im.webp({ quality: +a.quality || 80, effort: 5 }).toFile(path.join(out, name + '.webp'));
    else await im.jpeg({ quality: 88 }).toFile(path.join(out, name + '.jpg'));
    pins.push({ p: +ps[i].toFixed(4), pins: r.pins });
    if (i % 8 === 0 || a.p) console.log(`${name} p=${ps[i].toFixed(3)} ${((Date.now() - t0) / 1000 / (i + 1)).toFixed(1)} s/image`);
  }
  if (!a.p) fs.writeFileSync(path.join(out, 'pins.json'), JSON.stringify(pins));
  else fs.writeFileSync(path.join(out, 'pins-stills.json'), JSON.stringify(pins, null, 1));
  await b.close();
})();
