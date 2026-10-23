import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 600, height: 740 } });
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
for (const t of [2, 6, 10, 14, 17.4]) {
  await p.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; }), t);
  await p.screenshot({ path: `${process.argv[2]}/svg-t${t}.png` });
}
await b.close();
console.log('ok');
