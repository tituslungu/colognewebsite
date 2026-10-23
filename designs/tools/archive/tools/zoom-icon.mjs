import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 760, height: 760 } });
await p.setContent(`<body style="margin:0;background:#888"><img src="file:///Users/titus/repos/colognewebsite/assets/img/icon.png" style="width:740px;height:723px;image-rendering:auto;margin:10px"></body>`);
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/icon.png');
await p.setViewportSize({ width: 256, height: 250 });
const px = await p.evaluate(async () => {
  const img = document.querySelector('img'); await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('') + (d[3] < 255 ? ' a' + d[3] : ''); };
  return { size: [img.naturalWidth, img.naturalHeight], corners: [at(2, 2), at(253, 2), at(2, 247), at(253, 247)], center: at(128, 125),
    stroke: [at(40, 125), at(60, 125), at(80, 125), at(200, 60), at(215, 70), at(200, 190), at(120, 30), at(120, 220)] };
});
console.log(JSON.stringify(px));
await b.close();
