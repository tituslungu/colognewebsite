import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/a-stack-tools/';
const b = await chromium.launch();
for (const tone of ['gray', 'white', 'sage']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone + '&shot=1');
  await p.waitForLoadState('load');
  const order = [];
  const shots = { icon: [0, 0, 300, 140], replay: [570, 520, 300, 90], whatsapp: [420, 600, 600, 120], imessage: [420, 600, 600, 120], email: [0, 730, 600, 60], tos: [1000, 730, 440, 60] };
  for (let i = 0; i < 7; i++) {
    await p.keyboard.press('Tab');
    const k = await p.evaluate(() => document.activeElement.getAttribute('data-check'));
    order.push(k);
    if (shots[k] && ['icon', 'replay', 'whatsapp', 'imessage', 'tos'].includes(k)) {
      const [x, y, w, h] = shots[k];
      await p.screenshot({ path: OUT + `f-${tone}-${k}.png`, clip: { x, y, width: w, height: h } });
    }
  }
  console.log(tone, order.join(' > '));
  await ctx.close();
}
await b.close();
