import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [file, ...pts] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 600, height: 600 } });
await p.setContent('<canvas id=c></canvas>');
const fs = await import('fs');
const data = fs.readFileSync(file).toString('base64');
const res = await p.evaluate(async ({ data, pts }) => {
  const im = new Image(); im.src = 'data:image/png;base64,' + data; await im.decode();
  const c = document.getElementById('c'); c.width = im.width; c.height = im.height;
  const x = c.getContext('2d'); x.drawImage(im, 0, 0);
  return pts.map(s => { const [px, py] = s.split(',').map(Number); const d = x.getImageData(px, py, 1, 1).data; return s + ' -> ' + [d[0], d[1], d[2]].join(','); });
}, { data, pts });
console.log(res.join('\n'));
await b.close();
