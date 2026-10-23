import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/icon.png');
const pts = JSON.parse(process.argv[2]);
const r = await p.evaluate(async (pts) => {
  const img = document.querySelector('img'); await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  return pts.map(([x,y]) => { const d = g.getImageData(x, y, 1, 1).data; return [x,y,'#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('')]; });
}, pts);
console.log(r.map(a=>a.join(' ')).join('\n'));
await b.close();
