import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 530, height: 655 }, deviceScaleFactor: 1 });
for (const t of [5, 9, 13, 17]) {
  await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
  await p.waitForTimeout(200);
  await p.evaluate((t) => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; }), t);
  await p.waitForTimeout(150);
  await p.screenshot({ path: `anim-${t}.png` });
}
await b.close();
