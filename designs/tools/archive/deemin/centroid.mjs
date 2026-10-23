import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const D = '/Users/titus/repos/colognewebsite/designs/logos/dee-min';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 600, height: 600 } });
for (const c of ['upper', 'lower']) {
  await p.goto(`file:///private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/deemin/blank.html`);
  const r = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'); g.drawImage(img, 0, 0, 256, 256);
    const d = g.getImageData(0, 0, 256, 256).data; let sx = 0, sy = 0, n = 0, x0 = 256, x1 = 0, y0 = 256, y1 = 0, maxR = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const a = d[(y * 256 + x) * 4 + 3] / 255; if (a > 0.5) { sx += x * a; sy += y * a; n += a; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); maxR = Math.max(maxR, Math.hypot(x + .5 - 128, y + .5 - 128)); } }
    return { cx: +(sx / n + .5).toFixed(1), cy: +(sy / n + .5).toFixed(1), bbox: [x0, y0, x1 + 1, y1 + 1], bboxC: [(x0 + x1 + 1) / 2, (y0 + y1 + 1) / 2], maxR: +maxR.toFixed(1), coverage: +(n / 65536).toFixed(3) };
  }, 'data:image/svg+xml;base64,' + fs.readFileSync(`${D}/${c}-charcoal-mark.svg`).toString('base64'));
  console.log(c, JSON.stringify(r));
}
await b.close();
