// Usage: node zoom.mjs <slug> <query> <w>x<h> <x,y,cw,ch> <out.png> [wait ms]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, query, vp, clip, out, wait = '1200'] = process.argv.slice(2);
const [w, h] = vp.split('x').map(Number);
const [x, y, cw, ch] = clip.split(',').map(Number);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
await p.waitForTimeout(Number(wait));
const info = await p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.left), Math.round(b.right)]; };
  return { wordmark: r('[data-check="wordmark"]'), anim: r('[data-check="anim"]'), hero: r('[data-check="hero"]'), prompt: r('[data-check="prompt"]') };
});
console.log(JSON.stringify(info));
await p.screenshot({ path: out, clip: { x, y, width: cw, height: ch } });
await b.close();
