import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { half, disk, piecePath, area, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');

const OUT = path.dirname(new URL(import.meta.url).pathname) + '/sketch';
fs.mkdirSync(OUT, { recursive: true });

// cut helper: line through (x,y) at angle a; piece side s (+1/-1); gap g
const cut = (x, y, a, g) => pt => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};
const R = (rOuter, rCut, rInner) => (A, B) => {
  if (A.kind === 'disk' || B.kind === 'disk') return rOuter;
  if (A.outer && B.outer) return rOuter; // square corners
  if (A.outer || B.outer) return rCut;
  return rInner;
};

function tail(cx, cy, Rr, opts = {}) {
  // pointed speech-bubble tail at lower-left; returns constraints (triangle)
  const tip = opts.tip || [cx - 0.62 * Rr, cy + 1.13 * Rr];
  const A = opts.A || [cx - 0.74 * Rr, cy + 0.05 * Rr];
  const B = opts.B || [cx - 0.05 * Rr, cy + 0.62 * Rr];
  const line = (p, q, other) => {
    const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
    let h = half(p[0], p[1], a, 1);
    if (h.n[0] * other[0] + h.n[1] * other[1] < h.d) h = half(p[0], p[1], a, -1);
    return h;
  };
  return [line(tip, A, B), line(tip, B, A), line(A, B, tip)];
}

const S = {};
const G = 16; // gap in mark units
const L = [0, 128], Rt = [256, 128], U = [128, 0], D = [128, 256];

// --- Round bubble family -------------------------------------------------
S.twoChords = () => {
  const C = disk(128, 124, 100);
  const c1 = cut(92, 124, 76, G), c2 = cut(168, 124, 104, G);
  return [
    { cs: [C, c1(L)], fill: 'k' },
    { cs: [C, c1(Rt), c2(L)], fill: 's' },
    { cs: [C, c2(Rt)], fill: 'k' },
  ];
};
S.chordT = () => {
  const C = disk(128, 128, 100);
  const c1 = cut(112, 128, 68, G);
  const c2 = cut(150, 150, 18, G);
  return [
    { cs: [C, c1(L)], fill: 'k' },
    { cs: [C, c1(Rt), c2(U)], fill: 'k' },
    { cs: [C, c1(Rt), c2(D)], fill: 's' },
  ];
};
S.offY = () => {
  const C = disk(128, 128, 100);
  const J = [112, 142];
  const ray = a => cut(J[0], J[1], a, G);
  const r1 = ray(-75), r2 = ray(15), r3 = ray(128);
  return [
    { cs: [C, r1([250, 0]), r2([250, 0])], fill: 'k' },
    { cs: [C, r2([200, 256]), r3([200, 256])], fill: 's' },
    { cs: [C, r3([0, 60]), r1([0, 60])], fill: 'k' },
  ];
};
S.chord2T = () => {
  const C = disk(128, 128, 100);
  const m = cut(128, 120, -14, G);
  const up = cut(100, 80, 76, G), dn = cut(168, 160, 100, G);
  return [
    { cs: [C, m(U), up(L)], fill: 'k' },
    { cs: [C, m(U), up(Rt)], fill: 'k' },
    { cs: [C, m(D), dn(L)], fill: 's' },
    { cs: [C, m(D), dn(Rt)], fill: 'k' },
  ];
};
S.bubble3 = () => {
  const cx = 134, cy = 116, r = 94;
  const C = disk(cx, cy, r);
  const c1 = cut(104, 116, 72, G), c2 = cut(150, 132, 12, G);
  const T = tail(cx, cy, r);
  return [
    { cs: [C, c1(L)], fill: 'k' },
    { cs: [...T, c1(L)], fill: 'k', tail: true },
    { cs: [C, c1(Rt), c2(U)], fill: 'k' },
    { cs: [C, c1(Rt), c2(D)], fill: 's' },
  ];
};
S.bubbleY = () => {
  const cx = 134, cy = 116, r = 94;
  const C = disk(cx, cy, r);
  const J = [118, 128];
  const ray = a => cut(J[0], J[1], a, G);
  const r1 = ray(-78), r2 = ray(22), r3 = ray(122);
  const T = tail(cx, cy, r);
  return [
    { cs: [C, r1([250, 0]), r2([250, 0])], fill: 'k' },
    { cs: [C, r2([200, 256]), r3([200, 256])], fill: 's' },
    { cs: [C, r3([0, 60]), r1([0, 60])], fill: 'k' },
    { cs: [...T, r3([0, 60]), r1([0, 60])], fill: 'k', tail: true },
  ];
};
S.bubblePinwheel = () => {
  const C = disk(128, 128, 100);
  const x0 = 104, x1 = 150, y0 = 104, y1 = 150;
  const vL = cut(x0, 0, 90, G), vR = cut(x1, 0, 90, G), hT = cut(0, y0, 0, G), hB = cut(0, y1, 0, G);
  return [
    { cs: [C, hT(U), vR(L)], fill: 'k' },
    { cs: [C, vR(Rt), hB(U)], fill: 'k' },
    { cs: [C, hB(D), vL(Rt)], fill: 'k' },
    { cs: [C, vL(L), hT(D)], fill: 'k' },
    { cs: [C, vL(Rt), vR(L), hT(D), hB(U)], fill: 's' },
  ];
};

