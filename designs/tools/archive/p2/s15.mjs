import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s15';
fs.mkdirSync(OUT, { recursive: true });
const G = 16, deg = Math.PI / 180;
const tri = (tip, A, B) => { const line = (p, q, o) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI; let h = half(p[0], p[1], a, 1); if (h.n[0] * o[0] + h.n[1] * o[1] < h.d) h = half(p[0], p[1], a, -1); return h; }; return [line(tip, A, B), line(tip, B, A), line(A, B, tip)]; };
// halfplane bounded by line through p with angle a, containing point t, inset g/2
const hp = (p, a, t, g = G) => { let h = half(p[0], p[1], a, 1, g / 2); const hh = half(p[0], p[1], a, 1, 0); if (hh.n[0] * t[0] + hh.n[1] * t[1] < hh.d) h = half(p[0], p[1], a, -1, g / 2); return h; };
// 3-arm pinwheel: triangle centre with vertices V0,V1,V2 (clockwise). Line k passes through Vk and V(k+1), extended beyond V(k+1)... each cut runs from the rim to the far vertex.
function tripin({ cx = 132, cy = 118, r = 96, V, sage = 'c', tail = true }) {
  const C = disk(cx, cy, r);
  const lines = [0, 1, 2].map(k => { const a = V[k], b = V[(k + 1) % 3]; return { p: a, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI }; });
  const cen = [(V[0][0] + V[1][0] + V[2][0]) / 3, (V[0][1] + V[1][1] + V[2][1]) / 3];
  // centre triangle: inside all three lines
  const centre = [C, ...lines.map(l => hp(l.p, l.ang, cen))];
  // outer piece k: outside line k, inside line k-1 (pinwheel arms)
  const outer = [0, 1, 2].map(k => {
    const l = lines[k], lp = lines[(k + 2) % 3];
    const away = [2 * l.p[0] - cen[0], 2 * l.p[1] - cen[1]];
    // a point outside line k: reflect centre across line k
    const n = [-Math.sin(l.ang * deg), Math.cos(l.ang * deg)];
    const dist = (cen[0] - l.p[0]) * n[0] + (cen[1] - l.p[1]) * n[1];
    const outside = [cen[0] - 2 * dist * n[0], cen[1] - 2 * dist * n[1]];
    // the arm of line k-1 continues past V[k]; outer piece k is on the centre-side of that extension
    const nb = [-Math.sin(lp.ang * deg), Math.cos(lp.ang * deg)];
    return [C, hp(l.p, l.ang, outside), hp(lp.p, lp.ang, [l.p[0] + (V[(k + 1) % 3][0] - l.p[0]) * 0.5 + 0 * nb[0], l.p[1] + (V[(k + 1) % 3][1] - l.p[1]) * 0.5])];
  });
  const parts = [{ cs: centre, f: sage === 'c' ? 's' : 'k' }, ...outer.map((cs, i) => ({ cs, f: sage === i ? 's' : 'k' }))];
  return parts.map(p => ({ d: piecePath(p.cs, () => 5), f: p.f }));
}
const S = {};
S.p1 = () => tripin({ V: [[112, 96], [168, 128], [118, 160]] });
S.p2 = () => tripin({ V: [[104, 100], [164, 118], [124, 168]], sage: 1 });
S.p3 = () => tripin({ V: [[120, 104], [150, 140], [106, 150]] });
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
const p = await b.newPage({ viewport: { width: 1240, height: 300 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
