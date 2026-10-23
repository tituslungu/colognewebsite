import fs from 'fs';
import { itemised, P2 } from './p2.mjs';
import { divi } from './npm/wordmark.mjs';
import { f } from './geo.mjs';

const DIR = '/Users/titus/repos/colognewebsite/designs/logos/portion-2';
fs.mkdirSync(DIR, { recursive: true });
const K = '#2D2D2D', S = '#6FAF8E', SL = '#8CC4A5', W = '#FFFFFF', OW = '#FAFAF8';
const head = (vb, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}"><title>${label}</title>`;
const paths = (parts, ink, sage) => {
  const a = parts.filter(p => !p.sage).map(p => p.d).join('');
  const b = parts.filter(p => p.sage).map(p => p.d).join('');
  if (ink === sage) return `<path fill="${ink}" d="${a}${b}"/>`;
  return `<path fill="${ink}" d="${a}"/><path fill="${sage}" d="${b}"/>`;
};
const totalH = Wd => (P2.h + P2.tail.d) * Wd;
// place so the silhouette's bbox is centred on (cx, cy), nudged up by `up`
const place = (Wd, G, cx = 128, cy = 128, up = 0) => itemised(cx - Wd / 2, cy - totalH(Wd) / 2 - up, Wd, G).parts;
// farthest silhouette point from (128,128) when centred
function reach(Wd, up = 0) {
  const x0 = 128 - Wd / 2, y0 = 128 - totalH(Wd) / 2 - up, H = P2.h * Wd, rc = P2.r * Wd;
  const corners = [[x0 + rc, y0 + rc], [x0 + Wd - rc, y0 + rc], [x0 + Wd - rc, y0 + H - rc], [x0 + rc, y0 + H - rc]];
  let m = Math.max(...corners.map(c => Math.hypot(c[0] - 128, c[1] - 128) + rc));
  const tip = [x0 + P2.tail.tx * Wd, y0 + H + P2.tail.d * Wd];
  return Math.max(m, Math.hypot(tip[0] - 128, tip[1] - 128));
}

// mark
const mark = place(200, 15, 128, 128, 1.5);
fs.writeFileSync(`${DIR}/mark.svg`, head('0 0 256 256', 'Divi') + paths(mark, K, S) + '</svg>\n');
fs.writeFileSync(`${DIR}/mark-mono.svg`, head('0 0 256 256', 'Divi') + paths(mark, W, W) + '</svg>\n');
// app icon
const AW = 162, AG = 14;
const app = place(AW, AG, 128, 128, 1);
fs.writeFileSync(`${DIR}/app-icon.svg`, head('0 0 256 256', 'Divi') + `<rect width="256" height="256" fill="${K}"/>` + paths(app, OW, S) + '</svg>\n');
// site icon (photo band): white + light sage, no tile
const site = place(208, 16, 128, 128, 1);
fs.writeFileSync(`${DIR}/site-icon.svg`, head('0 0 256 256', 'Divi') + paths(site, W, SL) + '</svg>\n');
// lockups
const CAP = 100, pad = 24;
const LW = 1.30 * CAP, LG = 0.075 * LW;
const ly0 = CAP / 2 - (P2.h * LW) / 2 - 2; // body centred on the cap-height midline
const lock = itemised(pad, ly0, LW, LG).parts;
const wmX = pad + LW + 0.42 * CAP;
const w0 = divi(CAP, 0, CAP), wm = divi(CAP, wmX - w0.ink.x0, CAP);
const top = Math.min(ly0, 0) - pad, bottom = Math.max(ly0 + totalH(LW), CAP) + pad, width = wm.ink.x1 + pad;
const vb = `0 ${f(top)} ${f(width)} ${f(bottom - top)}`;
fs.writeFileSync(`${DIR}/lockup.svg`, head(vb, 'Divi') + paths(lock, K, S) + `<path fill="${K}" d="${wm.d}"/></svg>\n`);
fs.writeFileSync(`${DIR}/lockup-reverse.svg`, head(vb, 'Divi') + paths(lock, W, S) + `<path fill="${W}" d="${wm.d}"/></svg>\n`);
console.log('app reach', reach(AW, 1).toFixed(1), 'margin', (128 - reach(AW, 1)).toFixed(1));
