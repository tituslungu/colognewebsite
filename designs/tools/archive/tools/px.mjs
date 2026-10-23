import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [file, ...pts] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
const data = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
const out = await p.evaluate(async ({ data, pts }) => {
  const img = new Image(); img.src = data; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  return pts.map(s => { const [x, y] = s.split(',').map(Number); const d = g.getImageData(x, y, 1, 1).data;
    return `${s} -> #${[d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('')}`; });
}, { data, pts });
console.log(out.join('\n')); await b.close();
