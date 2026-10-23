// Ink metrics: bbox, centroid, max radius from centre; for C png (threshold on blue-ness) and svg marks (alpha).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const files = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
await p.setContent('<body></body>');
for (const f of files) {
  const url = 'data:' + (f.endsWith('.png') ? 'image/png' : 'image/svg+xml') + ';base64,' + fs.readFileSync(f).toString('base64');
  const r = await p.evaluate(async ([f, url]) => {
    const img = new Image(); img.src = url; await img.decode();
    const W = 256, H = 256; const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0, W, f.endsWith('.png') ? 250 : 256);
    const d = g.getImageData(0, 0, W, H).data;
    let n = 0, sx = 0, sy = 0, x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, rmax = 0;
    const isPng = f.endsWith('.png');
    const cy0 = isPng ? 125 : 128;
    const rows = {};
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4; let w;
      if (isPng) { const R = d[i], G = d[i + 1], B = d[i + 2]; w = Math.max(0, Math.min(1, ((B - R) - 120) / 60)); if (y >= 250) w = 0; }
      else w = d[i + 3] / 255;
      if (w > 0.5) { n += w; sx += x * w; sy += y * w; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        rmax = Math.max(rmax, Math.hypot(x + .5 - 128, y + .5 - cy0)); }
    }
    return { f: f.split('/').pop(), bbox: [x0, y0, x1, y1], bboxCentre: [(x0 + x1 + 1) / 2, (y0 + y1 + 1) / 2], centroid: [+(sx / n).toFixed(1), +(sy / n).toFixed(1)], rmax: +rmax.toFixed(1), area: Math.round(n) };
  }, [f, url]);
  console.log(JSON.stringify(r));
}
await b.close();
