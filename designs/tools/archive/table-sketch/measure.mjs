import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent('<canvas id=c width=1400 height=1400></canvas>');
const r = await p.evaluate(() => {
  const cv = document.getElementById('c'), x = cv.getContext('2d');
  const F = 'bold 1000px "Helvetica Neue"';
  const out = {};
  for (const ch of ['D', 'I', 'V', 'DIVI']) {
    x.font = F; const m = x.measureText(ch);
    out[ch] = { adv: m.width, l: m.actualBoundingBoxLeft, r: m.actualBoundingBoxRight, asc: m.actualBoundingBoxAscent, desc: m.actualBoundingBoxDescent };
  }
  // pixel scans
  const scan = (ch, rowFrac, colFrac) => {
    x.clearRect(0, 0, 1400, 1400); x.font = F; x.fillStyle = '#000'; x.fillText(ch, 100, 1100);
    const d = x.getImageData(0, 0, 1400, 1400).data;
    const at = (i, j) => d[(j * 1400 + i) * 4 + 3] > 127;
    const asc = out[ch].asc; const top = 1100 - asc;
    const runsRow = []; { const j = Math.round(top + asc * rowFrac); let s = null; for (let i = 0; i < 1400; i++) { const v = at(i, j); if (v && s === null) s = i; if (!v && s !== null) { runsRow.push([s - 100, i - 100]); s = null; } } }
    const runsCol = []; if (colFrac !== undefined) { const i = Math.round(100 + out[ch].r * colFrac); let s = null; for (let j = 0; j < 1400; j++) { const v = at(i, j); if (v && s === null) s = j; if (!v && s !== null) { runsCol.push([s - top, j - top]); s = null; } } }
    return { runsRow, runsCol };
  };
  out.scanD_mid = scan('D', 0.5, 0.45);
  out.scanD_top = scan('D', 0.08);
  out.scanI = scan('I', 0.5);
  out.scanV_top = scan('V', 0.02);
  out.scanV_mid = scan('V', 0.5);
  out.scanV_bot = scan('V', 0.98);
  return out;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
