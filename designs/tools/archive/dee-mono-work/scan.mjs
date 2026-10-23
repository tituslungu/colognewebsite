// Print ink runs along given columns (x=) and rows (y=) of the C icon.
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const f = process.argv[2]; const lines = process.argv.slice(3);
const url = 'data:' + (f.endsWith('.png') ? 'image/png' : 'image/svg+xml') + ';base64,' + fs.readFileSync(f).toString('base64');
const b = await chromium.launch(); const p = await b.newPage(); await p.setContent('<body></body>');
const r = await p.evaluate(async ([url, isPng, lines]) => {
  const img = new Image(); img.src = url; await img.decode();
  const W = img.naturalWidth || 256, H = img.naturalHeight || 256; const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0, W, H); const d = g.getImageData(0, 0, W, H).data;
  const ink = (x, y) => { const i = (y * W + x) * 4; if (isPng) { return (d[i + 2] - d[i]) > 150; } return d[i + 3] > 127; };
  const out = [];
  for (const L of lines) {
    const [k, v] = L.split('='); const n = +v; const runs = []; let s = -1;
    const len = k === 'x' ? H : W;
    for (let t = 0; t <= len; t++) { const on = t < len && (k === 'x' ? ink(n, t) : ink(t, n)); if (on && s < 0) s = t; if (!on && s >= 0) { runs.push([s, t - 1]); s = -1; } }
    out.push(L + ': ' + runs.map(r => r.join('-')).join('  '));
  }
  return out.join('\n');
}, [url, f.endsWith('.png'), lines]);
console.log(r); await b.close();
