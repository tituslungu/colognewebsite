// node geo.mjs <slug> <query> <WxH,...>  -> fade geometry vs content, overflow
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, query, list] = process.argv.slice(2);
const b = await chromium.launch();
for (const vp of list.split(',')) {
  const [w, h] = vp.split('x').map(Number);
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 800 && w !== 768, hasTouch: w < 900 });
  const p = await ctx.newPage();
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s)?.getBoundingClientRect();
    const cs = getComputedStyle(document.documentElement);
    const bd = q('.backdrop'), hero = q('.hero'), wm = q('.wordmark'), pr = q('.prompt'), card = q('.card'), ph = q('.photo-sharp > div');
    const se = document.scrollingElement;
    return { H: hero?.height.toFixed(0), wmBottom: wm?.bottom.toFixed(0), fadeEnd: bd?.bottom.toFixed(0), promptTop: pr?.top.toFixed(0), cardTop: card?.top.toFixed(0),
      photo: 0 && ph ? `${ph.left.toFixed(0)}..${ph.right.toFixed(0)} x ${ph.top.toFixed(0)}..${ph.bottom.toFixed(0)}` : null,
      sx: se.scrollWidth - innerWidth, sy: se.scrollHeight - innerHeight };
  });
  console.log(vp.padEnd(10), JSON.stringify(r));
  await ctx.close();
}
await b.close();
