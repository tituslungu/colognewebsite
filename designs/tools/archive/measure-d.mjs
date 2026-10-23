import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [vpArg='390x664'] = process.argv.slice(2);
const browser = await chromium.launch();
for (const vp of vpArg.split(',')) {
  const [w,h] = vp.split('x').map(Number);
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, isMobile: w<700, hasTouch: w<700, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('file:///Users/titus/repos/colognewebsite/designs/d-bleed/index.html?shot=1');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const q = s => { const e=document.querySelector(s); const r=e.getBoundingClientRect(); return `${s} top=${Math.round(r.top)} h=${Math.round(r.height)} w=${Math.round(r.width)}`; };
    return ['.hero','.wordmark','.mark','.panel','.demo-frame','#anim','.replay','.cta','.cta-prompt','.cta-group','.cta-hint','.footer'].map(q).join('\n') + `\nscrollH=${document.scrollingElement.scrollHeight} innerH=${innerHeight}`;
  });
  console.log('== '+vp+'\n'+r);
  await ctx.close();
}
await browser.close();
