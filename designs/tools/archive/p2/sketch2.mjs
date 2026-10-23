import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch2';
fs.mkdirSync(OUT, { recursive: true });

export const cut = (x, y, a, g) => pt => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};
const L = [0, 128], Rt = [256, 128], U = [128, 0], D = [128, 256];
function tailCs(tip, A, B) {
  const line = (p, q, other) => {
    const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
    let h = half(p[0], p[1], a, 1);
    if (h.n[0] * other[0] + h.n[1] * other[1] < h.d) h = half(p[0], p[1], a, -1);
    return h;
  };
  return [line(tip, A, B), line(tip, B, A), line(A, B, tip)];
}

// Rectilinear piece: verts in grid units, clockwise on screen; outerTest(edge) -> bool
export function rectiPath(verts, { x0, y0, cell, gap, rOuter, rIn, isOuter }) {
  const P = verts.map(([i, j]) => [x0 + i * cell, y0 + j * cell]);
  const n = P.length;
  const edges = P.map((p, k) => {
    const q = P[(k + 1) % n];
    const dx = Math.sign(q[0] - p[0]), dy = Math.sign(q[1] - p[1]);
    const outer = isOuter(verts[k], verts[(k + 1) % n]);
    const off = outer ? 0 : gap / 2;
    const nx = -dy, ny = dx; // inward normal for clockwise-on-screen
    return { p, q, dx, dy, nx, ny, off, outer };
  });
  const V = P.map((p, k) => {
    const a = edges[(k - 1 + n) % n], b = edges[k];
    const h = a.dy === 0 ? a : b, v = a.dy === 0 ? b : a;
    const x = v.p[0] + v.nx * v.off, y = h.p[1] + h.ny * h.off;
    const cross = a.dx * b.dy - a.dy * b.dx;
    const convex = cross > 0;
    const r = a.outer && b.outer ? rOuter : rIn;
    return { x, y, a, b, convex, r };
  });
  let d = '';
  V.forEach((v, k) => {
    const tin = [v.x - v.a.dx * v.r, v.y - v.a.dy * v.r];
    const tout = [v.x + v.b.dx * v.r, v.y + v.b.dy * v.r];
    d += (k === 0 ? 'M' : 'L') + f(tin[0]) + ' ' + f(tin[1]);
    d += `A${f(v.r)} ${f(v.r)} 0 0 ${v.convex ? 1 : 0} ${f(tout[0])} ${f(tout[1])}`;
  });
  return d + 'Z';
}

const S = {};
const rCirc = (A, B) => (A.kind === 'disk' || B.kind === 'disk') ? 5 : 5;

function slashBubble({ cuts, sage, cx = 132, cy = 118, r = 96, G = 16, slide = null, tail = true }) {
  const C = disk(cx, cy, r);
  const cs = cuts.map(([x, y, a]) => cut(x, y, a, G));
  const pieces = [];
  for (let k = 0; k <= cs.length; k++) {
    const con = [C];
    if (k > 0) con.push(cs[k - 1](Rt));
    if (k < cs.length) con.push(cs[k](L));
    pieces.push({ cs: con, fill: k === sage ? 's' : 'k' });
  }
  if (tail) {
    const T = tailCs([cx - 0.66 * r, cy + 1.12 * r], [cx - 0.80 * r, cy + 0.10 * r], [cx - 0.10 * r, cy + 0.66 * r]);
    pieces.push({ cs: [...T, cs[0](L)], fill: sage === 0 ? 's' : 'k', tail: true });
  }
  return pieces.map(p => ({ ...p, slide: p.fill === 's' ? slide : null }));
}
// forward-slash cuts: angle ~ -64..-76 deg
S.slash3a = () => slashBubble({ cuts: [[100, 118, -66], [150, 118, -74]], sage: 1 });
S.slash3b = () => slashBubble({ cuts: [[92, 118, -62], [168, 118, -72]], sage: 2 });
S.slash3c = () => slashBubble({ cuts: [[112, 118, -60], [172, 118, -74]], sage: 1 });
S.slash4 = () => slashBubble({ cuts: [[78, 118, -62], [124, 118, -68], [174, 118, -76]], sage: 2 });
S.slashSlide = () => slashBubble({ cuts: [[104, 118, -66], [160, 118, -74]], sage: 1, slide: [6, 14] });
S.slashNoTail = () => slashBubble({ cuts: [[100, 128, -64], [158, 128, -74]], sage: 1, cy: 128, cx: 128, r: 100, tail: false });
S.backslash = () => slashBubble({ cuts: [[104, 118, 64], [160, 118, 74]], sage: 1 });

