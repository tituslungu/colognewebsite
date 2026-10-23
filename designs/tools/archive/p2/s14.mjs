import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s14';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const tri = (tip, A, B) => { const line = (p, q, o) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI; let h = half(p[0], p[1], a, 1); if (h.n[0] * o[0] + h.n[1] * o[1] < h.d) h = half(p[0], p[1], a, -1); return h; }; return [line(tip, A, B), line(tip, B, A), line(A, B, tip)]; };
const G = 16, deg = Math.PI / 180;
// chord defined by its normal angle (direction from centre) and distance d (x r)
const chord = (cx, cy, r, nAng, d) => { const n = [Math.cos(nAng * deg), Math.sin(nAng * deg)]; const p = [cx + n[0] * d * r, cy + n[1] * d * r]; return { p, a: nAng + 90, out: [cx + n[0] * 3 * r, cy + n[1] * 3 * r], inn: [cx, cy] }; };
function facets({ cx = 132, cy = 116, r = 96, c1, c2, sage = 'c2', tail = { phi: 128, k: 1.2, a1: 14, a2: 18 } }) {
  const C = disk(cx, cy, r);
  const A = chord(cx, cy, r, ...c1), B = chord(cx, cy, r, ...c2);
  const h = (c, t) => pick(c.p[0], c.p[1], c.a, G, t);
  const mid = [C, h(A, A.inn), h(B, B.inn)];
  const parts = [
    { cs: [C, h(A, A.out)], f: sage === 'c1' ? 's' : 'k' },
    { cs: mid, f: sage === 'mid' ? 's' : 'k' },
    { cs: [C, h(B, B.out)], f: sage === 'c2' ? 's' : 'k' },
  ];
  const rim = ang => [cx + 0.9 * r * Math.cos(ang * deg), cy + 0.9 * r * Math.sin(ang * deg)];
  const tip = [cx + r * tail.k * Math.cos(tail.phi * deg), cy + r * tail.k * Math.sin(tail.phi * deg)];
  const T = tri(tip, rim(tail.phi - tail.a1), rim(tail.phi + tail.a2));
  const out = parts.map(p => ({ d: piecePath(p.cs, () => 5.5), f: p.f }));
  out[1].d += piecePath([...T, h(A, A.inn), h(B, B.inn)], (X, Y, i, j) => ((i === 0 && j === 1) || (i === 1 && j === 0)) ? 3.4 : 0);
  return out;
}
const S = {};
S.k1 = () => facets({ c1: [180, 0.5], c2: [-40, 0.42] });            // left cap + upper-right cap
S.k2 = () => facets({ c1: [195, 0.48], c2: [-45, 0.36] });
S.k3 = () => facets({ c1: [-120, 0.5], c2: [10, 0.44] });            // upper-left cap + right cap
S.k4 = () => facets({ c1: [180, 0.52], c2: [30, 0.42], tail: { phi: 128, k: 1.2, a1: 14, a2: 18 } }); // left + lower-right
S.k5 = () => facets({ c1: [-100, 0.5], c2: [0, 0.4] });              // top cap + right cap
S.k6 = () => facets({ c1: [200, 0.46], c2: [-60, 0.4], sage: 'c1' });
const svg = (parts, ink, sage, bg, sc = 1) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g transform="translate(${128 - 128 * sc} ${128 - 128 * sc}) scale(${sc})"><path fill="${ink}" d="${parts.filter(p => p.f === 'k').map(p => p.d).join('')}"/><path fill="${sage}" d="${parts.filter(p => p.f === 's').map(p => p.d).join('')}"/></g></svg>`;
let cells = '';
for (const n of Object.keys(S)) {
  const parts = S[n]();
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
