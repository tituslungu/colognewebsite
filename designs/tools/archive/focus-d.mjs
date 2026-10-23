import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/crops';
const browser = await chromium.launch();
for (const tone of ['gray','white','sage']) {
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`file:///Users/titus/repos/colognewebsite/designs/d-bleed/index.html?tone=${tone}&shot=1`);
  await page.waitForTimeout(400);
  const names = [];
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    const box = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, k: document.activeElement.dataset.check || document.activeElement.className }; });
    const pad = 12;
    const file = `${OUT}/focus-${tone}-${i}.png`;
    await page.screenshot({ path: file, clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.w + pad * 2, height: box.h + pad * 2 } });
    names.push(box.k);
  }
  console.log(tone, names.join(' > '));
  await ctx.close();
}
await browser.close();
