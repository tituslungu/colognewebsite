import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/verify';
const b = await chromium.launch();
for (const [tag, url] of [['F', 'file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=white&footer=charcoal&shot=1'], ['P', 'file:///Users/titus/repos/colognewebsite/index.html']]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 4, reducedMotion: 'reduce' });
  await p.goto(url); await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/icon-${tag}.png`, clip: { x: 120, y: 18, width: 64, height: 64 } });
  // phone short labels
  await p.setViewportSize({ width: 390, height: 664 }); await p.waitForTimeout(300);
  console.log(tag, await p.evaluate(() => [...document.querySelectorAll('.btn .long')].map(e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return `${c.position} ${r.width}x${r.height} clip=${c.clip}`; })));
  await p.setViewportSize({ width: 1440, height: 790 }); await p.waitForTimeout(300);
  console.log(tag, await p.evaluate(() => [...document.querySelectorAll('.btn .long')].map(e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return `${c.position} ${Math.round(r.width)}x${Math.round(r.height)}`; })));
  await p.close();
}
await b.close();
