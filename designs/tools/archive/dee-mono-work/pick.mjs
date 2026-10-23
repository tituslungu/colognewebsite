import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const f = process.argv[2]; const pts = process.argv.slice(3).map(s => s.split(',').map(Number));
const url = 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const b = await chromium.launch(); const p = await b.newPage(); await p.setContent('<body></body>');
console.log(await p.evaluate(async ([url, pts]) => {
  const img = new Image(); img.src = url; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0); 
  return pts.map(([x, y]) => { const d = g.getImageData(x, y, 1, 1).data; return `${x},${y}: #` + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); }).join('\n');
}, [url, pts])); await b.close();
