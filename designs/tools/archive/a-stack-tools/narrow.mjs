import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/a-stack-tools/';
const b = await chromium.launch();
for (const [w, h] of [[320, 568], [560, 800], [561, 800], [800, 900], [801, 700], [1024, 640]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: w < 800, hasTouch: w < 800 });
  const p = await ctx.newPage();
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=white&shot=1');
  await p.waitForLoadState('load');
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const r = s => { const e = document.querySelector(s).getBoundingClientRect(); return [Math.round(e.left), Math.round(e.right), Math.round(e.width), Math.round(e.height)]; };
    const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 0.5 || r.left < -0.5; }).map(e => e.tagName + '.' + e.className);
    return { sw: document.scrollingElement.scrollWidth, sh: document.scrollingElement.scrollHeight, ih: innerHeight, wa: r('[data-check=whatsapp]'), im: r('[data-check=imessage]'), anim: r('[data-check=anim]'), over: over.slice(0, 5) };
  });
  console.log(w + 'x' + h, JSON.stringify(m));
  await p.screenshot({ path: OUT + `n-${w}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
