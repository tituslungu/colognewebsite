// Comparison sheet for the Fork dark-background variants (and the homepage corner on option E).
// Usage (from the repo root): node designs/tools/fork-sheet.mjs
// Reads designs/logos/fork-dark/<variant>-{mark,app}.svg; writes $OUT/logo-shots/fork-dark/sheet.png and
// hero-<variant>.png (OUT: see lib.mjs), which logo-gallery.mjs (FORK=1) turns into the preview JPEGs.
import fs from 'fs';
import path from 'path';
import { REPO, DESIGNS, OUT, chromium } from './lib.mjs';
const D = 'file://' + DESIGNS + '/logos/fork-dark/';
const SHOTS = path.join(OUT, 'logo-shots', 'fork-dark') + '/';
fs.mkdirSync(SHOTS, { recursive: true });
const V = ['original', 'thin', 'medium', 'heavy', 'sticker', 'disc'];
const BG = [['#FAFAF8', 'white'], ['#ECEBE8', 'light gray'], ['#2D2D2D', 'charcoal'], ['#24382E', 'deep sage'],
  [`linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(file://${REPO}/assets/img/table.jpg) center/cover`, 'photo']];
const html = `<!doctype html><meta charset="utf-8"><style>
 body{margin:0;background:#f2f3f1;font:600 12px/1.2 "Helvetica Neue",Arial,sans-serif;color:#444}
 table{border-collapse:separate;border-spacing:10px;margin:10px}
 th{text-transform:uppercase;letter-spacing:.06em;text-align:left;color:#2d2d2d}
 .bg{width:120px;height:120px;border-radius:14px;display:grid;place-items:center}
 .bg img{width:96px;height:96px}
 .apps{display:flex;gap:12px;align-items:center;background:#fff;border-radius:14px;padding:10px 14px}
 .tab{display:inline-flex;gap:6px;align-items:center;padding:6px 10px;border-radius:6px;font-weight:500}
</style><table><tr><th></th>${BG.map(b => `<th>${b[1]}</th>`).join('')}<th>app icon · avatar · tabs</th></tr>
${V.map(v => `<tr><th>${v}</th>${BG.map(b => `<td><div class="bg" style="background:${b[0]}"><img src="${D}${v}-mark.svg"></div></td>`).join('')}
<td><div class="apps"><img src="${D}${v}-app.svg" width="96" height="96" style="border-radius:22px"><img src="${D}${v}-app.svg" width="40" height="40" style="border-radius:50%">
<span class="tab" style="background:#dee1e6"><img src="${D}${v}-mark.svg" width="16" height="16">Divi</span><span class="tab" style="background:#35363a;color:#e8eaed"><img src="${D}${v}-mark.svg" width="16" height="16">Divi</span></div></td></tr>`).join('')}
</table>`;
fs.writeFileSync(SHOTS + 'sheet.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
await p.goto('file://' + SHOTS + 'sheet.html'); await p.waitForLoadState('load');
const broken = await p.evaluate(() => [...document.images].filter(i => !i.naturalWidth).length);
await p.screenshot({ path: SHOTS + 'sheet.png', fullPage: true });
for (const v of V) {
  const q = await b.newPage({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 2 });
  await q.goto('file://' + DESIGNS + '/e-loop/index.html?tone=white&footer=charcoal&shot=1');
  await q.evaluate(async src => { const i = document.querySelector('[data-check="icon"]'); i.src = src; i.style.borderRadius = '0'; await i.decode().catch(() => {}); }, D + v + '-mark.svg');
  await q.waitForTimeout(400);
  await q.screenshot({ path: SHOTS + `hero-${v}.png`, clip: { x: 0, y: 0, width: 420, height: 200 } });
  await q.close();
}
await b.close();
console.log('broken images:', broken);
