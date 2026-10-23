import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const out = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/c-overlap/';
const b = await chromium.launch();
for (const [tone, w, h] of [['gray', 1440, 790], ['white', 390, 664], ['sage', 1440, 790]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/c-overlap/index.html?tone=' + tone + '&shot=1');
  await p.waitForTimeout(600);
  const names = [];
  for (let i = 0; i < 4; i++) {
    await p.keyboard.press('Tab');
    names.push(await p.evaluate(() => document.activeElement.dataset.check || document.activeElement.className));
    await p.screenshot({ path: out + `focus_${tone}_${i}.png` });
  }
  console.log(tone, names.join(' > '));
  await p.close();
}
await b.close();
