import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const sizes = process.argv.slice(2);
const KEYS = ['icon','wordmark','anim','replay','prompt','whatsapp','imessage','hint','copyright','email','tos','privacy'];
const browser = await chromium.launch();
for (const s of sizes) {
  const [w, h] = s.split('x').map(Number);
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 1000 && h < 600, hasTouch: true })).newPage();
  await page.goto('file:///Users/titus/repos/colognewebsite/designs/c-overlap/index.html?tone=gray&shot=1');
  await page.waitForTimeout(500);
  const r = await page.evaluate((KEYS) => {
    const box = k => { const b = document.querySelector(`[data-check="${k}"]`).getBoundingClientRect(); return { k, l: b.left, t: b.top + scrollY, r: b.right, b: b.bottom + scrollY }; };
    const bs = KEYS.map(box);
    const over = [];
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], c = bs[j];
      if ((a.k === 'anim' && c.k === 'replay') || (a.k === 'replay' && c.k === 'anim')) continue;
      const ix = Math.min(a.r, c.r) - Math.max(a.l, c.l), iy = Math.min(a.b, c.b) - Math.max(a.t, c.t);
      if (ix > 1 && iy > 1) over.push(a.k + '/' + c.k);
    }
    const hero = document.querySelector('.hero').getBoundingClientRect().height;
    return { scroll: document.documentElement.scrollHeight - innerHeight, hscroll: document.documentElement.scrollWidth - innerWidth, hero: Math.round(hero / innerHeight * 100), anim: Math.round(bs[2].b - bs[2].t), over };
  }, KEYS);
  console.log(s.padEnd(10), JSON.stringify(r));
}
await browser.close();
