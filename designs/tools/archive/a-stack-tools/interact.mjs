import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/a-stack-tools/';
const b = await chromium.launch();
for (const tone of ['gray', 'white', 'sage']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone);
  await p.waitForLoadState('load');
  const before = await p.$eval('#anim', i => i.src);
  await p.click('#replay');
  await p.waitForTimeout(300);
  const after = await p.$eval('#anim', i => ({ src: i.src, complete: i.complete, w: i.naturalWidth }));
  // a11y names
  const names = await p.evaluate(() => [...document.querySelectorAll('a,button')].map(e => (e.getAttribute('aria-label') || e.textContent).replace(/\s+/g, ' ').trim()));
  // tab through to the WhatsApp button and screenshot focus
  await p.keyboard.press('Tab'); // preview bar links come last (appended), so first tab is the icon
  const f1 = await p.evaluate(() => document.activeElement.getAttribute('data-check') || document.activeElement.outerHTML.slice(0, 60));
  await p.keyboard.press('Tab');
  await p.keyboard.press('Tab');
  const f3 = await p.evaluate(() => document.activeElement.getAttribute('data-check'));
  await p.screenshot({ path: OUT + 'focus-' + tone + '.png', clip: { x: 420, y: 600, width: 600, height: 120 } });
  await p.keyboard.press('Tab');
  await p.keyboard.press('Tab');
  await p.keyboard.press('Tab');
  const f6 = await p.evaluate(() => document.activeElement.getAttribute('data-check'));
  await p.screenshot({ path: OUT + 'focus2-' + tone + '.png', clip: { x: 0, y: 730, width: 600, height: 60 } });
  console.log(tone, { before: before.split('/').pop(), after: after.src.split('/').pop(), complete: after.complete, w: after.w, f1, f3, f6, errs });
  if (tone === 'gray') console.log(names);
  await ctx.close();
}
await b.close();
