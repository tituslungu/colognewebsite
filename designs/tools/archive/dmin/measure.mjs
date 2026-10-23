// Measures ink bbox, centroid and max distance from tile centre for the dee-min marks (charcoal, no tile).
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
import fs from 'fs';
const DIR = '/Users/titus/repos/colognewebsite/designs/logos/' + (process.argv[2] || 'dee-min');
const b = await chromium.launch(); const p = await b.newPage();
for (const c of ['upper', 'lower']) {
  await p.goto(`file://${process.cwd()}/blank.html`);
  const res = await p.evaluate(async (url) => {
    const img = new Image(); img.src = url; await img.decode();
    const N = 512, k = N / 256; const cv = document.createElement('canvas'); cv.width = cv.height = N;
    const g = cv.getContext('2d'); g.drawImage(img, 0, 0, N, N);
    const d = g.getImageData(0, 0, N, N).data; let sx = 0, sy = 0, sw = 0, x0 = N, y0 = N, x1 = 0, y1 = 0, md = 0;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const a = d[(y * N + x) * 4 + 3] / 255; if (a > 0.5) { sx += x * a; sy += y * a; sw += a; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); md = Math.max(md, Math.hypot(x + .5 - N / 2, y + .5 - N / 2)); } }
    const f = v => +(v / k).toFixed(1);
    return { bbox: [f(x0), f(y0), f(x1 + 1), f(y1 + 1)], bboxCentre: [f((x0 + x1 + 1) / 2), f((y0 + y1 + 1) / 2)], centroid: [f(sx / sw), f(sy / sw)], maxR: f(md), inkArea: +(sw / k / k / 65536 * 100).toFixed(1) + '%' };
  }, 'data:image/svg+xml;base64,' + fs.readFileSync(`${DIR}/${c}-charcoal-mark.svg`).toString('base64'));
  console.log(c, JSON.stringify(res));
}
await b.close();
