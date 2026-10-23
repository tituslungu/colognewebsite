// node analyse.mjs <dir-with-svgs> [prefix]  -> metrics for upper/lower charcoal + small-size sheet
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const dir = process.argv[2]; const tag = process.argv[3] || 'a';
const out = path.resolve('.');
const b = await chromium.launch();
// metrics
const p = await b.newPage({ viewport: { width: 256, height: 256 } });
for (const c of ['upper', 'lower']) {
  const svg = fs.readFileSync(path.join(dir, `${c}-charcoal.svg`), 'utf8');
  await p.setContent(`<body style="margin:0">${svg.replace('<svg ', '<svg width="256" height="256" ')}</body>`);
  const m = await p.evaluate(async () => {
    const s = document.querySelector('svg'); const xml = new XMLSerializer().serializeToString(s);
    const img = new Image(); img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml))); await img.decode();
    const S = 1024; const cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d'); g.drawImage(img, 0, 0, S, S);
    const d = g.getImageData(0, 0, S, S).data; let minx = S, maxx = 0, miny = S, maxy = 0, sx = 0, sy = 0, n = 0, maxr = 0;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const i = (y * S + x) * 4; const a = 255 - d[i]; if (a > 128) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); const r = Math.hypot(x + .5 - S / 2, y + .5 - S / 2); if (r > maxr) maxr = r; } if (a > 0) { sx += a * x; sy += a * y; n += a; } }
    const k = 256 / S; return { bbox: [minx * k, miny * k, (maxx + 1) * k, (maxy + 1) * k].map(v => +v.toFixed(1)), bboxCentre: [((minx + maxx + 1) / 2 * k).toFixed(1), ((miny + maxy + 1) / 2 * k).toFixed(1)], inkCentroid: [(sx / n * k).toFixed(1), (sy / n * k).toFixed(1)], maxR: +(maxr * k).toFixed(1), coverage: +(n / 255 / S / S).toFixed(3) };
  });
  console.log(c, JSON.stringify(m));
}
await p.close();
// small sizes sheet: each colourway: 16px @1x scaled 8x, 16px @2x scaled 4x, 40px circle @1x scaled 3x, 40 @2x
const cws = ['blue', 'sage', 'sage-dark', 'charcoal', 'white-sage'];
const pg = await b.newPage({ viewport: { width: 1400, height: 700 }, deviceScaleFactor: 1 });
const u = f => 'file://' + path.join(dir, f);
let html = `<body style="margin:0;background:#dee1e6;font:12px system-ui;padding:10px">`;
for (const c of ['upper', 'lower']) {
  html += `<div style="display:flex;gap:18px;align-items:center;margin-bottom:10px">`;
  for (const cw of cws) html += `<div style="display:flex;gap:6px;align-items:center"><img src="${u(`${c}-${cw}.svg`)}" width="16" height="16" style="border-radius:3px"><img src="${u(`${c}-${cw}.svg`)}" width="24" height="24" style="border-radius:4px"><img src="${u(`${c}-${cw}.svg`)}" width="40" height="40" style="border-radius:50%"></div>`;
  html += `</div>`;
}
html += `</body>`;
fs.writeFileSync(path.join(out, `small-${tag}.html`), html);
await pg.goto('file://' + path.join(out, `small-${tag}.html`)); await pg.waitForTimeout(300);
await pg.screenshot({ path: path.join(out, `small-${tag}-1x.png`), clip: { x: 0, y: 0, width: 620, height: 130 } });
// upscale pixelated
const pg2 = await b.newPage({ viewport: { width: 620 * 3, height: 130 * 3 } });
fs.writeFileSync(path.join(out, `small-${tag}-zoom.html`), `<body style="margin:0"><img src="file://${path.join(out, `small-${tag}-1x.png`)}" style="width:${620 * 3}px;image-rendering:pixelated"></body>`);
await pg2.goto('file://' + path.join(out, `small-${tag}-zoom.html`)); await pg2.waitForTimeout(200);
await pg2.screenshot({ path: path.join(out, `small-${tag}-zoom.png`) });
await b.close();
console.log('wrote', path.join(out, `small-${tag}-zoom.png`));
