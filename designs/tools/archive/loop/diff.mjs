// Pixel-compare frames. Usage: node diff.mjs [engine]
// Pairs are [labelA, svgA, tA, labelB, svgB, tB]; prints differing pixels (any channel > 2)
// and the max channel delta for each pair.
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const engine = process.argv[2] || 'chromium';

const ORIG = '/Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg';
const LOOP = '/Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg';
const D = 20;

const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: 530, height: 655 } });
const SRC = { orig: pathToFileURL(ORIG).href, loop: pathToFileURL(LOOP).href };
// A fresh page per frame: Chromium's raster cache makes pixels depend on seek
// history, so each frame is rendered from a clean page.
async function shot(which, t) {
  const pg = await ctx.newPage();
  await pg.goto(SRC[which]);
  await pg.evaluate(ms => new Promise(r => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }); requestAnimationFrame(() => requestAnimationFrame(r)); }), t * 1000);
  await pg.waitForTimeout(40);
  const src = 'data:image/png;base64,' + (await pg.screenshot()).toString('base64');
  await pg.close();
  return src;
}
const cmp = await ctx.newPage();
await cmp.setContent('<canvas id=a></canvas><canvas id=b></canvas>');
async function diff(a, b) {
  return cmp.evaluate(async ([a, b]) => {
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const get = (img, id) => { const c = document.getElementById(id); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height).data; };
    const da = get(ia, 'a'), db = get(ib, 'b');
    let n = 0, max = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
      if (d > 2) n++;
      if (d > max) max = d;
    }
    return { n, max };
  }, [a, b]);
}

const checks = [];
// 1. The seam: end of iteration 1 vs start of iteration 1 and start of iteration 2.
checks.push(['seam: loop@19.999 vs loop@0', 'loop', D - 0.001, 'loop', 0]);
checks.push(['seam: loop@19.999 vs loop@20.000', 'loop', D - 0.001, 'loop', D]);
checks.push(['seam: loop@20.000 vs loop@0', 'loop', D, 'loop', 0]);
checks.push(['seam: loop@20.001 vs loop@0.001', 'loop', D + 0.001, 'loop', 0.001]);
// 2. Iteration 2 == iteration 1 across the whole cycle (every 0.4s).
for (let t = 0; t < D; t += 0.4) checks.push([`iter2 vs iter1 @${t.toFixed(1)}`, 'loop', t + D, 'loop', t]);
// 3. Story unchanged: loop vs original for the original 17.4s (every 0.3s).
for (let t = 0; t < 17.4; t += 0.3) checks.push([`loop vs orig @${t.toFixed(1)}`, 'loop', t, 'orig', t]);
// 4. Hold: loop 17.4..19.0 equals the original's final frame.
for (const t of [17.4, 17.8, 18.2, 18.6, 18.99]) checks.push([`hold loop@${t} vs orig final`, 'loop', t, 'orig', 17.4]);

let bad = 0;
for (const [label, wa, ta, wb, tb] of checks) {
  const r = await diff(await shot(wa, ta), await shot(wb, tb));
  const ok = r.n === 0;
  if (!ok) bad++;
  console.log(`${ok ? 'OK  ' : 'DIFF'} ${label}  pixels>2: ${r.n}  maxDelta: ${r.max}`);
}
console.log(`${engine}: ${checks.length} checks, ${bad} with differences`);
await browser.close();
