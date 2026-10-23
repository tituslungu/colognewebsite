import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const [w, h] of [[568, 320], [540, 300], [844, 340], [740, 360]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('file:///Users/titus/repos/colognewebsite/index.html'); await p.waitForTimeout(600);
  console.log(w + 'x' + h, 'home overY', await p.evaluate(() => document.scrollingElement.scrollHeight - innerHeight));
  await ctx.close();
}
await b.close();
