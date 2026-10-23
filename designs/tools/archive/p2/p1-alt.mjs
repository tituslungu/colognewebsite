import fs from 'fs';
import { createRequire } from 'module';
import { half, disk, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/p1alt';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const tri = (tip, A, B) => { const line = (p, q, o) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI; let h = half(p[0], p[1], a, 1); if (h.n[0] * o[0] + h.n[1] * o[1] < h.d) h = half(p[0], p[1], a, -1); return h; }; return [line(tip, A, B), line(tip, B, A), line(A, B, tip)]; };
// unit-space designs: circle (0,0) r=1; cuts {p:[x,y], a}; pieces: list of [ [cutIdx, testPoint], ... ]; tail: {tip, P, Q, pieceIdx}
const D = {
  caps1: { cuts: [{ p: [-0.42, 0], a: -76 }, { p: [0.3, 0.42], a: -24 }], pieces: [{ s: [[0, [-2, 0]]] }, { s: [[0, [2, 0]], [1, [0, -2]]] }, { s: [[1, [2, 2]]], sage: true }], tail: { tip: [-0.66, 1.12], P: [-0.95, 0.15], Q: [-0.5, 0.7], piece: 0 } },
  caps2: { cuts: [{ p: [-0.38, 0], a: -70 }, { p: [0.36, 0], a: -86 }], pieces: [{ s: [[0, [-2, 0]]] }, { s: [[0, [2, 0]], [1, [-2, 0]]] }, { s: [[1, [2, 0]]], sage: true }], tail: { tip: [-0.66, 1.12], P: [-0.95, 0.15], Q: [-0.55, 0.6], piece: 0 } },
  caps3: { cuts: [{ p: [-0.3, -0.3], a: -150 + 180 }, { p: [0.2, 0.4], a: -64 }], pieces: [{ s: [[0, [-2, -2]]] }, { s: [[0, [2, 2]], [1, [-2, 0]]] }, { s: [[1, [2, 0]]], sage: true }], tail: { tip: [-0.66, 1.12], P: [-0.95, 0.15], Q: [-0.3, 0.7], piece: 1 } },
  fan: { cuts: [{ p: [-0.62, 1.16], a: -66 }, { p: [-0.5, 1.16], a: -44 }], pieces: [{ s: [[0, [-2, 0]]] }, { s: [[0, [2, 0]], [1, [-2, -2]]], sage: true }, { s: [[1, [2, 2]]] }], tail: { tip: [-0.66, 1.14], P: [-0.95, 0.2], Q: [-0.5, 0.75], piece: 0 } },
  four: { cuts: [{ p: [-0.46, 0], a: -76 }, { p: [0.02, 0], a: -80 }, { p: [0.52, 0], a: -72 }], pieces: [{ s: [[0, [-2, 0]]] }, { s: [[0, [2, 0]], [1, [-2, 0]]] }, { s: [[1, [2, 0]], [2, [-2, 0]]], sage: true }, { s: [[2, [2, 0]]] }], tail: { tip: [-0.68, 1.12], P: [-0.95, 0.15], Q: [-0.62, 0.6], piece: 0 } },
  fourB: { cuts: [{ p: [-0.5, 0], a: -74 }, { p: [-0.04, 0], a: -79 }, { p: [0.56, 0], a: -66 }], pieces: [{ s: [[0, [-2, 0]]] }, { s: [[0, [2, 0]], [1, [-2, 0]]] }, { s: [[1, [2, 0]], [2, [-2, 0]]], sage: true }, { s: [[2, [2, 0]]] }], tail: { tip: [-0.7, 1.12], P: [-0.95, 0.15], Q: [-0.66, 0.6], piece: 0 } },
};
function build(def, cx, cy, R, G) {
  const C = disk(cx, cy, R);
  const X = ([x, y]) => [cx + x * R, cy + y * R];
  const cuts = def.cuts.map(c => ({ p: X(c.p), a: c.a }));
  const out = def.pieces.map(pc => ({ d: piecePath([C, ...pc.s.map(([i, t]) => pick(cuts[i].p[0], cuts[i].p[1], cuts[i].a, G, X(t)))], () => 0.055 * R), sage: !!pc.sage }));
  const t = def.tail, pc = def.pieces[t.piece];
  const tcs = [...tri(X(t.tip), X(t.P), X(t.Q)), ...pc.s.map(([i, tp]) => pick(cuts[i].p[0], cuts[i].p[1], cuts[i].a, G, X(tp)))];
  out[t.piece].d += piecePath(tcs, (A, B, i, j) => (i < 2 && j < 2) ? 0.04 * R : 0);
  return out;
}
const svg = (parts, ink, sage, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<path fill="${ink}" d="${parts.filter(p => !p.sage).map(p => p.d).join('')}"/><path fill="${sage}" d="${parts.filter(p => p.sage).map(p => p.d).join('')}"/></svg>`;
let cells = '';
for (const [n, def] of Object.entries(D)) {
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(build(def, 132, 120, 98, 17), '#2D2D2D', '#6FAF8E'));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(build(def, 132, 122, 76, 15), '#FAFAF8', '#6FAF8E', '#2D2D2D'));
  cells += `<div class="c"><img src="${n}.svg" width="150"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 600 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
