import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s8';
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
S.plate = () => { const C = disk(128, 128, 100); const h = [128, 140, -8], v = [120, 80, -78];
  const H = t => pick(h[0], h[1], h[2], G, t), V = t => pick(v[0], v[1], v[2], G, t);
  return [{ cs: [C, H([128, 256])], f: 'k' }, { cs: [C, H([128, 0]), V([0, 0])], f: 'k' }, { cs: [C, H([128, 0]), V([256, 0])], f: 's' }]; };
S.table = () => { const B = rbox(128, 128, 224, 84, -16); const P = B.P;
  const c1 = P(-30, 0), c2 = P(40, 0);
  const a = t => pick(c1[0], c1[1], -16 + 90, G, t), b = t => pick(c2[0], c2[1], -16 + 90, G, t);
  return [{ cs: [...B.cs, a(P(-200, 0))], f: 'k', sq: 30 }, { cs: [...B.cs, a(P(200, 0)), b(P(-200, 0))], f: 's', sq: 30 }, { cs: [...B.cs, b(P(200, 0))], f: 'k', sq: 30 }]; };
S.table2 = () => { const B = rbox(128, 128, 224, 96, -14); const P = B.P;
  const c1 = P(-44, 0), c2 = P(26, 0);
  const a = t => pick(c1[0], c1[1], -14 + 74, G, t), b = t => pick(c2[0], c2[1], -14 + 104, G, t);
  return [{ cs: [...B.cs, a(P(-200, 0))], f: 'k', sq: 34 }, { cs: [...B.cs, a(P(200, 0)), b(P(-200, 0))], f: 's', sq: 34 }, { cs: [...B.cs, b(P(200, 0))], f: 'k', sq: 34 }]; };
// stepped split in a circle: upper-left piece vs lower-right, step made of 3 segments; plus sage corner
S.step = () => { const C = disk(128, 128, 100);
  // pieces as unions of convex parts: left column above y=150 & left of x=100 ... simpler: two convex parts per piece
  const v1 = t => pick(104, 0, 90, G, t), h1 = t => pick(0, 128, 0, G, t), v2 = t => pick(152, 0, 90, G, t);
  return [
    { cs: [C, v1([0, 0])], f: 'k' }, { cs: [C, v1([256, 0]), v2([0, 0]), h1([0, 0])], f: 'k', join: true },
    { cs: [C, v1([256, 0]), v2([0, 0]), h1([0, 256])], f: 's' }, { cs: [C, v2([256, 0])], f: 's', join: true },
  ]; };
S.shift = () => { const R = 96; const parts = []; const xs = [[30, 92, -14], [108, 168, 10], [184, 226, -4]];
  xs.forEach(([x0, x1, dy], i) => { const C = disk(128, 128 + dy, R); parts.push({ cs: [C, pick(x0, 0, 90, 0, [256, 0]), pick(x1, 0, 90, 0, [0, 0])], f: i === 1 ? 's' : 'k' }); });
  return parts; };
S.tab = () => { const B = rbox(128, 118, 220, 132, 0); const P = B.P;
  const a = t => pick(96, 118, -72, G, t), b = t => pick(170, 118, -84, G, t);
  return [{ cs: [...B.cs, a([0, 118])], f: 'k', sq: 46 }, { cs: [...B.cs, a([256, 118]), b([0, 118])], f: 'k', sq: 46 }, { cs: [...B.cs, b([256, 118])], f: 's', sq: 46 }]; };
const build = n => S[n]().map(p => ({ d: piecePath(p.cs, (A, B) => (A.outer && B.outer) ? (p.sq || 0) : (A.kind === 'disk' || B.kind === 'disk') ? 5.5 : 5.5), f: p.f }));
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
