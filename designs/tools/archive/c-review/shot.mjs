// usage: node shot.mjs <slug> <tone> <WxH> <out.png> [waitMs] [clip x,y,w,h] [scale] [js]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, tone, size, out, wait = '1200', clip, scale = '1', js] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Number(scale), isMobile: w < 700, hasTouch: w < 900 });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('JS error', e.message));
await page.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?tone=${tone}&shot=1`);
await page.waitForTimeout(Number(wait));
if (js) console.log(JSON.stringify(await page.evaluate(js), null, 1));
const opts = { path: out };
if (clip) { const [x, y, cw, ch] = clip.split(',').map(Number); opts.clip = { x, y, width: cw, height: ch }; }
await page.screenshot(opts);
await browser.close();
