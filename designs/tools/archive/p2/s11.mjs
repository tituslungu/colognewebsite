import fs from 'fs';
import { createRequire } from 'module';
import { half, piecePath, f } from './geo.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/s11';
fs.mkdirSync(OUT, { recursive: true });
const pick = (x, y, a, g, pt) => { let h = half(x, y, a, 1, g / 2); const hh = half(x, y, a, 1, 0); if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2); return h; };
const mk = (px, py, nx, ny, side) => { const l = Math.hypot(nx, ny); nx /= l; ny /= l; return { kind: 'line', n: [nx, ny], d: nx * px + ny * py, outer: true, side }; };
const G = 16;
// receipt: x0..x1, y0 top, bottom zigzag between yb (valleys) and yb+tooth (peaks). Build bottom piece as union of convex parts: body above valley line + teeth triangles.
function receipt({ x0 = 68, x1 = 188, y0 = 28, yb = 206, teeth = 3, tooth = 22, gaps, sage = 1, rTop = 22 }) {
  const L = mk(x0, 0, 1, 0, 'L'), R = mk(x1, 0, -1, 0, 'R'), T = mk(0, y0, 0, 1, 'T'), Bv = mk(0, yb, 0, -1, 'B');
  const above = [128, -999], below = [128, 999];
  const gs = gaps.map(([y, a]) => t => pick(128, y, a, G, t));
  const parts = [];
  for (let k = 0; k <= gs.length; k++) {
    const cs = [L, R];
    if (k === 0) cs.push(T);
    if (k > 0) cs.push(gs[k - 1](below));
    if (k < gs.length) cs.push(gs[k](above)); else cs.push(Bv);
    const d = piecePath(cs, (A, B) => (A.side === 'T' || B.side === 'T') && (A.side && B.side) ? rTop : (A.side === 'B' || B.side === 'B') ? 0 : 6);
    parts.push({ d, f: k === sage ? 's' : 'k' });
  }
  // teeth: triangles hanging below yb; pointing down
  const w = (x1 - x0) / teeth;
  let tz = '';
  for (let i = 0; i < teeth; i++) {
    const a = x0 + i * w, b = a + w, m = (a + b) / 2, rt = 3;
    tz += `M${f(a)} ${f(yb - 1)}L${f(b)} ${f(yb - 1)}L${f(m)} ${f(yb + tooth)}Z`;
  }
  parts[parts.length - 1].d += tz;
  return parts;
}
const S = {};
S.r1 = () => receipt({ gaps: [[80, -5], [134, 4]] });
S.r2 = () => receipt({ gaps: [[74, 5], [140, -4]] });
S.r3 = () => receipt({ gaps: [[92, -6], [138, -1]], sage: 1 });
S.r4 = () => receipt({ gaps: [[70, -4], [118, 3], [160, -3]], sage: 2 });
S.r5 = () => receipt({ x0: 60, x1: 196, gaps: [[86, -7], [146, 5]], sage: 1, teeth: 4, tooth: 18 });
S.r6 = () => receipt({ gaps: [[100, -5], [150, 4]], sage: 0 });
const svg = (parts, ink, sage, bg, sc = 1) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<g transform="translate(${128 - 128 * sc} ${128 - 128 * sc}) scale(${sc})"><path fill="${ink}" d="${parts.filter(p => p.f === 'k').map(p => p.d).join('')}"/><path fill="${sage}" d="${parts.filter(p => p.f === 's').map(p => p.d).join('')}"/></g></svg>`;
let cells = '';
for (const n of Object.keys(S)) {
  const parts = S[n]();
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(parts, '#2D2D2D', '#6FAF8E'));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(parts, '#FAFAF8', '#6FAF8E', '#2D2D2D', 0.74));
  cells += `<div class="c"><img src="${n}.svg" width="170"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 400 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
