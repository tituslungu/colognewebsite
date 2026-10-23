// usage: node measure.mjs <tone> <w> <h> <mobile 0|1> [clip x,y,w,h] [name]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [tone, w, h, mobile, clip, name] = process.argv.slice(2);
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/review-a';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: mobile==='1' && +w < 700, hasTouch: mobile==='1' });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('ERR', e.message));
await page.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone + '&shot=1');
await page.waitForLoadState('load');
await page.waitForTimeout(800);
const r = await page.evaluate(() => {
  const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left*10)/10, Math.round(r.top*10)/10, Math.round(r.width*10)/10, Math.round(r.height*10)/10]; };
  const out = {};
  for (const s of ['.hero','.mark img','.wordmark','.stage','.anim-box','.anim','.replay','.cta','.cta-prompt','.cta-group','.btn-whatsapp','.btn-imessage','.cta-hint','.footer','.footer-legal','.footer-links','[data-check=email]','[data-check=tos]']) out[s] = q(s);
  out.fs = getComputedStyle(document.querySelector('.wordmark')).fontSize;
  out.scrollH = document.scrollingElement.scrollHeight;
  return out;
});
for (const [k,v] of Object.entries(r)) console.log(k.padEnd(22), JSON.stringify(v));
if (clip) {
  const [x,y,cw,ch] = clip.split(',').map(Number);
  const p = `${OUT}/crop_${name||tone}.png`;
  await page.screenshot({ path: p, clip: {x,y,width:cw,height:ch} });
  console.log(p);
}
await browser.close();
