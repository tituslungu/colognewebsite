// node measure.mjs file.svg ...  -> bbox, max radius from tile centre, ink centroid (256 units)
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 512, height: 512 } });
for (const f of process.argv.slice(2)) {
  await p.setContent('<body></body>');
  const src = require('fs').readFileSync(f, 'utf8');
  const r = await p.evaluate(async (src) => {
    const holder = document.createElement('div'); holder.innerHTML = src; const svg = holder.querySelector('svg'); svg.querySelector('#tile')?.remove();
    svg.querySelectorAll('stop').forEach(s => s.setAttribute('stop-color', '#000'));
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image(); img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml))); await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 512, 512);
    const d = g.getImageData(0, 0, 512, 512).data;
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, mr = 0, sx = 0, sy = 0, n = 0;
    for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) { const a = d[(y * 512 + x) * 4 + 3]; if (a > 128) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); const rr = Math.hypot(x + .5 - 256, y + .5 - 256); mr = Math.max(mr, rr); sx += x; sy += y; n++; } }
    return { bbox: [x0 / 2, y0 / 2, (x1 + 1) / 2, (y1 + 1) / 2], bboxCentre: [(x0 + x1 + 1) / 4, (y0 + y1 + 1) / 4], maxR: mr / 2, centroid: [sx / n / 2, sy / n / 2], inkPct: n / 512 / 512 * 100 };
  }, src);
  console.log(f.split('/').slice(-2).join('/'), JSON.stringify(r, (k, v) => typeof v === 'number' ? +v.toFixed(1) : v));
}
await b.close();
