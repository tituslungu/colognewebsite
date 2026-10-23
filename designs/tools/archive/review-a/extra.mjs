import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/review-a';
const sizes = [[1024,768,0],[2560,1300,0],[320,568,1],[601,800,1],[599,800,1],[801,700,0],[1180,820,1],[412,915,1]];
const tone = process.argv[2] || 'white';
const browser = await chromium.launch();
for (const [w,h,m] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: !!m && w < 700, hasTouch: !!m });
  const page = await ctx.newPage();
  await page.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone + '&shot=1');
  await page.waitForLoadState('load'); await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const g = s => document.querySelector(s).getBoundingClientRect();
    const se = document.scrollingElement;
    const rp = g('.replay'), an = g('.anim'), pr = g('.cta-prompt');
    return { sh: se.scrollHeight - innerHeight, sw: se.scrollWidth - innerWidth, hero: Math.round(g('.hero').height), anim: Math.round(an.height), replayRight: Math.round(rp.right), replayBottom: Math.round(rp.bottom), promptTop: Math.round(pr.top) };
  });
  console.log(w+'x'+h, JSON.stringify(r));
  await page.screenshot({ path: `${OUT}/extra_${tone}_${w}x${h}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
