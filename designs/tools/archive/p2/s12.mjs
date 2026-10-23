import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s12';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const mk = (px, py, nx, ny, side) => ({ kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true, side });
const box = (x0, y0, x1, y1) => [mk(x0, 0, 1, 0, 'L'), mk(x1, 0, -1, 0, 'R'), mk(0, y0, 0, 1, 'T'), mk(0, y1, 0, -1, 'B')];
const tri = (tip, A, B) => { const line = (p, q, o) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI; let h = half(p[0], p[1], a, 1); if (h.n[0] * o[0] + h.n[1] * o[1] < h.d) h = half(p[0], p[1], a, -1); return h; }; return [line(tip, A, B), line(tip, B, A), line(A, B, tip)]; };
const G = 16, L = [-999, 128], R = [999, 128];
const S = {};
// square bubble, 3 slices, sage slice lifted along its own cut direction by `lift`
function sq({ X0 = 36, Y0 = 52, X1 = 220, Y1 = 204, cuts, sage = 1, lift = 0, r = 40, tail = 'L' }) {
  const B = box(X0, Y0, X1, Y1);
  const cs = cuts.map(([x, a]) => t => pick(x, (Y0 + Y1) / 2, a, G, t));
  const P = [];
  for (let k = 0; k <= cuts.length; k++) {
    const c = [...B]; if (k > 0) c.push(cs[k - 1](R)); if (k < cuts.length) c.push(cs[k](L));
    P.push({ cs: c, f: k === sage ? 's' : 'k', sq: r });
  }
  if (tail === 'L') P.push({ cs: [...tri([X0 + 6, Y1 + 34], [X0 + 4, Y1 - 30], [X0 + 58, Y1 - 4]), cs[0](L)], f: sage === 0 ? 's' : 'k', tail: true });
  const a = cuts[sage === 0 ? 0 : sage - 1][1] * Math.PI / 180; // lift direction along the cut
  const dir = [Math.cos(a), Math.sin(a)]; if (dir[1] > 0) { dir[0] *= -1; dir[1] *= -1; }
  return P.map(p => ({ ...p, off: p.f === 's' ? [dir[0] * lift, dir[1] * lift] : null }));
}
S.sqA = () => sq({ cuts: [[100, -76], [164, -84]], lift: 0 });
S.sqB = () => sq({ cuts: [[100, -76], [164, -84]], lift: 22 });
S.sqC = () => sq({ cuts: [[92, -72], [150, -80]], sage: 1, lift: 26 });
S.sqD = () => sq({ cuts: [[110, -74], [168, -82]], sage: 2, lift: 24 });
// round bubble (portion-1 style) with lifted sage share, as control
S.rd = () => { const C = disk(128, 132, 92); const a = t => pick(92, 132, -76, G, t), b = t => pick(150, 132, -86, G, t);
  const dir = [Math.cos(-86 * Math.PI / 180), Math.sin(-86 * Math.PI / 180)];
  return [{ cs: [C, a(L)], f: 'k' }, { cs: [C, a(R), b(L)], f: 'k' }, { cs: [C, b(R)], f: 's', off: [dir[0] * 22, dir[1] * 22] }]; };
const build = n => S[n]().map(p => ({ d: piecePath(p.cs, p.tail ? () => 0 : (A, B) => (A.outer && B.outer) ? (p.sq || 0) : 5.5), f: p.f, off: p.off }));
const svg = (parts, ink, sage, bg, sc = 1) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g transform="translate(${128 - 128 * sc} ${128 - 128 * sc}) scale(${sc})"><path fill="${ink}" d="${parts.filter(p => p.f === 'k').map(p => p.d).join('')}"/>${parts.filter(p => p.f === 's').map(p => `<path fill="${sage}"${p.off ? ` transform="translate(${f(p.off[0])} ${f(p.off[1])})"` : ''} d="${p.d}"/>`).join('')}</g></svg>`;
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