// Polyomino mosaics on a 3x3 grid, no fault line
const sqOpts = (gap = 16) => ({ x0: 40, y0: 40, cell: 176 / 3, gap, rOuter: 38, rIn: 6, isOuter: (a, b) => (a[0] === b[0] && (a[0] === 0 || a[0] === 3)) || (a[1] === b[1] && (a[1] === 0 || a[1] === 3)) });
S.poly432 = () => [
  { raw: rectiPath([[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]], sqOpts()), fill: 'k' },        // L4
  { raw: rectiPath([[1, 1], [3, 1], [3, 3], [2, 3], [2, 2], [1, 2]], sqOpts()), fill: 'k' },        // L3
  { raw: rectiPath([[0, 2], [2, 2], [2, 3], [0, 3]], sqOpts()), fill: 's' },                        // I2
];
S.poly432b = () => [
  { raw: rectiPath([[0, 0], [3, 0], [3, 1], [1, 1], [1, 2], [0, 2]], sqOpts()), fill: 'k' },
  { raw: rectiPath([[1, 1], [3, 1], [3, 3], [2, 3], [2, 2], [1, 2]], sqOpts()), fill: 's' },
  { raw: rectiPath([[0, 2], [2, 2], [2, 3], [0, 3]], sqOpts()), fill: 'k' },
];
// 4x4 grid: shares 6/5/3/2, no fault lines
const sq4 = (gap = 14) => ({ x0: 40, y0: 40, cell: 44, gap, rOuter: 36, rIn: 5, isOuter: (a, b) => (a[0] === b[0] && (a[0] === 0 || a[0] === 4)) || (a[1] === b[1] && (a[1] === 0 || a[1] === 4)) });
S.poly4 = () => [
  { raw: rectiPath([[0, 0], [3, 0], [3, 2], [1, 2], [1, 3], [0, 3]], sq4()), fill: 'k' },   // 6+? cells: (0..2,0..1)=6 + (0,2)=1 -> 7
  { raw: rectiPath([[3, 0], [4, 0], [4, 4], [2, 4], [2, 3], [3, 3]], sq4()), fill: 'k' },   // col3 4 + (2,3)=1 -> 5
  { raw: rectiPath([[1, 2], [3, 2], [3, 3], [2, 3], [2, 4], [1, 4]], sq4()), fill: 's' },   // (1,2),(2,2),(1,3) -> 3
  { raw: rectiPath([[0, 3], [1, 3], [1, 4], [0, 4]], sq4()), fill: 'k' },                   // 1
];
// Round plate with stepped (rectilinear) cut: two pieces + a third
S.stepCircle = () => {
  // circle clipped pieces built from convex parts (union by overlap)
  const C = disk(128, 128, 100), G = 16;
  const v1 = cut(104, 0, 90, G), h1 = cut(0, 116, 0, G), v2 = cut(156, 0, 90, G);
  return [
    { cs: [C, v1(L)], fill: 'k' },
    { cs: [C, v1(Rt), h1(U)], fill: 'k' },
    { cs: [C, v1(Rt), h1(D), v2(L)], fill: 's' },
    { cs: [C, h1(D), v2(Rt)], fill: 'k' },
  ];
};

function build(name) {
  return S[name]().map(p => {
    if (p.raw) return { d: p.raw, fill: p.fill };
    const rf = p.tail ? () => 0 : rCirc;
    const d = piecePath(p.cs, rf);
    return { d, fill: p.fill, a: area(p.cs), slide: p.slide };
  });
}
const col = { k: '#2D2D2D', s: '#6FAF8E' };
const colDark = { k: '#FAFAF8', s: '#6FAF8E' };
const svg = (parts, pal, bg, scale = 1) => {
  const t = scale === 1 ? '' : ` transform="translate(${f(128 - 128 * scale)} ${f(128 - 128 * scale)}) scale(${scale})"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g${t}>${parts.map(p => `<path fill="${pal[p.fill]}"${p.slide ? ` transform="translate(${p.slide})"` : ''} d="${p.d}"/>`).join('')}</g></svg>`;
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
