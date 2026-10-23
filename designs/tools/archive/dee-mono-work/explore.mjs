// Exploration: render several single-stroke D / d candidates side by side at 150 / 40 (circle) / 16.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/dee-mono-work';

const f = n => +n.toFixed(2);
const W = +(process.env.W || 22);

// Uppercase D, gap at top-left. xs stem x, yt/yb top/bottom centreline, k straight run, rc bottom-left corner radius, gapEnd x where top line stops.
function upperA({ xs, yt, yb, k, rc, gap, w = W, topRc = 0 }) {
  const R = (yb - yt) / 2, xc = xs + k, ym = (yt + yb) / 2;
  const endX = xs + gap; // top line ends here
  return `<path d="M${xs} ${yt} V${yb - rc} A${rc} ${rc} 0 0 0 ${xs + rc} ${yb} H${xc} A${R} ${R} 0 0 0 ${xc} ${yt} H${f(endX)}" fill="none" stroke="url(#ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// Uppercase D, gap at top-left, stem starts lower (gap is vertical).
function upperB({ xs, yt, yb, k, rc, gap, w = W }) {
  const R = (yb - yt) / 2, xc = xs + k;
  // corner at top-left rounded but stroke stops: top line runs to xs+rc then arcs down and stops after gap.
  return `<path d="M${xs} ${yt + gap} V${yb - rc} A${rc} ${rc} 0 0 0 ${xs + rc} ${yb} H${xc} A${R} ${R} 0 0 0 ${xc} ${yt} H${xs + rc}" fill="none" stroke="url(#ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// Uppercase D with hairpin at top-left: top line heading west hairpins down-and-back into the counter.
function upperH({ xs, yt, yb, k, rc, hp, run, w = W }) {
  const R = (yb - yt) / 2, xc = xs + k;
  // stem from bottom up: start at bottom-left? we start at stem top.
  return `<path d="M${xs} ${yt} V${yb - rc} A${rc} ${rc} 0 0 0 ${xs + rc} ${yb} H${xc} A${R} ${R} 0 0 0 ${xc} ${yt} H${xs + run + hp} A${hp} ${hp} 0 0 0 ${xs + run + hp} ${yt + 2 * hp} H${xs + run + hp + 14}" fill="none" stroke="url(#ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// Lowercase d: circle bowl (cx,cy,r), stem tangent at right, from ascender yA. Gap: bowl starts at angle th (deg above +x).
function lowerCircle({ cx, cy, r, yA, th, w = W, foot = false }) {
  const a = th * Math.PI / 180;
  const sx = cx + r * Math.cos(a), sy = cy - r * Math.sin(a);
  // from start, CCW visually (sweep 0) around left to the bottom, then to the right point (cx+r, cy) then up.
  // Two arcs: start -> bottom (cx, cy+r) [large if > 180], bottom -> right.
  let d = `M${f(sx)} ${f(sy)} A${r} ${r} 0 ${th > 0 ? 1 : 0} 0 ${cx} ${cy + r}`;
  if (foot) d += ` A${r} ${r} 0 0 0 ${cx + r} ${cy} V${yA}`;
  else d += ` A${r} ${r} 0 0 0 ${cx + r} ${cy} V${yA}`;
  return `<path d="${d}" fill="none" stroke="url(#ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// Lowercase d with stem to baseline: bowl arcs CCW from gap to bottom, then a tighter corner rc into the stem at baseline.
function lowerFoot({ cx, cy, r, yA, th, rc, w = W }) {
  const a = th * Math.PI / 180;
  const sx = cx + r * Math.cos(a), sy = cy - r * Math.sin(a);
  const xr = cx + r, yb = cy + r;
  // start -> left -> bottom point (cx, yb), straight to xr - rc, corner up, stem to yA
  const d = `M${f(sx)} ${f(sy)} A${r} ${r} 0 ${th > 0 ? 1 : 0} 0 ${cx} ${yb} H${xr - rc} A${rc} ${rc} 0 0 0 ${xr} ${yb - rc} V${yA}`;
  return `<path d="${d}" fill="none" stroke="url(#ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const defs = (A, B, IA, IB) => `<defs><linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="${B}"/></linearGradient><linearGradient id="ink" x1="56" y1="214" x2="204" y2="46" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${IA}"/><stop offset="1" stop-color="${IB}"/></linearGradient></defs>`;
const svg = (body, cw) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${defs(...cw)}<rect id="tile" width="256" height="256" fill="url(#tile-g)"/>${body}</svg>`;
const BLUE = ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'];
const DARK = ['#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD'];
const CHAR = ['#FFFFFF', '#FFFFFF', '#2D2D2D', '#2D2D2D'];

const cands = JSON.parse(process.env.CANDS || 'null') || [
  ['U-A gap top', upperA({ xs: 66, yt: 53, yb: 203, k: 50, rc: 22, gap: 34 })],
  ['U-B gap vert', upperB({ xs: 66, yt: 53, yb: 203, k: 50, rc: 22, gap: 34 })],
  ['U-H hairpin', upperH({ xs: 66, yt: 53, yb: 203, k: 50, rc: 22, hp: 16, run: 14 })],
  ['l-circle', lowerCircle({ cx: 122, cy: 158, r: 46, yA: 52, th: 62 })],
  ['l-foot', lowerFoot({ cx: 122, cy: 158, r: 46, yA: 52, th: 62, rc: 24 })],
];

const html = `<!doctype html><html><body style="margin:0;background:#f2f3f1;font:12px sans-serif">
${cands.map(([name, body]) => `<div style="display:flex;gap:14px;align-items:center;padding:8px 14px">
  <span style="width:90px">${name}</span>
  ${[BLUE, DARK, CHAR].map(cw => { const s = 'data:image/svg+xml;base64,' + Buffer.from(svg(body, cw)).toString('base64'); return `<img src="${s}" width="150" height="150" style="border-radius:30px"><img src="${s}" width="40" height="40" style="border-radius:50%"><img src="${s}" width="16" height="16" style="border-radius:3px">`; }).join('')}
</div>`).join('')}</body></html>`;
fs.writeFileSync(OUT + '/explore.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 860, height: 200 }, deviceScaleFactor: 1 });
await p.setContent(html);
await p.waitForTimeout(200);
await p.screenshot({ path: OUT + '/' + (process.env.NAME || 'explore') + '.png', fullPage: true });
await b.close();
console.log('ok');
