import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///Users/titus/repos/colognewebsite/designs/index.html');
const out = [];
for (const [btn, ord] of [['sage', 'wa'], ['soft', 'im'], ['mixed', 'wa']]) {
  await p.click(`.btn-seg button[data-btn="${btn}"]`); await p.click(`.ord-seg button[data-ord="${ord}"]`);
  out.push(await p.evaluate(() => [document.querySelector('img[data-bslug]').getAttribute('src'), document.querySelector('a.open[data-bslug]').getAttribute('href')]));
}
console.log(JSON.stringify(out, null, 1), 'errors:', errs); await b.close();
