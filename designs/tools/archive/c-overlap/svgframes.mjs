import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const out = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/c-overlap/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 530, height: 655 } });
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
for (const t of [1, 6, 10, 13, 17.4]) {
  await p.evaluate(t => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; } }, t);
  await p.screenshot({ path: out + `svg_${t}.png` });
}
await b.close();
