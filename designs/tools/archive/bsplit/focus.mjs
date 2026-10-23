import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const out = [];
for (const [tone, w, h, tabs, name] of [['white', 1366, 657, 2, 'wa'], ['gray', 1366, 657, 1, 'replay'], ['sage', 390, 664, 3, 'im']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/b-split/index.html?tone=' + tone + '&shot=1');
  await p.waitForTimeout(500);
  for (let i = 0; i < tabs + 1; i++) await p.keyboard.press('Tab');
  const f = await p.evaluate(() => document.activeElement.getAttribute('data-check') || document.activeElement.className);
  await p.screenshot({ path: `focus-${tone}-${name}.png` });
  out.push(tone + ' focused: ' + f);
  if (name === 'replay') {
    const before = await p.$eval('#anim', i => i.src);
    await p.click('#replay');
    await p.waitForTimeout(400);
    const after = await p.$eval('#anim', i => ({ src: i.src, ok: i.complete && i.naturalWidth > 0 }));
    out.push('replay: ' + before.split('/').pop() + ' -> ' + after.src.split('/').pop() + ' loaded=' + after.ok);
  }
  await p.close();
}
console.log(out.join('\n'));
await b.close();
