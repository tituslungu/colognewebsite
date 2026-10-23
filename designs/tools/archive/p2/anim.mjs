import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 420 } });
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
await p.waitForTimeout(500);
const shots = [];
for (const t of [2500, 6000, 9500, 13000]) {
  await p.waitForTimeout(t - (shots.length ? [2500, 6000, 9500, 13000][shots.length - 1] : 500));
  const path = `/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/anim-${t}.png`;
  await p.screenshot({ path });
  shots.push(path);
}
await b.close();
console.log(shots.join('\n'));
