import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch5';
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
// A: tile slanted T
S.tileT = () => {
  const B = box(40, 40, 216, 216), G = 16;
  const a = cut(112, 128, -74, G), b = cut(150, 150, -18, G);
  return [{ cs: [...B, a([0, 128])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 0])], fill: 'k' }, { cs: [...B, a([256, 128]), b([256, 256])], fill: 's' }];
};
// B: tile off-centre Y
S.tileY = () => {
  const B = box(40, 40, 216, 216), G = 16, J = [140, 150];
  const a = cut(J[0], J[1], -80, G), b = cut(J[0], J[1], -8, G), c = cut(J[0], J[1], 135, G);
  return [
    { cs: [...B, a([256, 0]), b([256, 0])], fill: 'k' },
    { cs: [...B, b([256, 256]), c([256, 256])], fill: 's' },
    { cs: [...B, c([0, 0]), a([0, 0])], fill: 'k' },
  ];
};
// D: portrait receipt, tilted cuts
S.receipt = () => {
  const B = box(64, 28, 192, 228), G = 16;
  const a = cut(128, 96, -9, G), b = cut(128, 160, 6, G);
  return [{ cs: [...B, a([128, 0])], fill: 'k' }, { cs: [...B, a([128, 256]), b([128, 0])], fill: 's' }, { cs: [...B, b([128, 256])], fill: 'k' }];
};
// E: squircle bubble with tail, slices
S.sqBubble = () => {
  const B = box(36, 36, 220, 200), G = 16;
  const a = cut(108, 118, -70, G), b = cut(166, 118, -82, G);
  const T = tri([62, 236], [44, 150], [120, 190]);
  return [{ cs: [...B, a([0, 128])], fill: 'k' }, { cs: [...B, a([256, 128]), b([0, 128])], fill: 's' }, { cs: [...B, b([256, 128])], fill: 'k' },
    { cs: [...T, a([0, 128])], fill: 'k', tail: true }];
};
// F: slanted table slab, unequal segments, with cuts at different angles
S.slab = () => {
  // rotate a frame: build slab as box in rotated coords via half-planes
  const ang = -22, G = 16, cx = 128, cy = 128, w = 220, h = 92;
  const rad = a => a * Math.PI / 180, u = [Math.cos(rad(ang)), Math.sin(rad(ang))], v = [-u[1], u[0]];
  const P = (s, t) => [cx + s * u[0] + t * v[0], cy + s * u[1] + t * v[1]];
  const mk = (p, n) => ({ kind: 'line', n, d: n[0] * p[0] + n[1] * p[1], outer: true });
  const Bx = [mk(P(-w / 2, 0), u), mk(P(w / 2, 0), [-u[0], -u[1]]), mk(P(0, -h / 2), v), mk(P(0, h / 2), [-v[0], -v[1]])];
  const c1 = P(-34, 0), c2 = P(42, 0);
  const a = cut(c1[0], c1[1], ang + 72, G), b = cut(c2[0], c2[1], ang + 104, G);
  const far = s => P(s, 0);
  return [{ cs: [...Bx, a(far(-200))], fill: 'k' }, { cs: [...Bx, a(far(200)), b(far(-200))], fill: 's' }, { cs: [...Bx, b(far(200))], fill: 'k' }];
};
// G: round plate (no tail), slices
S.plate = () => {
  const C = disk(128, 128, 100), G = 16;
  const a = cut(104, 128, -68, G), b = cut(166, 128, -80, G);
  return [{ cs: [C, a([0, 128])], fill: 'k' }, { cs: [C, a([256, 128]), b([0, 128])], fill: 's' }, { cs: [C, b([256, 128])], fill: 'k' }];
};
function build(name) {
  return S[name]().map(p => {
    const isSq = p.cs.some(c => c.outer);
    const rf = p.tail ? () => 0 : isSq ? (name === 'slab' ? sqR(30, 6) : name === 'receipt' ? sqR(26, 6) : sqR()) : () => 5;
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
