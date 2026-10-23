import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const vp of [[1440, 790, false], [390, 664, true]]) for (const v of ['', 'solid', 'soft', 'mixed']) for (const o of ['', 'imessage-first']) {
  const c = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, isMobile: vp[2], hasTouch: vp[2] });
  const p = await c.newPage();
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=white&footer=charcoal${v ? '&buttons=' + v : ''}${o ? '&order=' + o : ''}&shot=1`);
  const s = await p.evaluate(() => ['whatsapp', 'imessage'].map(k => { const r = document.querySelector(`[data-check="${k}"]`).getBoundingClientRect(); return `${k} ${r.width.toFixed(1)}x${r.height.toFixed(1)}@${r.left.toFixed(0)},${r.top.toFixed(0)}`; }).join('  '));
  console.log(`${vp[0]} ${(v || 'sage').padEnd(5)} ${(o || 'wa-first').padEnd(14)} ${s}`);
  await c.close();
}
await b.close();
