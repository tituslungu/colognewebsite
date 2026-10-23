import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch4';
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
function rectiPath(verts, { x0, y0, cell, gap, rOuter, rIn, N }) {
  const isOuter = (a, b) => (a[0] === b[0] && (a[0] === 0 || a[0] === N)) || (a[1] === b[1] && (a[1] === 0 || a[1] === N));
  const P = verts.map(([i, j]) => [x0 + i * cell, y0 + j * cell]);
  const n = P.length;
  const edges = P.map((p, k) => {
    const q = P[(k + 1) % n];
    const dx = Math.sign(q[0] - p[0]), dy = Math.sign(q[1] - p[1]);
    const outer = isOuter(verts[k], verts[(k + 1) % n]);
    return { p, dx, dy, nx: -dy, ny: dx, off: outer ? 0 : gap / 2, outer };
  });
  let d = '';
  P.forEach((p, k) => {
    const a = edges[(k - 1 + n) % n], b = edges[k];
    const h = a.dy === 0 ? a : b, v = a.dy === 0 ? b : a;
    const x = v.p[0] + v.nx * v.off, y = h.p[1] + h.ny * h.off;
    const convex = a.dx * b.dy - a.dy * b.dx > 0;
    const r = a.outer && b.outer ? rOuter : rIn;
    d += (k === 0 ? 'M' : 'L') + f(x - a.dx * r) + ' ' + f(y - a.dy * r) + `A${r} ${r} 0 0 ${convex ? 1 : 0} ${f(x + b.dx * r)} ${f(y + b.dy * r)}`;
  });
  return d + 'Z';
}
const S = {};
const g3 = { x0: 40, y0: 40, cell: 176 / 3, gap: 16, rOuter: 40, rIn: 6, N: 3 };
S.polyP = () => [
  { raw: rectiPath([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [0, 2]], g3), fill: 'k' },
  { raw: rectiPath([[2, 1], [3, 1], [3, 3], [1, 3], [1, 2], [2, 2]], g3), fill: 's' },
  { raw: rectiPath([[0, 2], [1, 2], [1, 3], [0, 3]], g3), fill: 'k' },
];
S.polyP2 = () => [
  { raw: rectiPath([[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [0, 2]], g3), fill: 'k' },
  { raw: rectiPath([[2, 1], [3, 1], [3, 3], [1, 3], [1, 2], [2, 2]], g3), fill: 'k' },
  { raw: rectiPath([[0, 2], [1, 2], [1, 3], [0, 3]], g3), fill: 's' },
];
const g4 = { x0: 40, y0: 40, cell: 44, gap: 14, rOuter: 40, rIn: 5, N: 4 };
S.poly4b = () => [
  { raw: rectiPath([[0, 0], [4, 0], [4, 1], [3, 1], [3, 2], [1, 2], [1, 3], [0, 3]], g4), fill: 'k' },     // big
  { raw: rectiPath([[3, 1], [4, 1], [4, 4], [2, 4], [2, 2], [3, 2]], g4), fill: 'k' },                     // L
  { raw: rectiPath([[1, 2], [2, 2], [2, 4], [0, 4], [0, 3], [1, 3]], g4), fill: 's' },                     // small L
];
// tilted receipt rows in a round bubble with tail
S.rows = () => {
  const cx = 128, cy = 120, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(128, 92, -7, G), b = cut(128, 150, 5, G);
  const T = tri([cx - 0.64 * r, cy + 1.13 * r], [cx - 0.86 * r, cy + 0.12 * r], [cx - 0.06 * r, cy + 0.70 * r]);
  return [
    { cs: [C, a([128, 0])], fill: 'k' }, { cs: [C, a([128, 256]), b([128, 0])], fill: 's' }, { cs: [C, b([128, 256])], fill: 'k' },
    { cs: [...T, b([128, 256])], fill: 'k', tail: true },
  ];
};
// fan of shares from the tail root
S.fan = () => {
  const cx = 132, cy = 116, r = 96, G = 16, C = disk(cx, cy, r);
  const J = [cx - 0.62 * r, cy + 0.62 * r];
  const a = cut(J[0], J[1], -28, G), b = cut(J[0], J[1], -62, G);
  const T = tri([cx - 0.70 * r, cy + 1.14 * r], [cx - 0.92 * r, cy + 0.2 * r], [cx - 0.1 * r, cy + 0.72 * r]);
  return [
    { cs: [C, a([256, 256])], fill: 'k' }, { cs: [C, a([128, 0]), b([256, 0])], fill: 's' }, { cs: [C, b([0, 0])], fill: 'k' },
    { cs: [...T], fill: 'k', tail: true },
  ];
};
// fan from the tail, cuts stop short of the tail (hub piece holds the tail)
S.fanHub = () => {
  const cx = 132, cy = 116, r = 96, G = 16, C = disk(cx, cy, r);
  const J = [cx - 0.95 * r, cy + 0.95 * r];
  const a = cut(J[0], J[1], -22, G), b = cut(J[0], J[1], -56, G);
  const arc = { kind: 'disk', c: J, R: 1e9 };
  const T = tri([cx - 0.70 * r, cy + 1.14 * r], [cx - 0.92 * r, cy + 0.2 * r], [cx - 0.1 * r, cy + 0.72 * r]);
  return [
    { cs: [C, a([256, 256])], fill: 'k' }, { cs: [C, a([128, 0]), b([256, 0])], fill: 's' }, { cs: [C, b([0, 0])], fill: 'k' },
    { cs: [...T, a([128, 0]), b([256, 0])], fill: 's', tail: true },
  ];
};
// slices with clear unequal ratios; tail on the big left piece; "\" lean
S.slicesBig = () => {
  const cx = 128, cy = 120, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(134, cy, 74, G), b = cut(184, cy, 62, G);
  const T = tri([cx - 0.64 * r, cy + 1.13 * r], [cx - 0.86 * r, cy + 0.12 * r], [cx - 0.06 * r, cy + 0.70 * r]);
  return [
    { cs: [C, a([0, 128])], fill: 'k' }, { cs: [C, a([256, 128]), b([0, 128])], fill: 's' }, { cs: [C, b([256, 128])], fill: 'k' },
    { cs: [...T, a([0, 128])], fill: 'k', tail: true },
  ];
};
S.slicesBig2 = () => {
  const cx = 128, cy = 120, r = 96, G = 16, C = disk(cx, cy, r);
  const a = cut(122, cy, -72, G), b = cut(176, cy, -60, G);
  const T = tri([cx - 0.70 * r, cy + 1.10 * r], [cx - 0.92 * r, cy + 0.0 * r], [cx - 0.2 * r, cy + 0.66 * r]);
  return [
    { cs: [C, a([0, 128])], fill: 'k' }, { cs: [C, a([256, 128]), b([0, 128])], fill: 's' }, { cs: [C, b([256, 128])], fill: 'k' },
    { cs: [...T, a([0, 128])], fill: 'k', tail: true },
  ];
};
function build(name) {
  return S[name]().map(p => {
    if (p.raw) return { d: p.raw, fill: p.fill };
    const rf = p.tail ? () => 0 : () => 5;
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
