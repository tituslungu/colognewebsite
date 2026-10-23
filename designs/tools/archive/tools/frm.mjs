import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const rm of ['reduce', 'no-preference']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 790 }, reducedMotion: rm });
  const p = await ctx.newPage();
  const errs = [];
  p.on('requestfailed', r => errs.push('failed ' + r.url()));
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=white&footer=charcoal&shot=1');
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const i = document.querySelector('[data-check=anim]'); return { src: i.currentSrc.split('/designs/')[1], ok: i.complete && i.naturalWidth > 0, replay: !!document.querySelector('[data-check=replay], .replay, script:not([src])') }; });
  console.log(rm, JSON.stringify(r), errs.join(' '));
  await ctx.close();
}
await b.close();
