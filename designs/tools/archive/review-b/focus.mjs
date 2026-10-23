import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [,, tone, w, h, out] = process.argv;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`file:///Users/titus/repos/colognewebsite/designs/b-split/index.html?tone=${tone}&shot=1`);
await page.waitForTimeout(300);
const order = [];
for (let i = 0; i < 7; i++) {
  await page.keyboard.press('Tab');
  order.push(await page.evaluate(() => { const a = document.activeElement; return (a.dataset.check || a.className || a.tagName) + ''; }));
  await page.screenshot({ path: `${out}-tab${i+1}.png` });
}
console.log(order.join(' -> '));
await browser.close();
