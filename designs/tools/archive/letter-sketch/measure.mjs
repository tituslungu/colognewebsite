import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage();
await p.setContent('<canvas id=c width=4000 height=1400></canvas>');
const r = await p.evaluate(() => {
  const c = document.getElementById('c'), x = c.getContext('2d');
  x.font = '700 1000px "Helvetica Neue"';
  const out = {};
  for (const ch of ['D','I','V','DIVI']) { const m = x.measureText(ch); out[ch] = {adv: m.width, l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, asc: m.actualBoundingBoxAscent, desc: m.actualBoundingBoxDescent}; }
  // stem thickness of I and D, D counter: rasterize
  x.fillStyle='#000'; x.fillText('D', 100, 1200);
  const row = y => { const d = x.getImageData(0, y, 1400, 1).data; let runs=[], on=false, s=0; for (let i=0;i<1400;i++){ const a=d[i*4+3]>127; if(a&&!on){on=true;s=i} if(!a&&on){on=false;runs.push([s,i])} } return runs; };
  const col = (xx) => { const d = x.getImageData(xx, 0, 1, 1400).data; let runs=[], on=false, s=0; for (let i=0;i<1400;i++){ const a=d[i*4+3]>127; if(a&&!on){on=true;s=i} if(!a&&on){on=false;runs.push([s,i])} } return runs; };
  out.Drow = row(1200-360); out.Dcol = col(400);
  x.clearRect(0,0,4000,1400); x.fillText('V', 100, 1200); out.Vrow_top = row(1200-700); out.Vrow_mid = row(1200-360); out.Vrow_bot = row(1199);
  x.clearRect(0,0,4000,1400); x.font = '700 1000px "Helvetica Neue"'; x.fillText('I', 100, 1200); out.Irow = row(1200-360);
  return out;
});
console.log(JSON.stringify(r, null, 1)); await b.close();
