// usage: node focus.mjs <tone> <w> <h> <mobile>
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [tone, w, h, mobile] = process.argv.slice(2);
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/review-a';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: mobile==='1', hasTouch: mobile==='1' });
const page = await ctx.newPage();
await page.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone + '&shot=1');
await page.waitForLoadState('load');
const names = [];
for (let i = 0; i < 7; i++) {
  await page.keyboard.press('Tab');
  const info = await page.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); return { t: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 24), x: r.left, y: r.top, w: r.width, h: r.height }; });
  names.push(info.t);
  const pad = 14;
  const clip = { x: Math.max(0, info.x - pad), y: Math.max(0, info.y - pad), width: Math.min(+w - Math.max(0, info.x - pad), info.w + pad * 2), height: info.h + pad * 2 };
  await page.screenshot({ path: `${OUT}/focus_${tone}_${w}_${i}.png`, clip });
}
console.log(names.join(' | '));
// replay click
const before = await page.$eval('#anim', e => e.src);
await page.click('#replay');
await page.waitForTimeout(300);
const after = await page.$eval('#anim', e => e.src);
console.log('replay src changed:', before !== after, after.slice(-30));
await browser.close();
