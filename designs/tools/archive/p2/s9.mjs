import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s9';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const mk = (px, py, nx, ny) => { const l = Math.hypot(nx, ny); nx /= l; ny /= l; return { kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true }; };
// rotated rounded box: centre, w, h, angle
function rbox(cx, cy, w, h, ang) {
  const a = ang * Math.PI / 180, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]];
  const P = (s, t) => [cx + s * u[0] + t * v[0], cy + s * u[1] + t * v[1]];
  return { cs: [mk(...P(-w / 2, 0), u[0], u[1]), mk(...P(w / 2, 0), -u[0], -u[1]), mk(...P(0, -h / 2), v[0], v[1]), mk(...P(0, h / 2), -v[0], -v[1])], P, u, v };
}
const S = {};
const G = 16;
const tri = (tip, A, B) => { const line = (p, q, o) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI; let h = half(p[0], p[1], a, 1); if (h.n[0] * o[0] + h.n[1] * o[1] < h.d) h = half(p[0], p[1], a, -1); return h; }; return [line(tip, A, B), line(tip, B, A), line(A, B, tip)]; };
// rows in a rounded-square bubble with tail
const rows = (y1, a1, y2, a2, sage, tailRow = 2, box = [40, 36, 216, 196], sq = 40) => () => {
  const B = rbox((box[0] + box[2]) / 2, (box[1] + box[3]) / 2, box[2] - box[0], box[3] - box[1], 0).cs;
  const A = t => pick(128, y1, a1, G, t), C = t => pick(128, y2, a2, G, t);
  const P = [{ cs: [...B, A([128, 0])] }, { cs: [...B, A([128, 256]), C([128, 0])] }, { cs: [...B, C([128, 256])] }];
  P.forEach((p, i) => { p.f = i === sage ? 's' : 'k'; p.sq = sq; });
  const T = tri([62, 232], [52, 170], [104, 180]);
  P.push({ cs: [...T, C([128, 256])], f: tailRow === sage ? 's' : 'k', tail: true });
  return P;
};
S.rowsA = rows(84, -4, 136, 5, 1);
S.rowsB = rows(76, 6, 142, -3, 1);
S.rowsC = rows(96, -5, 150, 4, 0);
S.rowsD = rows(70, 3, 120, -6, 2);
// receipt rows in round bubble, tilted, unequal heights
S.rowsRound = () => { const C = disk(128, 116, 96);
  const A = t => pick(128, 84, -6, G, t), Cc = t => pick(128, 130, 4, G, t);
  const T = tri([66, 228], [44, 150], [104, 190]);
  return [{ cs: [C, A([128, 0])], f: 'k' }, { cs: [C, A([128, 256]), Cc([128, 0])], f: 's' }, { cs: [C, Cc([128, 256])], f: 'k' }, { cs: [...T, Cc([128, 256])], f: 'k', tail: true }]; };
const build = n => S[n]().map(p => ({ d: piecePath(p.cs, p.tail ? (() => 0) : (A, B) => (A.outer && B.outer) ? (p.sq || 0) : 5.5), f: p.f }));
const svg = (parts, ink, sage, bg, sc = 1) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g transform="translate(${128 - 128 * sc} ${128 - 128 * sc}) scale(${sc})"><path fill="${ink}" d="${parts.filter(p => p.f === 'k').map(p => p.d).join('')}"/><path fill="${sage}" d="${parts.filter(p => p.f === 's').map(p => p.d).join('')}"/></g></svg>`;
let cells = '';
for (const n of Object.keys(S)) {
  const parts = build(n);
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(parts, '#2D2D2D', '#6FAF8E'));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(parts, '#FAFAF8', '#6FAF8E', '#2D2D2D', 0.72));
  cells += `<div class="c"><img src="${n}.svg" width="170"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 400 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
