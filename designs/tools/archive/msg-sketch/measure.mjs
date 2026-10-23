import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent('<canvas id=c width=1400 height=1400></canvas>');
const r = await p.evaluate(() => {
  const c = document.getElementById('c'), x = c.getContext('2d');
  const font = '700 1000px "Helvetica Neue"';
  x.font = font;
  const out = { font, check: document.fonts.check(font) };
  for (const ch of ['D', 'I', 'V']) {
    x.clearRect(0, 0, 1400, 1400); x.fillStyle = '#000'; x.font = font;
    const m = x.measureText(ch);
    const ox = 200, base = 1100;
    x.fillText(ch, ox, base);
    const d = x.getImageData(0, 0, 1400, 1400).data;
    const on = (X, Y) => d[(Y * 1400 + X) * 4 + 3] > 127;
    // runs along rows at given heights above baseline (fractions of cap height)
    const cap = Math.round(m.actualBoundingBoxAscent);
    const rows = {};
    for (const f of [0.02, 0.1, 0.25, 0.5, 0.75, 0.9, 0.98]) {
      const Y = Math.round(base - f * cap); const runs = []; let s = -1;
      for (let X = 0; X < 1400; X++) { const v = on(X, Y); if (v && s < 0) s = X; if (!v && s >= 0) { runs.push([s - ox, X - ox]); s = -1; } }
      rows[f] = runs;
    }
    // column runs at the middle of the bowl for D (horizontal thickness of top/bottom bars)
    const cols = {};
    for (const fx of [0.3, 0.5, 0.7]) {
      const X = Math.round(ox - m.actualBoundingBoxLeft + fx * (m.actualBoundingBoxRight + m.actualBoundingBoxLeft)); const runs = []; let s = -1;
      for (let Y = 0; Y < 1400; Y++) { const v = on(X, Y); if (v && s < 0) s = Y; if (!v && s >= 0) { runs.push([base - s, base - Y]); s = -1; } }
      cols[fx] = runs;
    }
    out[ch] = { adv: m.width, left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, asc: m.actualBoundingBoxAscent, desc: m.actualBoundingBoxDescent, rows, cols };
  }
  return out;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
