import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const rm of ['no-preference', 'reduce']) {
  for (const vp of [{ width: 1440, height: 790 }, { width: 390, height: 664 }]) {
    const ctx = await b.newContext({ viewport: vp, reducedMotion: rm });
    const p = await ctx.newPage();
    const reqs = [];
    const fails = [];
    p.on('requestfinished', r => { if (/divi-(loop|still)\.svg/.test(r.url())) reqs.push(r.url().split('/designs/')[1]); });
    p.on('requestfailed', r => fails.push(r.url()));
    p.on('console', m => { if (m.type() === 'error') fails.push(m.text()); });
    await p.goto('file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=white&footer=charcoal&shot=1');
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => {
      const img = document.querySelector('[data-check="anim"]');
      return { currentSrc: img.currentSrc.split('/designs/')[1], complete: img.complete, nw: img.naturalWidth, nh: img.naturalHeight,
        replay: !!document.querySelector('[data-check="replay"], .replay, button'),
        mq: matchMedia('(prefers-reduced-motion: reduce)').matches };
    });
    console.log(rm, vp.width, JSON.stringify(info), 'requests:', reqs.join(','), fails.length ? 'FAILS: ' + fails.join(';') : '');
    await ctx.close();
  }
}
await b.close();
