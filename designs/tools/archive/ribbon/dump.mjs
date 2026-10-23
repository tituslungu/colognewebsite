import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const fs=require('fs');
const src=process.argv[2], out=process.argv[3];
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://'+src);
const data = await p.evaluate(async () => {
  const img = document.querySelector('img'); await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const d = g.getImageData(0,0,c.width,c.height).data;
  return {w:c.width,h:c.height,r:Array.from(d.filter((_,i)=>i%4==0))};
});
fs.writeFileSync(out, JSON.stringify(data));
await b.close();
