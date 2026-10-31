// Kit Reels OONDE : rend une page HTML image par image puis encode en MP4 (H.264, sans son).
// Contrat de la page : window.DURATION (secondes), window.render(t) déterministe, window.READY = true
// quand polices et images sont prêtes. Taille de travail : 1080 × 1920.
//
//   NODE_PATH=$(npm root -g) node render.cjs <dossier> <sortie.mp4> [--fps 30]
//   NODE_PATH=$(npm root -g) node render.cjs <dossier> --stills 0.5,3,7.2 [--out stills/]
//   NODE_PATH=$(npm root -g) node render.cjs <dossier> --sheet <sheet.jpg> [--n 12]   (planche contact pour la critique)
//   options : --h 1350 (carrousel 1080×1350), --q safe (affiche la zone de sécurité)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const ROOT = path.resolve(args[0] || '.');
const KIT = __dirname;
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const FPS = Number(opt('fps', 30));
const W = Number(opt('w', 1080)), H = Number(opt('h', 1920));   // carrousel : --h 1350
const Q = opt('q', '');                                          // ex. --q safe → index.html?safe
const MIME = { '.html': 'text/html', '.woff2': 'font/woff2', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json' };

function serve() {
  // sert le dossier du Reel ; /_kit/... sert le kit (polices, logos)
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const base = u.startsWith('/_kit/') ? KIT : ROOT;
    const rel = u.startsWith('/_kit/') ? u.slice(5) : u;
    const file = path.join(base, rel === '/' ? 'index.html' : rel);
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

(async () => {
  const server = await serve();
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => { errors.push(e.message); console.error('page error:', e.message); });
  page.on('console', m => { if (m.type() === 'error') { errors.push(m.text()); console.error('console:', m.text()); } });
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html${Q ? '?' + Q : ''}`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const DUR = await page.evaluate(() => window.DURATION);
  if (!DUR) throw new Error('window.DURATION manquant');

  if (args.includes('--stills')) {
    const times = opt('stills').split(',').map(Number);
    const out = path.resolve(opt('out', path.join(ROOT, 'stills')));
    fs.mkdirSync(out, { recursive: true });
    for (const t of times) {
      await page.evaluate(x => window.render(x), t);
      await page.screenshot({ path: path.join(out, `t-${t.toFixed(2)}.png`) });
    }
    console.log('stills →', out);
  } else if (args.includes('--sheet')) {
    // planche : n images réparties sur la durée, réduites à 270 px de large, 6 par ligne, temps écrit dessous
    const n = Number(opt('n', 12)), out = path.resolve(opt('sheet'));
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'sheet-'));
    const files = [];
    for (let i = 0; i < n; i++) {
      const t = (DUR - 0.05) * i / (n - 1);
      await page.evaluate(x => window.render(x), t);
      const f = path.join(tmp, `s${String(i).padStart(2, '0')}.png`);
      await page.screenshot({ path: f });
      files.push([f, t]);
    }
    const inputs = files.flatMap(([f]) => ['-i', f]);
    const cols = Math.min(6, n), rows = Math.ceil(n / cols);
    const TH = Math.round(270 * H / W);
    const labels = files.map(([, t], i) => `[${i}]scale=270:${TH},drawbox=y=${TH - 28}:h=28:w=270:color=black@0.6:t=fill,drawtext=fontfile=${KIT}/fonts/ibm-plex-mono-latin-500-normal.woff2:text='${t.toFixed(1)} s':x=8:y=${TH - 22}:fontsize=18:fontcolor=white[v${i}]`).join(';');
    const layout = files.map((_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * TH}`).join('|');
    const stack = files.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${n}:layout=${layout}:fill=white`;
    try {
      execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', labels + ';' + stack, '-frames:v', '1', '-q:v', '3', out]);
    } catch (e) {   // drawtext indisponible : planche sans légende
      const plain = files.map((_, i) => `[${i}]scale=270:${TH}[v${i}]`).join(';');
      execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', plain + ';' + stack, '-frames:v', '1', '-q:v', '3', out]);
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('planche →', out, `(${n} images, ${cols}×${rows})`);
  } else {
    const out = path.resolve(args[1] || path.join(ROOT, 'video.mp4'));
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const total = Math.round(DUR * FPS);
    for (let i = 0; i < total; i++) {
      await page.evaluate(x => window.render(x), i / FPS);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % (FPS * 2) === 0) console.log(`image ${i}/${total}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('→', out, `${total} images, ${FPS} i/s`);
  }
  if (errors.length) console.log('ERREURS PAGE :', errors.length);
  await browser.close();
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
