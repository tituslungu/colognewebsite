// node zoom.mjs out.png "label|file.svg|px|bg|round" ...  renders each at true 1x pixels, then magnifies x8 (pixelated)
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...items] = process.argv.slice(2);
const b = await chromium.launch();
const p1 = await b.newPage({ deviceScaleFactor: 1, viewport: { width: 400, height: 200 } });
const shots = [];
for (const it of items) {
  const [label, file, px, bg, round] = it.split('|');
  const pad = 4, s = +px;
  fs.writeFileSync('/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-letter/_z.html', `<html><body style="margin:0;background:${bg}"><div id=a style="padding:${pad}px;display:inline-block;background:${bg}"><img src="file://${file}" width="${s}" height="${s}" style="display:block;${round==='1'?'border-radius:50%':''}"></div></body></html>`);
  await p1.goto('file:///private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-letter/_z.html'); await p1.waitForLoadState('load'); await p1.waitForTimeout(50);
  const buf = await p1.locator('#a').screenshot();
  shots.push({ label, data: 'data:image/png;base64,' + buf.toString('base64'), w: s + 2*pad });
}
const p2 = await b.newPage({ deviceScaleFactor: 1, viewport: { width: 1400, height: 400 } });
await p2.setContent(`<html><body style="margin:0;background:#ccc;font:600 12px Helvetica;display:flex;flex-wrap:wrap;gap:14px;padding:14px">${shots.map(s => `<div style="display:grid;gap:4px;justify-items:center"><img src="${s.data}" style="image-rendering:pixelated;width:${s.w*6}px">${s.label}</div>`).join('')}</body></html>`);
await p2.waitForTimeout(200);
await p2.screenshot({ path: out, fullPage: true }); await b.close();
