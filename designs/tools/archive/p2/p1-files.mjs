import fs from 'fs';
import { bubble, reach, bbox, P1 } from './p1.mjs';
import { divi } from './npm/wordmark.mjs';
import { f } from './geo.mjs';

const DIR = '/Users/titus/repos/colognewebsite/designs/logos/portion-1';
fs.mkdirSync(DIR, { recursive: true });
const K = '#2D2D2D', S = '#6FAF8E', SL = '#8CC4A5', W = '#FFFFFF', OW = '#FAFAF8';
const head = (vb, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}"><title>${label}</title>`;
const paths = (parts, ink, sage) => {
  // merge all non-sage slices into one path, sage slice separate
  const a = parts.filter(p => !p.sage).map(p => p.d).join('');
  const b = parts.filter(p => p.sage).map(p => p.d).join('');
  if (ink === sage) return `<path fill="${ink}" d="${a}${b}"/>`;
  return `<path fill="${ink}" d="${a}"/><path fill="${sage}" d="${b}"/>`;
};

// Actual drawn extents: the circle plus every path endpoint (the tail tip is clipped/filleted).
function extents(parts, cx, cy, R) {
  let x0 = cx - R, x1 = cx + R, y0 = cy - R, y1 = cy + R;
  for (const p of parts) for (const m of p.d.matchAll(/([ML])([-\d.]+) ([-\d.]+)|A[-\d.]+ [-\d.]+ 0 [01] [01] ([-\d.]+) ([-\d.]+)/g)) {
    const x = +(m[2] ?? m[4]), y = +(m[3] ?? m[5]);
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  return { x0, x1, y0, y1 };
}
// centre the drawn silhouette on (128,128); `nudge` moves it down toward the circle's own centre (optical mass)
function centred(R, G, nudge = 0) {
  const probe = bubble(0, 0, R, G), e = extents(probe, 0, 0, R);
  const cx = 128 - (e.x0 + e.x1) / 2, cy = 128 - (e.y0 + e.y1) / 2 + nudge;
  return { cx, cy, parts: bubble(cx, cy, R, G), e: { x0: e.x0 + cx, x1: e.x1 + cx, y0: e.y0 + cy, y1: e.y1 + cy } };
}

// ---- mark: fit silhouette, optically centred ---------------------------------
const MR = 100, MG = 17;
let bb;
const M = centred(MR, MG, 2);
const mark = M.parts;
fs.writeFileSync(`${DIR}/mark.svg`, head('0 0 256 256', 'Divi') + paths(mark, K, S) + '</svg>\n');
fs.writeFileSync(`${DIR}/mark-mono.svg`, head('0 0 256 256', 'Divi') + paths(mark, W, W) + '</svg>\n');

// ---- app icon: full-bleed charcoal tile, silhouette inside the inscribed circle --
const AR = 84, AG = 15;
// shift the circle up/right so the silhouette (circle + tail) balances on the tile centre
const A = centred(AR, AG, 2);
const app = A.parts, acx = A.cx, acy = A.cy;
const appReach = Math.max(Math.hypot(A.e.x0 - 128, A.e.y1 - 128) * 0, ...[...app.map(p => p.d).join('').matchAll(/([-\d.]+) ([-\d.]+)(?=[MLAZ]|$)/g)].map(m => Math.hypot(+m[1] - 128, +m[2] - 128)), reach(acx, acy, AR, 128, 128, { ...P1, tail: { ...P1.tail, depth: 0 } }));
fs.writeFileSync(`${DIR}/app-icon.svg`, head('0 0 256 256', 'Divi') + `<rect width="256" height="256" fill="${K}"/>` + paths(app, OW, S) + '</svg>\n');

// ---- site icon: no tile, white + sage, sits on the darkened photo -------------
const SR = 103, SG = 18;
const site = centred(SR, SG, 2).parts;
fs.writeFileSync(`${DIR}/site-icon.svg`, head('0 0 256 256', 'Divi') + paths(site, W, SL) + '</svg>\n');

// ---- lockups -------------------------------------------------------------------
const CAP = 100;               // cap height of DIVI
const LR = 0.74 * CAP;         // bubble radius relative to caps
const LG = 0.17 * LR;
const pad = 24;
bb = bbox(0, 0, LR);
// circle centre on the cap-height midline; silhouette left edge at pad
const lcx = pad - bb.x0, lcy = CAP / 2 - 2;
const lock = bubble(lcx, lcy, LR, LG);
const wmX = lcx + LR + 0.50 * CAP;  // ink of D starts here
const w = divi(CAP, 0, CAP);
const shift = wmX - w.ink.x0;
const wm = divi(CAP, shift, CAP);
const top = Math.min(lcy - LR, 0) - pad, bottom = Math.max(lcy + bbox(0, 0, LR).y1, CAP) + pad;
const width = wm.ink.x1 + pad;
const vb = `0 ${f(top)} ${f(width)} ${f(bottom - top)}`;
fs.writeFileSync(`${DIR}/lockup.svg`, head(vb, 'Divi') + paths(lock, K, S) + `<path fill="${K}" d="${wm.d}"/></svg>\n`);
fs.writeFileSync(`${DIR}/lockup-reverse.svg`, head(vb, 'Divi') + paths(lock, W, S) + `<path fill="${W}" d="${wm.d}"/></svg>\n`);

console.log('mark extents', JSON.stringify(Object.fromEntries(Object.entries(M.e).map(([k, v]) => [k, +v.toFixed(1)])))); console.log('app reach', appReach.toFixed(1), 'circle-crop margin', (128 - appReach).toFixed(1));
