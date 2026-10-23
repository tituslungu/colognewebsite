// Worst-case contrast of the prompt colour against the background behind it.
// Usage: node prompt-contrast.mjs <slug> <query> <vp,vp,...>
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, query, vps] = process.argv.slice(2);
const b = await chromium.launch();
for (const vp of vps.split(',')) {
  const [w, h] = vp.split('x').map(Number);
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
  await p.waitForTimeout(800);
  const info = await p.evaluate(() => {
    const el = document.querySelector('[data-check="prompt"]');
    const cs = getComputedStyle(el);
    const fg = cs.color; const fs = cs.fontSize; const fw = cs.fontWeight;
    const r = el.getBoundingClientRect();
    // tighten to the text run
    const range = document.createRange(); range.selectNodeContents(el);
    const t = range.getBoundingClientRect();
    return { fg, fs, fw, x: t.left, y: t.top, w: t.width, h: t.height };
  });
  const clip = { x: info.x, y: info.y, width: info.w, height: info.h };
  const withText = await p.screenshot({ clip });
  await p.evaluate(() => { document.querySelector('[data-check="prompt"]').style.color = 'transparent'; });
  const buf = await p.screenshot({ clip });
  const res = await p.evaluate(async ({ data, data2, fg }) => {
    const load = async src => { const img = new Image(); img.src = src; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
    const d = await load(data), t = await load(data2);
    const near = [];
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const L = (r, gg, bb) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(bb);
    const m = fg.match(/\d+/g).map(Number); const Lf = L(m[0], m[1], m[2]);
    let worst = 99, wc = '';
    // only background pixels within 3px of a glyph pixel (text pixel differs from bg)
    const W = Math.round(Math.sqrt(d.length / 4 * 0)) ; 
    for (let i = 0; i < d.length; i += 4) {
      const diff = Math.abs(d[i] - t[i]) + Math.abs(d[i + 1] - t[i + 1]) + Math.abs(d[i + 2] - t[i + 2]);
      if (diff < 60) continue;
      const Lb = L(d[i], d[i + 1], d[i + 2]);
      const cr = (Math.max(Lf, Lb) + 0.05) / (Math.min(Lf, Lb) + 0.05);
      if (cr < worst) { worst = cr; wc = [d[i], d[i + 1], d[i + 2]].map(v => v.toString(16).padStart(2, '0')).join(''); }
    }
    return { worst: worst.toFixed(2), bg: '#' + wc };
  }, { data: 'data:image/png;base64,' + buf.toString('base64'), data2: 'data:image/png;base64,' + withText.toString('base64'), fg: info.fg });
  console.log(`${vp} prompt ${info.fg} ${info.fs} w${info.fw}: worst ${res.worst}:1 on ${res.bg}`);
  await p.close();
}
await b.close();
