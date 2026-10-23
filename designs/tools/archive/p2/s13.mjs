import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s13';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const tri = (tip, A, B) => { const line = (p, q, o) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI; let h = half(p[0], p[1], a, 1); if (h.n[0] * o[0] + h.n[1] * o[1] < h.d) h = half(p[0], p[1], a, -1); return h; }; return [line(tip, A, B), line(tip, B, A), line(A, B, tip)]; };
const G = 16;
const S = {};
const deg = Math.PI / 180;
// fan from a point J on/near the rim; rays at angles; the tail hangs below J
function fan({ cx = 134, cy = 116, r = 96, jAng = 128, jIn = 0.98, rays, sage, tailMode = 'own', tailLen = 0.34 }) {
  const C = disk(cx, cy, r);
  const J = [cx + jIn * r * Math.cos(jAng * deg), cy + jIn * r * Math.sin(jAng * deg)];
  // ray k: line through J at angle rays[k]; pieces between consecutive rays (sorted)
  const lines = rays.map(a => ({ a, test: (sgn) => [J[0] + Math.cos((a + sgn * 10) * deg) * 50, J[1] + Math.sin((a + sgn * 10) * deg) * 50] }));
  const P = [];
  for (let k = 0; k <= rays.length; k++) {
    const cs = [C];
    // piece k lies counter-clockwise (screen: increasing angle) of ray k-1 and before ray k
    if (k > 0) cs.push(pick(J[0], J[1], rays[k - 1], G, lines[k - 1].test(+1)));
    if (k < rays.length) cs.push(pick(J[0], J[1], rays[k], G, lines[k].test(-1)));
    P.push({ cs, f: k === sage ? 's' : 'k' });
  }
  // tail: triangle from J pointing outward (away from centre)
  const out = [J[0] - cx, J[1] - cy], ol = Math.hypot(...out); const u = [out[0] / ol, out[1] / ol];
  const tip = [J[0] + u[0] * tailLen * r - u[1] * 0.12 * r, J[1] + u[1] * tailLen * r + u[0] * 0.12 * r];
  const A = [J[0] - u[1] * 0.2 * r - u[0] * 0.15 * r, J[1] + u[0] * 0.2 * r - u[1] * 0.15 * r];
  const B = [J[0] + u[1] * 0.2 * r - u[0] * 0.15 * r, J[1] - u[0] * 0.2 * r - u[1] * 0.15 * r];
  return { P, tail: { cs: tri(tip, A, B), J } };
}
function render(def) {
  const { P, tail } = fan(def);
  const parts = P.map(p => ({ d: piecePath(p.cs, () => 5.5), f: p.f }));
  // tail as its own small share, separated from all pieces by the gap: clip by offset circle (outside rim + gap)
  return parts.concat([{ d: piecePath(tail.cs, () => 3), f: def.tailFill || 'k' }]);
}
S.f1 = () => render({ rays: [-60, 4], sage: 1 });
S.f2 = () => render({ rays: [-82, -22], sage: 2 });
S.f3 = () => render({ rays: [-70, -30, 10], sage: 1 });
// bent cut: polyline with one bend; second straight cut from the bend
function bent({ cx = 128, cy = 128, r = 98, K = [116, 146], a1 = -72, a2 = -112, a3 = -12, sage = 2 }) {
  const C = disk(cx, cy, r);
  const up = t => pick(K[0], K[1], a1, G, t), dn = t => pick(K[0], K[1], a2, G, t), br = t => pick(K[0], K[1], a3, G, t);
  // left piece: left of up (for y<K) and left of dn (for y>K) -> convex if bend is convex toward right
  return [
    { cs: [C, up([0, 128]), dn([0, 128])], f: 'k' },
    { cs: [C, up([256, 128]), br([256, 0])], f: 'k' },
    { cs: [C, dn([256, 128]), br([256, 256])], f: sage === 2 ? 's' : 'k' },
  ].map(p => ({ d: piecePath(p.cs, () => 5.5), f: p.f }));
}
S.b1 = () => bent({});
S.b2 = () => bent({ K: [140, 150], a1: -64, a2: -104, a3: -20 });
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
