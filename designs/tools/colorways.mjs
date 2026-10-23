// Generates every colourway of a stylised-D concept from its two templates and renders a review sheet.
// Usage (from the repo root): node designs/tools/colorways.mjs <concept-id>
// Reads designs/logos/<id>/{upper,lower}.tmpl.svg. Each template:
//   viewBox="0 0 256 256"; a full-bleed background element with id="tile" filled with url(#tile-g);
//   <linearGradient id="tile-g"> stops using %TILE_A% and %TILE_B%; the letter filled/stroked with
//   url(#ink) where <linearGradient id="ink"> stops use %INK_A% and %INK_B%.
// Writes <case>-<colourway>.svg (with tile) and <case>-<colourway>-mark.svg (tile removed) next to the
// templates, and $OUT/logo-shots/<id>/dee-sheet.png + dee-hero.png (OUT: see lib.mjs).
import fs from 'fs';
import path from 'path';
import { REPO, DESIGNS, OUT, chromium } from './lib.mjs';

export const COLORWAYS = [
  { key: 'blue', label: 'Original blue', TILE_A: '#DEF8FB', TILE_B: '#A6E5F7', INK_A: '#1151FE', INK_B: '#05DFF2' },
  { key: 'sage', label: 'Sage on white', TILE_A: '#FAFAF8', TILE_B: '#ECEBE8', INK_A: '#3E7A5B', INK_B: '#8CC4A5' },
  { key: 'sage-dark', label: 'Sage on charcoal', TILE_A: '#2D2D2D', TILE_B: '#2D2D2D', INK_A: '#6FAF8E', INK_B: '#A8DCBD' },
  { key: 'charcoal', label: 'Charcoal', TILE_A: '#FFFFFF', TILE_B: '#FFFFFF', INK_A: '#2D2D2D', INK_B: '#2D2D2D' },
  { key: 'white-sage', label: 'White on sage', TILE_A: '#6FAF8E', TILE_B: '#3E7A5B', INK_A: '#FFFFFF', INK_B: '#FFFFFF' },
];

const id = process.argv[2];
if (!id) { console.error('usage: node designs/tools/colorways.mjs <concept-id>'); process.exit(2); }
const dir = path.join(DESIGNS, 'logos', id);
const out = path.join(OUT, 'logo-shots', id);
fs.mkdirSync(out, { recursive: true });

