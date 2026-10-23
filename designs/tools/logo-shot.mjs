// Renders a Divi logo concept for review. Never modifies the site files: the
// in-context shots swap the icon in the live DOM only.
// Usage (from the repo root): node designs/tools/logo-shot.mjs <concept-id>
// Reads designs/logos/<id>/:
//   mark.svg (required)       the symbol alone, transparent background, brand colours
//   app-icon.svg (required)   the symbol on its square tile (favicon, home screen, avatar)
//   mark-mono.svg (required)  one-colour version, drawn in white (shown on photo/charcoal)
//   lockup.svg (optional)     symbol + DIVI wordmark, horizontal
//   site-icon.svg (optional)  what sits top-left on the photo band (defaults to app-icon.svg)
// Writes to $OUT/logo-shots/<id>/ (OUT: see lib.mjs): sheet.png, hero-crop.png,
//   context-{c,d,e}-{desk,phone}.png
import fs from 'fs';
import path from 'path';
import { REPO, DESIGNS, OUT, chromium } from './lib.mjs';

const id = process.argv[2];
if (!id) { console.error('usage: node designs/tools/logo-shot.mjs <concept-id>'); process.exit(2); }
const dir = path.join(DESIGNS, 'logos', id);
const out = path.join(OUT, 'logo-shots', id);
fs.mkdirSync(out, { recursive: true });

const f = name => path.join(dir, name);
const has = name => fs.existsSync(f(name));
for (const req of ['mark.svg', 'app-icon.svg', 'mark-mono.svg'])
  if (!has(req)) { console.error('missing ' + f(req)); process.exit(2); }

