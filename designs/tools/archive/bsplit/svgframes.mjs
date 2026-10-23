import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 530, height: 655 } });
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
for (const t of [1, 5, 9, 13, 17.5]) {
  await p.evaluate(t => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; }); }, t);
  await p.screenshot({ path: `f${t}.png` });
}
await b.close();
