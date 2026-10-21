// Frame-accurate renderer: drives clip.html in headless Chromium, one deterministic
// frame at a time (window.renderAt(t)), pipes JPEG frames into ffmpeg, then muxes
// the untouched original audio.
//
// usage: node render.js --audio song.mp3 --out out.mp4 [--from 0] [--to 181.632]
//                       [--format 16x9] [--workers 4] [--fps 30]
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
  return acc;
}, []));
const FPS = +(args.fps || 30);
const FORMAT = args.format || '16x9';
const [W, H] = FORMAT === '9x16' ? [1080, 1920] : [1920, 1080];
const audio = path.resolve(args.audio);
const out = path.resolve(args.out || 'out.mp4');
const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).toString();
const from = +(args.from || 0);
const to = Math.min(+(args.to || dur), dur);
const workers = +(args.workers || 4);
const first = Math.round(from * FPS);
const last = Math.ceil(to * FPS); // exclusive
const page_url = 'file://' + path.join(__dirname, 'clip.html') + `?format=${FORMAT}`;
const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'clip-'));

async function renderChunk(browser, idx, f0, f1) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(page_url);
  await page.evaluate(() => document.fonts.ready);
  const seg = path.join(tmp, `seg${idx}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS),
    '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', seg]);
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.renderAt(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 150 === 0) console.log(`worker ${idx}: frame ${f}/${f1}`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c ? rej(new Error('ffmpeg ' + c)) : res())));
  await page.close();
  return seg;
}

(async () => {
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-gpu'] });
  const n = last - first, per = Math.ceil(n / workers);
  const jobs = [];
  for (let i = 0; i < workers; i++) {
    const f0 = first + i * per, f1 = Math.min(last, f0 + per);
    if (f0 < f1) jobs.push(renderChunk(browser, i, f0, f1));
  }
  const segs = await Promise.all(jobs);
  await browser.close();
  const list = path.join(tmp, 'list.txt');
  fs.writeFileSync(list, segs.map(s => `file '${s}'`).join('\n'));
  // Audio: original recording, only trimmed to the rendered window (no processing).
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
    '-ss', String(first / FPS), '-t', String((last - first) / FPS), '-i', audio,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
    '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('wrote', out);
})();
