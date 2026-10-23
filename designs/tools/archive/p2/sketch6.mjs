import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch6';
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
const Bx = () => box(44, 44, 212, 212);
// T: slash top->bottom, branch right
S.t1 = () => { const B = Bx(), G = 16; const a = cut(118, 128, -72, G), b = cut(160, 156, -14, G);
  return [{ cs: [...B, a([0, 128])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 0])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 256])], fill: 's' }]; };
// T: branch left, sage top-left
S.t2 = () => { const B = Bx(), G = 16; const a = cut(146, 128, -72, G), b = cut(100, 104, -12, G);
  return [{ cs: [...B, a([0, 128]), b([0, 0])], fill: 's' }, { cs: [...B, a([0, 128]), b([0, 256])], fill: 'k' }, { cs: [...B, a([256, 128])], fill: 'k' }]; };
// double T (4 shares): slash, branch right low, branch left high
S.t3 = () => { const B = Bx(), G = 16; const a = cut(130, 128, -72, G), b = cut(170, 160, -12, G), c = cut(90, 96, -18, G);
  return [{ cs: [...B, a([0, 128]), c([0, 0])], fill: 'k' }, { cs: [...B, a([0, 128]), c([0, 256])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 0])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 256])], fill: 's' }]; };
// double T same side
S.t4 = () => { const B = Bx(), G = 16; const a = cut(104, 128, -74, G), b = cut(160, 104, -10, G), c = cut(160, 168, -18, G);
  return [{ cs: [...B, a([0, 128])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 0])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 256]), c([256, 0])], fill: 's' }, { cs: [...B, a([256, 128]), c([256, 256])], fill: 'k' }]; };
// T with horizontal main (the bar) and slash branch below
S.t5 = () => { const B = Bx(), G = 16; const a = cut(128, 112, -8, G), b = cut(150, 170, -70, G);
  return [{ cs: [...B, a([128, 0])], fill: 'k' }, { cs: [...B, a([128, 256]), b([0, 256])], fill: 'k' }, { cs: [...B, a([128, 256]), b([256, 256])], fill: 's' }]; };
// T horizontal main, slash branch above
S.t6 = () => { const B = Bx(), G = 16; const a = cut(128, 150, -8, G), b = cut(112, 100, -70, G);
  return [{ cs: [...B, a([128, 0]), b([0, 0])], fill: 'k' }, { cs: [...B, a([128, 0]), b([256, 0])], fill: 's' }, { cs: [...B, a([128, 256])], fill: 'k' }]; };
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