// --- Rounded-square family ----------------------------------------------
function box(x0, y0, x1, y1) {
  const mk = (px, py, nx, ny) => ({ kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true });
  return [mk(x0, 0, 1, 0), mk(x1, 0, -1, 0), mk(0, y0, 0, 1), mk(0, y1, 0, -1)];
}
S.bento = () => {
  const B = box(36, 36, 220, 220);
  const v = cut(116, 0, 90, G), hR = cut(0, 104, 0, G), hL = cut(0, 168, 0, G);
  return [
    { cs: [...B, v(L), hL(U)], fill: 'k' },
    { cs: [...B, v(L), hL(D)], fill: 'k' },
    { cs: [...B, v(Rt), hR(U)], fill: 's' },
    { cs: [...B, v(Rt), hR(D)], fill: 'k' },
  ];
};
S.pinwheelSq = () => {
  const B = box(36, 36, 220, 220);
  const vL = cut(96, 0, 90, G), vR = cut(152, 0, 90, G), hT = cut(0, 92, 0, G), hB = cut(0, 160, 0, G);
  return [
    { cs: [...B, hT(U), vR(L)], fill: 'k' },
    { cs: [...B, vR(Rt), hB(U)], fill: 'k' },
    { cs: [...B, hB(D), vL(Rt)], fill: 'k' },
    { cs: [...B, vL(L), hT(D)], fill: 'k' },
    { cs: [...B, vL(Rt), vR(L), hT(D), hB(U)], fill: 's' },
  ];
};
S.slantSlices = () => {
  const B = box(36, 36, 220, 220);
  const c1 = cut(100, 128, 76, G), c2 = cut(166, 128, 98, G);
  return [
    { cs: [...B, c1(L)], fill: 'k' },
    { cs: [...B, c1(Rt), c2(L)], fill: 's' },
    { cs: [...B, c2(Rt)], fill: 'k' },
  ];
};
S.slantT = () => {
  const B = box(36, 36, 220, 220);
  const c1 = cut(116, 128, 72, G), c2 = cut(170, 140, 14, G);
  return [
    { cs: [...B, c1(L)], fill: 'k' },
    { cs: [...B, c1(Rt), c2(U)], fill: 'k' },
    { cs: [...B, c1(Rt), c2(D)], fill: 's' },
  ];
};

// --- Receipt lines -------------------------------------------------------
S.pills = () => {
  const h = 46, gap = 18, y0 = 128 - (3 * h + 2 * gap) / 2;
  const rows = [[40, 216, 'k'], [40, 160, 's'], [40, 192, 'k']];
  return rows.map(([a, b, fill], i) => ({ raw: `M${a + h / 2} ${y0 + i * (h + gap)}H${b - h / 2}A${h / 2} ${h / 2} 0 0 1 ${b - h / 2} ${y0 + i * (h + gap) + h}H${a + h / 2}A${h / 2} ${h / 2} 0 0 1 ${a + h / 2} ${y0 + i * (h + gap)}Z`, fill }));
};

const radius = R(0, 5, 5);
const radiusSq = R(34, 6, 5);
function build(name) {
  const parts = S[name]();
  return parts.map(p => {
    if (p.raw) return { d: p.raw, fill: p.fill };
    const isSq = p.cs.some(c => c.outer);
    const rf = p.tail ? ((A, B) => 0) : isSq ? radiusSq : radius;
    return { d: piecePath(p.cs, rf), fill: p.fill, a: area(p.cs) };
  });
}

const col = { k: '#2D2D2D', s: '#6FAF8E' };
const colDark = { k: '#FAFAF8', s: '#6FAF8E' };
const svg = (parts, pal, bg, scale = 1) => {
  const t = scale === 1 ? '' : ` transform="translate(${f(128 - 128 * scale)} ${f(128 - 128 * scale)}) scale(${scale})"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g${t}>${parts.map(p => `<path fill="${pal[p.fill]}" d="${p.d}"/>`).join('')}</g></svg>`;
};

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(S);
let cells = '';
for (const n of names) {
  const parts = build(n);
  const m = svg(parts, col);
  const app = svg(parts, colDark, '#2D2D2D', 0.7);
  fs.writeFileSync(`${OUT}/${n}.svg`, m);
  fs.writeFileSync(`${OUT}/${n}-app.svg`, app);
  const areas = parts.filter(p => p.a).map(p => Math.round(p.a / 100)).join('/');
  cells += `<div class="c"><img src="${n}.svg" width="150"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n} ${areas}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 600 }, deviceScaleFactor: 1 });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
console.log('ok', OUT + '/sheet.png');
