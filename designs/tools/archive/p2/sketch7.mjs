import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch7';
fs.mkdirSync(OUT, { recursive: true });
const cut = (x, y, a, g) => pt => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};
function tri(tip, A, B) {
  const line = (p, q, other) => {
    const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
    let h = half(p[0], p[1], a, 1);
    if (h.n[0] * other[0] + h.n[1] * other[1] < h.d) h = half(p[0], p[1], a, -1);
    return h;
  };
  return [line(tip, A, B), line(tip, B, A), line(A, B, tip)];
}
function box(x0, y0, x1, y1) {
  const mk = (px, py, nx, ny) => ({ kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true });
  return [mk(x0, 0, 1, 0), mk(x1, 0, -1, 0), mk(0, y0, 0, 1), mk(0, y1, 0, -1)];
}
const S = {};
const sqR = (r = 44, ri = 6) => (A, B) => (A.outer && B.outer) ? r : ri;
const tailL = (cx, cy, r) => tri([cx - 0.66 * r, cy + 1.12 * r], [cx - 0.90 * r, cy + 0.05 * r], [cx - 0.12 * r, cy + 0.70 * r]);
// round bubble, non-radial T: left cap by a slash chord, right side cut low by a shallow branch
S.rt1 = () => { const cx = 132, cy = 116, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(92, cy, -76, G), b = cut(150, 162, -20, G);
  return [{ cs: [C, a([0, 128])], fill: 'k' }, { cs: [...tailL(cx, cy, r), a([0, 128])], fill: 'k', tail: true },
    { cs: [C, a([256, 128]), b([256, 0])], fill: 'k' }, { cs: [C, a([256, 128]), b([256, 256])], fill: 's' }]; };
S.rt2 = () => { const cx = 132, cy = 116, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(112, cy, -74, G), b = cut(160, 84, -24, G);
  return [{ cs: [C, a([0, 128])], fill: 'k' }, { cs: [...tailL(cx, cy, r), a([0, 128])], fill: 'k', tail: true },
    { cs: [C, a([256, 128]), b([256, 0])], fill: 's' }, { cs: [C, a([256, 128]), b([256, 256])], fill: 'k' }]; };
// slices, refined: tail-left big piece, middle, sage right cap
S.sl1 = () => { const cx = 132, cy = 116, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(118, cy, -74, G), b = cut(176, cy, -62, G);
  return [{ cs: [C, a([0, 128])], fill: 'k' }, { cs: [...tailL(cx, cy, r), a([0, 128])], fill: 'k', tail: true },
    { cs: [C, a([256, 128]), b([0, 128])], fill: 'k' }, { cs: [C, b([256, 128])], fill: 's' }]; };
S.sl2 = () => { const cx = 132, cy = 116, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(110, cy, -78, G), b = cut(166, cy, -64, G);
  return [{ cs: [C, a([0, 128])], fill: 'k' }, { cs: [...tailL(cx, cy, r), a([0, 128])], fill: 'k', tail: true },
    { cs: [C, a([256, 128]), b([0, 128])], fill: 's' }, { cs: [C, b([256, 128])], fill: 'k' }]; };
// pill bubble (stadium) with tail, slanted segments
function stadium(x0, y0, x1, y1) {
  const h = (y1 - y0) / 2;
  const mk = (px, py, nx, ny) => ({ kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true });
  return [mk(0, y0, 0, 1), mk(0, y1, 0, -1)];
}
S.pill1 = () => { const G = 16, y0 = 72, y1 = 176, x0 = 28, x1 = 228, h = (y1 - y0) / 2;
  const Lc = disk(x0 + h, y0 + h, h), Rc = disk(x1 - h, y0 + h, h);
  // stadium = union of rect and two disks; build pieces as convex: left piece uses left disk + slab, etc.
  const slab = stadium(x0, y0, x1, y1);
  const a = cut(98, 124, -66, G), b = cut(162, 124, -80, G);
  const leftHalf = { kind: 'line', n: [1, 0], d: x0 + h };
  return [
    { cs: [Lc, a([0, 128])], fill: 'k' }, { cs: [...slab, leftHalf, a([0, 128])], fill: 'k' },
    { cs: [...slab, a([256, 128]), b([0, 128])], fill: 's' },
    { cs: [Rc, b([256, 128])], fill: 'k' }, { cs: [...slab, { kind: 'line', n: [-1, 0], d: -(x1 - h) }, b([256, 128])], fill: 'k' },
    { cs: [...tri([60, 214], [48, 150], [110, 168]), a([0, 128])], fill: 'k', tail: true },
  ]; };
function build(name) {
  return S[name]().map(p => {
    const isSq = p.cs.some(c => c.outer);
    const rf = p.tail ? () => 0 : isSq ? sqR(40, 6) : () => 5;
    return { d: piecePath(p.cs, rf), fill: p.fill, a: p.tail ? 0 : area(p.cs) };
  });
}
const col = { k: '#2D2D2D', s: '#6FAF8E' }, colDark = { k: '#FAFAF8', s: '#6FAF8E' };
const svg = (parts, pal, bg, scale = 1) => {
  const t = scale === 1 ? '' : ` transform="translate(${f(128 - 128 * scale)} ${f(128 - 128 * scale)}) scale(${scale})"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g${t}>${parts.map(p => `<path fill="${pal[p.fill]}" d="${p.d}"/>`).join('')}</g></svg>`;
};
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(S);
let cells = '';
for (const n of names) {
  const parts = build(n);
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(parts, col));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(parts, colDark, '#2D2D2D', 0.68));
  const areas = parts.filter(p => p.a).map(p => Math.round(p.a / 100)).join('/');
  cells += `<div class="c"><img src="${n}.svg" width="150"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n} ${areas}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 600 }, deviceScaleFactor: 1 });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
console.log('ok');
