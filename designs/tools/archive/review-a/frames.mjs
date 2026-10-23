// usage: node frames.mjs <tone> <w> <h> <mobile 0|1> <times-ms comma> [extra query]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [tone, w, h, mobile, times, extra=''] = process.argv.slice(2);
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/review-a';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: mobile==='1'?2:1, isMobile: mobile==='1' && +w < 700, hasTouch: mobile==='1' });
const page = await ctx.newPage();
page.on('console', m => console.log('console', m.type(), m.text()));
await page.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone + '&shot=1' + extra);
await page.waitForLoadState('load');
const t0 = Date.now();
for (const t of times.split(',').map(Number)) {
  const wait = t - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  const p = `${OUT}/${tone}_${w}x${h}_t${t}.png`;
  await page.screenshot({ path: p, fullPage: true });
  console.log(p);
}
await browser.close();
