// node diffimg2.mjs engine fileA tA fileB tB out.png  -> side-by-side A | B | diff(red), cropped to bbox of diff (+pad), 2x zoom
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const [engine, fa, ta, fb, tb, out] = process.argv.slice(2);
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: 530, height: 655 } });
async function shot(f, t) {
  const pg = await ctx.newPage(); await pg.goto(pathToFileURL(f).href);
  const st = await pg.evaluate(ms => new Promise(r => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }); requestAnimationFrame(() => requestAnimationFrame(() => r(['ph','pg0','pg4','scanln','flash','shut'].map(c => { const e = document.querySelector('.' + c); const s = getComputedStyle(e); return c + ':' + s.opacity + '/' + s.transform; }).join(' ')))); }), t * 1000);
  await pg.waitForTimeout(40);
  const b = (await pg.screenshot()).toString('base64'); await pg.close();
  console.log(f.split('/').pop(), t, st);
  return 'data:image/png;base64,' + b;
}
const A = await shot(fa, +ta), B = await shot(fb, +tb);
const pg = await ctx.newPage();
await pg.setViewportSize({ width: 1700, height: 700 });
await pg.setContent('<body style="margin:0;background:#888"><canvas id=c></canvas></body>');
const box = await pg.evaluate(async ([a, b]) => {
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
  const [ia, ib] = await Promise.all([load(a), load(b)]);
  const W = ia.width, H = ia.height;
  const t = document.createElement('canvas'); t.width = W; t.height = H; const x = t.getContext('2d');
  x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, W, H).data;
  x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, W, H).data;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  const o = x.createImageData(W, H);
  for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i]-db[i]), Math.abs(da[i+1]-db[i+1]), Math.abs(da[i+2]-db[i+2])); const p = i / 4, px = p % W, py = (p / W) | 0;
    if (d > 2) { x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py); o.data[i] = 255; o.data[i+1] = 0; o.data[i+2] = 0; } else { o.data[i] = o.data[i+1] = o.data[i+2] = da[i] * .3; } o.data[i+3] = 255; }
  const pad = 30; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, z = Math.min(3, 540 / cw, 640 / ch);
  const c = document.getElementById('c'); c.width = Math.round(cw * z) * 3 + 20; c.height = Math.round(ch * z); const cx = c.getContext('2d'); cx.imageSmoothingEnabled = false;
  const d = document.createElement('canvas'); d.width = W; d.height = H; d.getContext('2d').putImageData(o, 0, 0);
  [ia, ib, d].forEach((im, k) => cx.drawImage(im, x0, y0, cw, ch, k * (Math.round(cw * z) + 10), 0, Math.round(cw * z), Math.round(ch * z)));
  return [x0, y0, x1, y1, c.width, c.height];
}, [A, B]);
console.log('bbox', box);
await pg.screenshot({ path: out, clip: { x: 0, y: 0, width: box[4], height: box[5] } });
await browser.close();
