import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent('<canvas id=c width=1400 height=1400></canvas>');
const r = await p.evaluate(() => {
  const c = document.getElementById('c'), x = c.getContext('2d');
  x.font = '700 1000px "Helvetica Neue"'; x.fillStyle = '#000';
  const ox = 200, base = 1100; x.fillText('D', ox, base);
  const d = x.getImageData(0, 0, 1400, 1400).data;
  const out = [];
  for (let h = 0; h <= 714; h += 6) {
    const Y = Math.round(base - h - 0.5); const runs = []; let s = -1;
    for (let X = 0; X < 1400; X++) { const v = d[(Y * 1400 + X) * 4 + 3] > 127; if (v && s < 0) s = X; if (!v && s >= 0) { runs.push([s - ox, X - ox]); s = -1; } }
    out.push([h, runs]);
  }
  return out;
});
import fs from 'fs';
fs.writeFileSync('d-profile.json', JSON.stringify(r));
console.log(r.filter((_, i) => i % 6 === 0).map(([h, rr]) => h + ': ' + rr.map(a => a.join('-')).join(' | ')).join('\n'));
await b.close();
