// usage: node snap.js outdir t1 t2 ...  -> PNG stills for review
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  p.on('console', m => console.log('console', m.text()));
  await p.goto('file://' + path.join(__dirname, 'clip.html'));
  await p.evaluate(() => document.fonts.ready);
  for (const t of ts) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: `${out}/t${(+t).toFixed(2)}.png` }); }
  await b.close();
})();
