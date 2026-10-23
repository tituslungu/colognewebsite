// Usage: node fadeprobe.mjs <slug> <query> <w>x<h> [dpr]
// Prints: fade geometry; row profile (mean luminance in strips) through the fade;
// edge-vs-inner luminance difference per row (halo check); rows below fade-end deviation from bg.
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, query, vp, dprArg = '1', mobile = ''] = process.argv.slice(2);
const [w, h] = vp.split('x').map(Number);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Number(dprArg), isMobile: !!mobile, hasTouch: !!mobile });
const p = await ctx.newPage();
await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
await p.waitForTimeout(1200);
const geo = await p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom, l: b.left, r: b.right }; };
  const cs = getComputedStyle(document.documentElement);
  const bd = document.querySelector('.backdrop');
  return { backdrop: r('.backdrop'), hero: r('.hero'), card: r('.card'), wordmark: r('.wordmark'), prompt: r('.prompt'), mark: r('.mark img'),
    bg: getComputedStyle(document.body).backgroundColor };
});
console.log(JSON.stringify(geo));
const buf = await p.screenshot();
const dpr = Number(dprArg);
const res = await p.evaluate(async ({ data, geo, dpr }) => {
  const img = new Image(); img.src = data; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const W = img.width, H = img.height;
  const d = g.getImageData(0, 0, W, H).data;
  const lum = (x, y) => { const i = (y * W + x) * 4; return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; };
  const px = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const card = geo.card; const cl = Math.floor((card.l - 40) * dpr), cr = Math.ceil((card.r + 40) * dpr);
  const free = x => x < cl || x > cr;
  const out = [];
  const end = Math.round(geo.backdrop.b * dpr);
  for (let y = Math.round(geo.hero.b * dpr * 0.5); y < Math.min(H, end + 30 * dpr); y += Math.max(1, Math.round(4 * dpr))) {
    // edge strips: 0..6 css px vs 12..40 css px from each side
    const strip = (a, z) => { let s = 0, n = 0; for (let x = Math.round(a * dpr); x < Math.round(z * dpr); x++) { if (!free(x)) continue; s += lum(x, y); n++; } return n ? s / n : NaN; };
    const L0 = strip(0, 4), L1 = strip(8, 30);
    const R0 = strip(geo.backdrop.r - 4, geo.backdrop.r), R1 = strip(geo.backdrop.r - 30, geo.backdrop.r - 8);
    let s = 0, n = 0; for (let x = 0; x < W; x += 2) { if (!free(x)) continue; s += lum(x, y); n++; }
    out.push(`${(y / dpr).toFixed(0).padStart(4)} mean=${(s / n).toFixed(1).padStart(6)}  Ledge-in=${(L0 - L1).toFixed(1).padStart(6)}  Redge-in=${(R0 - R1).toFixed(1).padStart(6)}`);
  }
  // below fade end: max deviation from bg across full width (excluding card zone)
  const bgm = geo.bg.match(/\d+/g).map(Number);
  let maxdev = 0, where = '';
  for (let y = end + 1; y < Math.min(H, end + 20 * dpr); y++) for (let x = 0; x < W; x++) { if (!free(x)) continue; const q = px(x, y); const dv = Math.max(...q.map((v, i) => Math.abs(v - bgm[i]))); if (dv > maxdev) { maxdev = dv; where = `${x / dpr},${y / dpr} ${q}`; } }
  // at fade end row exactly
  let maxdevEnd = 0; for (const yy of [end - 3 * dpr, end - 1, end]) { if (yy >= H) continue; for (let x = 0; x < W; x++) { if (!free(x)) continue; const q = px(x, yy); maxdevEnd = Math.max(maxdevEnd, ...q.map((v, i) => Math.abs(v - bgm[i]))); } }
  return { rows: out, maxdev, where, maxdevEnd };
}, { data: 'data:image/png;base64,' + buf.toString('base64'), geo, dpr });
console.log(res.rows.join('\n'));
console.log('below fade-end max deviation from bg:', res.maxdev, res.where, ' | last 3px:', res.maxdevEnd);
await b.close();