// Basic SVG hygiene checks.
const problems = [];
for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.svg'))) {
  const s = fs.readFileSync(f(name), 'utf8');
  if (!/viewBox=/.test(s)) problems.push(`${name}: no viewBox`);
  if (/<text[\s>]/.test(s)) problems.push(`${name}: uses <text> — outline letterforms as shapes so it does not depend on fonts`);
  if (/(href|src)=["'](https?:|\/\/)/.test(s)) problems.push(`${name}: external reference`);
  if (/<image[\s>]/.test(s)) problems.push(`${name}: embeds a raster <image>`);
}

const url = name => 'file://' + f(name);
const site = has('site-icon.svg') ? 'site-icon.svg' : 'app-icon.svg';
const photo = 'file://' + REPO + '/assets/img/table.jpg';

const sheet = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#f2f3f1;font:600 12px/1.3 "Helvetica Neue",Helvetica,Arial,sans-serif;color:#555;letter-spacing:.03em}
  .wrap{padding:28px;display:grid;gap:22px;width:1344px}
  h2{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#2d2d2d}
  .row{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
  .cell{display:grid;gap:6px;justify-items:center}
  .sw{display:grid;place-items:center;border-radius:12px;width:220px;height:220px}
  .w{background:#fafaf8;border:1px solid #e3e3e0}.k{background:#2d2d2d}.s{background:#24382e}
  .p{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
  .tab{display:flex;align-items:center;gap:8px;background:#fff;border-radius:8px 8px 0 0;padding:9px 14px;width:240px;color:#2d2d2d;font-weight:500;box-shadow:0 0 0 1px #ddd}
  .tabbar{background:#dee1e6;padding:8px 8px 0;border-radius:10px 10px 0 0;width:320px}
  .tabbar.dark{background:#202124}.tabbar.dark .tab{background:#35363a;color:#e8eaed;box-shadow:none}
  .home{width:330px;height:220px;border-radius:16px;background:linear-gradient(160deg,#5b6b7a,#2e3a46);display:flex;gap:22px;align-items:center;justify-content:center}
  .app{display:grid;gap:5px;justify-items:center;color:#fff;font-weight:500;font-size:11px}
  .app img{width:60px;height:60px;border-radius:13.5px}
  .round{border-radius:50%}
  .chat{display:flex;align-items:center;gap:10px;background:#fff;border-radius:10px;padding:10px 14px;width:300px;box-shadow:0 0 0 1px #ddd;color:#111;font-weight:500}
  .chat img{width:44px;height:44px;border-radius:50%}
  .chat small{display:block;color:#667781;font-weight:400}
</style></head><body><div class="wrap">
  <section><h2>Mark</h2><div class="row">
    <div class="cell"><div class="sw w"><img src="${url('mark.svg')}" width="150" height="150"></div>white</div>
    <div class="cell"><div class="sw k"><img src="${url('mark.svg')}" width="150" height="150"></div>charcoal</div>
    <div class="cell"><div class="sw s"><img src="${url('mark.svg')}" width="150" height="150"></div>sage</div>
    <div class="cell"><div class="sw p"><img src="${url('mark-mono.svg')}" width="150" height="150"></div>mono on photo</div>
    <div class="cell"><div class="sw k"><img src="${url('mark-mono.svg')}" width="150" height="150"></div>mono on charcoal</div>
  </div></section>
  <section><h2>App icon — 180 / 64 / 44 / 32 / 16 px</h2><div class="row">
    ${[180, 64, 44, 32, 16].map(s => `<div class="cell"><img src="${url('app-icon.svg')}" width="${s}" height="${s}" style="border-radius:${Math.round(s * 0.2)}px">${s}</div>`).join('')}
    <div class="cell"><div class="sw p" style="width:180px;height:120px"><img src="${url(site)}" width="44" height="44" style="border-radius:8px"></div>site icon on photo, 44px</div>
    <div class="cell"><div class="sw w" style="width:180px;height:120px"><img src="${url(site)}" width="36" height="36" style="border-radius:7px"></div>site icon, 36px</div>
  </div></section>
  <section><h2>Circle crop (WhatsApp / iMessage avatar), tabs, home screen</h2><div class="row">
    <div class="cell"><img class="round" src="${url('app-icon.svg')}" width="120" height="120">120</div>
    <div class="cell"><img class="round" src="${url('app-icon.svg')}" width="40" height="40">40</div>
    <div class="cell"><div class="chat"><img src="${url('app-icon.svg')}"><div>Divi<small>Here's your link to split the bill</small></div></div>WhatsApp chat row</div>
    <div class="cell"><div class="tabbar"><div class="tab"><img src="${url('app-icon.svg')}" width="16" height="16" style="border-radius:3px">Divi</div></div>
      <div class="tabbar dark"><div class="tab"><img src="${url('app-icon.svg')}" width="16" height="16" style="border-radius:3px">Divi</div></div>browser tabs (light/dark)</div>
    <div class="cell"><div class="home"><div class="app"><img src="${url('app-icon.svg')}">Divi</div><div class="app"><img src="${url('app-icon.svg')}" style="filter:none">Divi</div></div>home screen</div>
  </div></section>
  ${has('lockup.svg') ? `<section><h2>Lockup</h2><div class="row">
    <div class="cell"><div class="sw w" style="width:640px;height:200px"><img src="${url('lockup.svg')}" style="max-width:520px;max-height:110px"></div>white</div>
    <div class="cell"><div class="sw k" style="width:640px;height:200px"><img src="${url('lockup.svg')}" style="max-width:520px;max-height:110px;filter:none"></div>charcoal</div>
  </div></section>` : ''}
</div></body></html>`;
fs.writeFileSync(path.join(out, 'sheet.html'), sheet);

const browser = await chromium.launch();
const errors = [];
{
  const p = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  p.on('requestfailed', r => errors.push('failed to load ' + r.url()));
  await p.goto('file://' + path.join(out, 'sheet.html'));
  await p.waitForLoadState('load');
  const broken = await p.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.src));
  broken.forEach(b => errors.push('image did not render: ' + b));
  await p.screenshot({ path: path.join(out, 'sheet.png'), fullPage: true });
  await p.close();
}

// In-context: the chosen homepage directions, white tone with the charcoal footer.
for (const [slug, tag] of [['c-overlap', 'c'], ['d-bleed', 'd'], ['e-loop', 'e']]) {
  for (const [w, h, kind, dsf] of [[1440, 790, 'desk', 1], [390, 664, 'phone', 2]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, isMobile: kind === 'phone', hasTouch: kind === 'phone' });
    const p = await ctx.newPage();
    await p.goto(`file://${REPO}/designs/${slug}/index.html?tone=white&footer=charcoal&shot=1`);
    await p.waitForLoadState('load');
    await p.evaluate(async src => {
      const img = document.querySelector('[data-check="icon"]');
      img.src = src;
      await img.decode().catch(() => {});
    }, url(site));
    await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(out, `context-${tag}-${kind}.png`) });
    if (tag === 'c' && kind === 'desk') {
      await ctx.close();
      const z = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      const q = await z.newPage();
      await q.goto(`file://${REPO}/designs/${slug}/index.html?tone=white&footer=charcoal&shot=1`);
      await q.evaluate(async src => { const img = document.querySelector('[data-check="icon"]'); img.src = src; await img.decode().catch(() => {}); }, url(site));
      await q.waitForTimeout(600);
      await q.screenshot({ path: path.join(out, 'hero-crop.png'), clip: { x: 0, y: 0, width: 700, height: 280 } });
      await z.close();
      continue;
    }
    await ctx.close();
  }
}
await browser.close();

for (const m of [...problems, ...errors]) console.log('PROBLEM: ' + m);
console.log(`${problems.length + errors.length} problems. Shots in ${out}: sheet.png hero-crop.png context-{c,d}-{desk,phone}.png`);
