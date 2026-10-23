import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch3';
fs.mkdirSync(OUT, { recursive: true });
const cut = (x, y, a, g) => pt => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};
const L = [0, 128], Rt = [256, 128], U = [128, 0], D = [128, 256];
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
// slices bubble: cuts = [[x at cy, angle]], tail 'L' | 'R' | null
function slices({ cuts, sage, tail = 'R', cx = 128, cy = 120, r = 96, G = 16 }) {
  const C = disk(cx, cy, r);
  const cs = cuts.map(([x, a]) => cut(x, cy, a, G));
  const P = [];
  for (let k = 0; k <= cs.length; k++) {
    const con = [C];
    if (k > 0) con.push(cs[k - 1](Rt));
    if (k < cs.length) con.push(cs[k](L));
    P.push({ cs: con, fill: k === sage ? 's' : 'k' });
  }
  if (tail) {
    const s = tail === 'R' ? 1 : -1;
    const T = tri([cx + s * 0.64 * r, cy + 1.13 * r], [cx + s * 0.86 * r, cy + 0.12 * r], [cx + s * 0.06 * r, cy + 0.70 * r]);
    const k = tail === 'R' ? cs.length : 0;
    const con = [...T];
    if (k > 0) con.push(cs[k - 1](Rt));
    if (k < cs.length) con.push(cs[k](L));
    P.push({ cs: con, fill: k === sage ? 's' : 'k', tail: true });
  }
  return P;
}
// "/" cuts are negative angles (~ -60..-80); "\" positive
S.s1 = () => slices({ cuts: [[96, -64], [158, -78]], sage: 1, tail: 'R' });
S.s2 = () => slices({ cuts: [[96, -64], [158, -78]], sage: 2, tail: 'R' });
S.s3 = () => slices({ cuts: [[86, -76], [150, -62]], sage: 1, tail: 'R' });
S.s4 = () => slices({ cuts: [[104, 66], [166, 80]], sage: 1, tail: 'L' });
S.s5 = () => slices({ cuts: [[84, -80], [138, -66]], sage: 2, tail: 'R' });
S.s6 = () => slices({ cuts: [[110, -70], [168, -82]], sage: 0, tail: 'R' });
// near-vertical, different tilts, same lean
S.s7 = () => slices({ cuts: [[100, -78], [160, -88]], sage: 1, tail: 'R' });
S.s8 = () => slices({ cuts: [[92, -72], [146, -84], [188, -96]], sage: 1, tail: 'R' });
// one slash + one shallow cut (crossing) -> 4 shares
S.cross = () => {
  const cx = 128, cy = 120, r = 96, G = 16;
  const C = disk(cx, cy, r);
  const a = cut(118, cy, -70, G), b = cut(cx, 150, -16, G);
  const T = tri([cx + 0.64 * r, cy + 1.13 * r], [cx + 0.86 * r, cy + 0.12 * r], [cx + 0.06 * r, cy + 0.70 * r]);
  return [
    { cs: [C, a(L), b(U)], fill: 'k' }, { cs: [C, a(Rt), b(U)], fill: 'k' },
    { cs: [C, a(L), b(D)], fill: 's' }, { cs: [C, a(Rt), b(D)], fill: 'k' },
    { cs: [...T, a(Rt), b(D)], fill: 'k', tail: true },
  ];
};
// kinked: a slash from top down to a kink, then different angle to the bottom; branch right
S.kink = () => {
  const cx = 128, cy = 120, r = 96, G = 16;
  const C = disk(cx, cy, r);
  const K = [118, 138];
  const top = cut(K[0], K[1], -70, G), bot = cut(K[0], K[1], -100, G), br = cut(K[0], K[1], -14, G);
  const T = tri([cx + 0.64 * r, cy + 1.13 * r], [cx + 0.86 * r, cy + 0.12 * r], [cx + 0.06 * r, cy + 0.70 * r]);
  return [
    { cs: [C, top(L), bot(L)], fill: 'k' },
    { cs: [C, top(Rt), br(U)], fill: 'k' },
    { cs: [C, bot(Rt), br(D)], fill: 's' },
    { cs: [...T, bot(Rt), br(D)], fill: 's', tail: true },
  ];
};
// squircle tile with slices
S.tileSlices = () => {
  const B = box(40, 40, 216, 216), G = 16;
  const c1 = cut(100, 128, -66, G), c2 = cut(164, 128, -80, G);
  return [
    { cs: [...B, c1(L)], fill: 'k', sq: true }, { cs: [...B, c1(Rt), c2(L)], fill: 's', sq: true }, { cs: [...B, c2(Rt)], fill: 'k', sq: true },
  ];
};
// tile: brick (horizontal through cut, staggered vertical cuts at different tilts)
S.tileBrick = () => {
  const B = box(40, 40, 216, 216), G = 16;
  const h = cut(128, 120, -8, G), v1 = cut(150, 80, -76, G), v2 = cut(100, 170, -84, G);
  return [
    { cs: [...B, h(U), v1(L)], fill: 'k', sq: true }, { cs: [...B, h(U), v1(Rt)], fill: 'k', sq: true },
    { cs: [...B, h(D), v2(L)], fill: 's', sq: true }, { cs: [...B, h(D), v2(Rt)], fill: 'k', sq: true },
  ];
};
S.circBrick = () => {
  const C = disk(128, 128, 100), G = 16;
  const h = cut(128, 118, -10, G), v1 = cut(150, 80, -74, G), v2 = cut(100, 170, -84, G);
  return [
    { cs: [C, h(U), v1(L)], fill: 'k' }, { cs: [C, h(U), v1(Rt)], fill: 'k' },
    { cs: [C, h(D), v2(L)], fill: 's' }, { cs: [C, h(D), v2(Rt)], fill: 'k' },
  ];
};
function build(name) {
  return S[name]().map(p => {
    const rf = p.tail ? () => 0 : p.sq ? ((A, B) => (A.outer && B.outer) ? 40 : 6) : () => 5;
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
