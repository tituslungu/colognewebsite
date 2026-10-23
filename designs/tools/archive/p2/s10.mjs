import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s10';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const mk = (px, py, nx, ny, side) => ({ kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true, side });
const box = (x0, y0, x1, y1) => [mk(x0, 0, 1, 0, 'L'), mk(x1, 0, -1, 0, 'R'), mk(0, y0, 0, 1, 'T'), mk(0, y1, 0, -1, 'B')];
const G = 16;
const S = {};
// pinwheel: four cuts, each from the edge to the next cut; centre piece small. cuts: [vx1 (top cut x), hy1 (right cut y), vx2 (bottom cut x), hy2 (left cut y)], tilt per cut
function pin({ X0 = 40, Y0 = 36, X1 = 216, Y1 = 196, vt, hr, vb, hl, tilts = [0, 0, 0, 0], sage = 0, centre = 'k', r = 36 }) {
  const B = box(X0, Y0, X1, Y1);
  const top = t => pick(vt, Y0, 90 + tilts[0], G, t), right = t => pick(X1, hr, tilts[1], G, t), bot = t => pick(vb, Y1, 90 + tilts[2], G, t), left = t => pick(X0, hl, tilts[3], G, t);
  const far = { l: [-999, 128], r: [999, 128], u: [128, -999], d: [128, 999] };
  // pieces: TL (left of top cut, above left cut), TR (right of top cut, above right cut), BR (right of bottom cut, below right cut), BL (left of bottom cut, below left cut) -- pinwheel: each cut stops at the next
  const P = [
    { cs: [...B, top(far.l), left(far.u)], n: 'TL' },
    { cs: [...B, top(far.r), right(far.u)], n: 'TR' },
    { cs: [...B, bot(far.r), right(far.d)], n: 'BR' },
    { cs: [...B, bot(far.l), left(far.d)], n: 'BL' },
  ];
  return P.map((p, i) => ({ ...p, f: i === sage ? 's' : 'k', sq: r }));
}
// a true pinwheel: top cut runs from top edge down to the left cut... implement via explicit constraints
function pinwheel({ X0 = 40, Y0 = 40, X1 = 216, Y1 = 216, a, b, c, d, sage = 1, r = 40, centreFill = null }) {
  // a: x of the top-left vertical cut, b: y of the top-right horizontal cut, c: x of the bottom-right vertical cut, d: y of the bottom-left horizontal cut
  // pieces: N (top strip: y<b... ) standard pinwheel with centre rect [a..c] x [b..d]
  const B = box(X0, Y0, X1, Y1);
  const vA = t => pick(a, 0, 90, G, t), vC = t => pick(c, 0, 90, G, t), hB = t => pick(0, b, 0, G, t), hD = t => pick(0, d, 0, G, t);
  const L = [-999, 128], R = [999, 128], U = [128, -999], D = [128, 999];
  const P = [
    { cs: [...B, vA(L), hD(U)] },            // left column: x<a, y<d
    { cs: [...B, vA(R), hB(U)] },            // top row: x>a, y<b
    { cs: [...B, vC(R), hB(D)] },            // right column: x>c, y>b
    { cs: [...B, vC(L), hD(D)] },            // bottom row: x<c, y>d
  ];
  if (centreFill) P.push({ cs: [...B, vA(R), vC(L), hB(D), hD(U)] });
  return P.map((p, i) => ({ ...p, f: i === sage ? 's' : (i === 4 ? centreFill : 'k'), sq: r }));
}
S.pw1 = () => pinwheel({ a: 104, b: 92, c: 160, d: 168, sage: 1 });
S.pw2 = () => pinwheel({ a: 92, b: 112, c: 148, d: 176, sage: 2, centreFill: 's' });
S.pw3 = () => pinwheel({ a: 116, b: 84, c: 150, d: 150, sage: 3 });
S.pw4 = () => pinwheel({ a: 100, b: 100, c: 156, d: 156, sage: 0, centreFill: 's' });
const build = n => S[n]().map(p => ({ d: piecePath(p.cs, (A, B) => (A.outer && B.outer) ? (p.sq || 0) : 5.5), f: p.f }));
const svg = (parts, ink, sage, bg, sc = 1) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g transform="translate(${128 - 128 * sc} ${128 - 128 * sc}) scale(${sc})"><path fill="${ink}" d="${parts.filter(p => p.f === 'k').map(p => p.d).join('')}"/><path fill="${sage}" d="${parts.filter(p => p.f === 's').map(p => p.d).join('')}"/></g></svg>`;
let cells = '';
for (const n of Object.keys(S)) {
  const parts = build(n);
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(parts, '#2D2D2D', '#6FAF8E'));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(parts, '#FAFAF8', '#6FAF8E', '#2D2D2D', 0.72));
  cells += `<div class="c"><img src="${n}.svg" width="170"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;padding:18px;width:1000px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1040, height: 400 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
