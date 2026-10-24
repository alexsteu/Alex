// Rend index.html image par image (rendu déterministe via window.render(t)) puis encode en MP4.
//   NODE_PATH=$(npm root -g) node render.cjs                 → oonde-video.mp4 (60 i/s, sans son)
//   NODE_PATH=$(npm root -g) node render.cjs --stills 1,4.5  → stills/t-1.00.png …
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DURATION = 15;
const FPS = Number(process.env.FPS || 60);
const MIME = { '.html': 'text/html', '.woff2': 'font/woff2', '.js': 'text/javascript', '.css': 'text/css' };

function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

(async () => {
  const args = process.argv.slice(2);
  const stillsIdx = args.indexOf('--stills');
  const server = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.waitForFunction(() => window.READY === true);

  if (stillsIdx >= 0) {
    const times = args[stillsIdx + 1].split(',').map(Number);
    fs.mkdirSync(path.join(ROOT, 'stills'), { recursive: true });
    for (const t of times) {
      await page.evaluate(x => window.render(x), t);
      await page.screenshot({ path: path.join(ROOT, 'stills', `t-${t.toFixed(2)}.png`) });
    }
  } else {
    const out = args[0] || path.join(ROOT, 'oonde-video.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(DURATION * FPS);
    for (let i = 0; i < N; i++) {
      await page.evaluate(x => window.render(x), i / FPS);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % FPS === 0) console.log(`image ${i}/${N}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('→', out);
  }
  await browser.close();
  server.close();
})();
