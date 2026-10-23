import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2600, height: 1100 } });
await p.goto('file://' + process.cwd() + '/overlay.html');
// align baselines: find the text's baseline offset, then move the span so its baseline sits at y=900
const base = await p.evaluate(() => {
  const s = document.getElementById('t');
  const c = document.createElement('canvas').getContext('2d');
  c.font = "700 1000px 'Helvetica Neue'";
  const m = c.measureText('D');
  // with line-height 1000px the baseline is at (1000 - (ascent+descent))/2 + fontBoundingBoxAscent
  const top = (1000 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  s.style.top = (900 - top) + 'px';
  return top;
});
await p.screenshot({ path: 'overlay.png' });
await b.close();
console.log('baseline offset', base);
