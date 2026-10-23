import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [,, slug, tone, ...sizes] = process.argv;
const browser = await chromium.launch();
for (const s of sizes) {
  const [w, h] = s.split('x').map(Number);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 1000 });
  const page = await ctx.newPage();
  await page.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?tone=${tone}&shot=1`);
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const R = el => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)].join(','); };
    const wm = q('[data-check=wordmark]');
    const rg = document.createRange(); rg.selectNodeContents(wm);
    const o = { scrollH: document.scrollingElement.scrollHeight, hero: R(q('[data-check=hero]')), icon: R(q('[data-check=icon]')), wordmarkText: (()=>{const b=rg.getBoundingClientRect();return [b.left,b.top,b.right,b.bottom].map(Math.round).join(',')})(), wmFont: getComputedStyle(wm).fontSize,
      anim: R(q('[data-check=anim]')), replay: R(q('[data-check=replay]')), prompt: R(q('[data-check=prompt]')), wa: R(q('[data-check=whatsapp]')), im: R(q('[data-check=imessage]')), hint: R(q('[data-check=hint]')), footer: R(q('[data-check=footer]')), email: R(q('[data-check=email]')), tos: R(q('[data-check=tos]')), copy: R(q('[data-check=copyright]')) };
    return o;
  });
  console.log(s, JSON.stringify(r));
  await ctx.close();
}
await browser.close();
