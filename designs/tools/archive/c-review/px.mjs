// usage: node px.mjs <png> x,y x,y ...
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [file, ...pts] = process.argv.slice(2);
const b64 = fs.readFileSync(file).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
const res = await page.evaluate(async ({ b64, pts }) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  return pts.map(p => { const [x, y] = p.split(',').map(Number); const d = g.getImageData(x, y, 1, 1).data; return p + ' -> ' + '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); });
}, { b64, pts });
console.log(res.join('\n'));
await browser.close();