const problems = [];
const CASES = ['upper', 'lower'];
for (const c of CASES) {
  const f = path.join(dir, `${c}.tmpl.svg`);
  if (!fs.existsSync(f)) { console.error('missing ' + f); process.exit(2); }
  const s = fs.readFileSync(f, 'utf8');
  if (!/viewBox="0 0 256 256"/.test(s)) problems.push(`${c}: viewBox must be "0 0 256 256"`);
  if (!/id="tile"/.test(s)) problems.push(`${c}: needs a background element with id="tile"`);
  for (const t of ['%TILE_A%', '%TILE_B%', '%INK_A%', '%INK_B%']) if (!s.includes(t)) problems.push(`${c}: token ${t} not used`);
  if (/<text[\s>]/.test(s)) problems.push(`${c}: uses <text>; draw the letter as shapes`);
  if (/<image[\s>]/.test(s) || /(href|src)=["'](https?:|\/\/)/.test(s)) problems.push(`${c}: raster or external reference`);
  for (const cw of COLORWAYS) {
    let svg = s;
    for (const t of ['TILE_A', 'TILE_B', 'INK_A', 'INK_B']) svg = svg.split(`%${t}%`).join(cw[t]);
    fs.writeFileSync(path.join(dir, `${c}-${cw.key}.svg`), svg);
    // Mark-only: drop the element carrying id="tile" (self-closing or paired).
    const mark = svg.replace(/<(\w+)([^>]*\sid="tile"[^>]*)\/>/, '').replace(/<(\w+)([^>]*\sid="tile"[^>]*)>[\s\S]*?<\/\1>/, '');
    if (mark === svg) problems.push(`${c}: could not strip the tile element for the mark-only file`);
    fs.writeFileSync(path.join(dir, `${c}-${cw.key}-mark.svg`), mark);
  }
}

const u = n => 'file://' + path.join(dir, n);
const photo = 'file://' + REPO + '/assets/img/table.jpg';
const row = cw => `
  <tr><th>${cw.label}</th>
  ${CASES.map(c => `<td><div class="cell">
      <img src="${u(`${c}-${cw.key}.svg`)}" width="150" height="150" style="border-radius:30px">
      <img src="${u(`${c}-${cw.key}.svg`)}" width="64" height="64" style="border-radius:14px">
      <img src="${u(`${c}-${cw.key}.svg`)}" width="40" height="40" style="border-radius:50%">
      <span class="tab"><img src="${u(`${c}-${cw.key}.svg`)}" width="16" height="16" style="border-radius:3px">Divi</span>
    </div></td>`).join('')}</tr>`;
const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#f2f3f1;font:600 13px/1.3 "Helvetica Neue",Helvetica,Arial,sans-serif;color:#444}
  table{border-collapse:separate;border-spacing:16px 12px;margin:12px}
  th{text-align:left;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#2d2d2d;padding-right:8px}
  thead th{text-align:center}
  .cell{display:flex;gap:14px;align-items:center;background:#fff;border-radius:16px;padding:14px 18px;box-shadow:0 0 0 1px #e1e3df}
  .tab{display:inline-flex;align-items:center;gap:6px;background:#dee1e6;border-radius:6px;padding:6px 10px;font-weight:500;color:#222}
  .photo{display:flex;gap:28px;align-items:center;padding:24px 32px;margin:4px 28px 24px;border-radius:16px;
    background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
  .photo span{color:#fff;font-size:12px}
</style></head><body>
<table><thead><tr><th></th><th>Uppercase D</th><th>Lowercase d</th></tr></thead><tbody>
${COLORWAYS.map(row).join('')}
</tbody></table>
<div class="photo">${COLORWAYS.map(cw => `<img src="${u(`upper-${cw.key}.svg`)}" width="44" height="44" style="border-radius:8px"><img src="${u(`lower-${cw.key}.svg`)}" width="44" height="44" style="border-radius:8px">`).join('')}<span>site icon on the photo, 44px (each colourway, D then d)</span></div>
</body></html>`;
fs.writeFileSync(path.join(out, 'dee-sheet.html'), sheet);

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 2 });
p.on('requestfailed', r => problems.push('failed to load ' + r.url()));
await p.goto('file://' + path.join(out, 'dee-sheet.html'));
await p.waitForLoadState('load');
const broken = await p.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.src));
broken.forEach(b => problems.push('image did not render: ' + b));
await p.screenshot({ path: path.join(out, 'dee-sheet.png'), fullPage: true });

// The uppercase D in "Sage on charcoal" as the site icon on option E's photo band.
const q = await browser.newPage({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 2 });
await q.goto(`file://${REPO}/designs/e-loop/index.html?tone=white&footer=charcoal&shot=1`);
await q.evaluate(async src => { const img = document.querySelector('[data-check="icon"]'); img.src = src; await img.decode().catch(() => {}); }, u('upper-sage-dark.svg'));
await q.waitForTimeout(500);
await q.screenshot({ path: path.join(out, 'dee-hero.png'), clip: { x: 0, y: 0, width: 700, height: 260 } });
await browser.close();

for (const m of problems) console.log('PROBLEM: ' + m);
console.log(`${problems.length} problems. Wrote ${COLORWAYS.length * 4} SVGs to ${dir}; sheet: ${path.join(out, 'dee-sheet.png')}, hero: ${path.join(out, 'dee-hero.png')}`);
