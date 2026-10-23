import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 530, height: 655 } });
await page.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
const out = process.argv[2];
let last = 0;
for (const t of [1, 3, 5, 7, 9, 11, 13, 15, 17.6]) {
  await page.waitForTimeout((t - last) * 1000); last = t;
  await page.screenshot({ path: `${out}/f-${t}.png` });
}
await browser.close();
