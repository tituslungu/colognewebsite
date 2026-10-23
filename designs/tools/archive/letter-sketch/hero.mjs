// node hero.mjs out-prefix icon1.svg icon2.svg ... -> hero crops of design C (desk) + D phone top
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [prefix, ...icons] = process.argv.slice(2);
const b = await chromium.launch();
for (const [i, ic] of icons.entries()) {
  for (const [slug, w, h, mob, clip] of [['c-overlap', 1440, 790, false, { x: 0, y: 0, width: 640, height: 250 }], ['d-bleed', 390, 664, true, { x: 0, y: 0, width: 390, height: 200 }]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage();
    await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?tone=white&footer=charcoal&shot=1`);
    await p.evaluate(async src => { const img = document.querySelector('[data-check="icon"]'); img.src = src; await img.decode().catch(() => {}); }, 'file://' + ic);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${prefix}-${i}-${slug}.png`, clip });
    await ctx.close();
  }
}
await b.close();
