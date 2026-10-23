// Build a concept's SVG set into designs/logos/<id>/.
// Usage: node make.mjs <id> [params-json]
import fs from 'fs';
import path from 'path';
import { concepts } from './concepts.mjs';
import { build, stats, fit, C } from './lib.mjs';
import { toPath, tfm } from './geo.mjs';
import { wordmark } from './wordmark.mjs';

const id = process.argv[2];
const pfile = new URL(`./params/${id}.json`, import.meta.url);
const params = process.argv[3] ? JSON.parse(process.argv[3]) : fs.existsSync(pfile) ? JSON.parse(fs.readFileSync(pfile, 'utf8')) : {};
const def = concepts[id](params.shape || {});
const pcs = build(def);
const st = stats(pcs);
const L = params.layout || {};

const shares = st.areas.map(a => ((a / st.area) * 100).toFixed(1) + '%');
for (const [i, p] of pcs.entries()) {
  const arcs = p.segs.filter(s => s.t === 'A').map(s => (2 * s.r * Math.sin(Math.abs(s.a1 - s.a0) / 2)).toFixed(1));
  console.log('  piece', i, p.role, 'arc chords', arcs.join(', '));
}
console.log(id, 'shares', shares.join(' / '), 'roles', pcs.map(p => p.role).join(','));

const head = (vb, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}"><title>${label}</title>`;
const byRole = (tf, fills) => {
  const groups = {};
  for (const p of pcs) (groups[p.role] ||= []).push(toPath(p.segs, tf));
  return Object.entries(groups).map(([role, ds]) => `<path fill="${fills[role]}" d="${ds.join('')}"/>`).join('');
};
const mono = (tf, fill) => `<path fill="${fill}" d="${pcs.map(p => toPath(p.segs, tf)).join('')}"/>`;

const LIGHT = { ink: C.char, sage: C.sage };
const DARK = { ink: C.off, sage: C.sage };

const files = {};
// mark: symbol alone, transparent; bbox max side = markSize, optically centred
const tfMark = fit(pcs, { mode: 'box', R: (L.markSize ?? 208) / 2, blend: L.markBlend ?? 0.5, dx: L.markDx ?? 0, dy: L.markDy ?? 0 });
files['mark.svg'] = head('0 0 256 256', 'Divi') + byRole(tfMark, LIGHT) + '</svg>';
files['mark-mono.svg'] = head('0 0 256 256', 'Divi') + mono(tfMark, C.white) + '</svg>';
// app icon: full-bleed charcoal tile, shape inside the inscribed circle
const tfApp = fit(pcs, { mode: 'tile', R: L.appR ?? 106, blend: L.appBlend ?? 0.6, dx: L.appDx ?? 0, dy: L.appDy ?? 0 });
files['app-icon.svg'] = head('0 0 256 256', 'Divi') + `<rect width="256" height="256" fill="${C.char}"/>` + byRole(tfApp, DARK) + '</svg>';
// site icon: light-on-photo mark, no tile, fills the square
const tfSite = fit(pcs, { mode: 'box', R: (L.siteSize ?? 236) / 2, blend: L.siteBlend ?? 0.5, dx: L.siteDx ?? 0, dy: L.siteDy ?? 0 });
files['site-icon.svg'] = head('0 0 256 256', 'Divi') + byRole(tfSite, DARK) + '</svg>';

// lockups: cap height 100; circle diameter = k * cap; circle centre on the
// cap middle (+ optical nudge); gap between circle and D = gapK * cap
{
  const cap = 100, k = L.lockK ?? 1.36, gapK = L.lockGap ?? 0.5, pad = L.lockPad ?? 24;
  const s = (k * cap) / 200; // r = 100 in normalised space
  const cy = cap / 2 + (L.lockDy ?? 0);
  // place circle centre at x = 0 for now
  const tf0 = tfm(s, 0, cy);
  const pts = pcs.flatMap(p => p.segs.length ? [] : []);
  const st0 = stats(pcs);
  const left = st0.bb.x0 * s, right = st0.bb.x1 * s, top = st0.bb.y0 * s + cy, bottom = st0.bb.y1 * s + cy;
  const wmX = right + gapK * cap;
  const wm = wordmark(wmX, 0, cap);
  const x0 = left - pad, y0 = Math.min(top, 0) - pad, x1 = wmX + wm.width + pad, y1 = Math.max(bottom, cap) + pad;
  const vb = `${(x0).toFixed(2)} ${(y0).toFixed(2)} ${(x1 - x0).toFixed(2)} ${(y1 - y0).toFixed(2)}`;
  files['lockup.svg'] = head(vb, 'Divi') + byRole(tf0, LIGHT) + `<path fill="${C.char}" d="${wm.d}"/>` + '</svg>';
  files['lockup-reverse.svg'] = head(vb, 'Divi') + byRole(tf0, DARK) + `<path fill="${C.white}" d="${wm.d}"/>` + '</svg>';
}

const dir = path.join('/Users/titus/repos/colognewebsite/designs/logos', id);
fs.mkdirSync(dir, { recursive: true });
for (const [n, s] of Object.entries(files)) fs.writeFileSync(path.join(dir, n), s + '\n');
// report placement facts for the app icon (circle-crop margin)
{
  const P = pcs.flatMap(p => (p.segs.length ? [] : []));
  const s = stats(pcs);
  const far = Math.max(...s.pts.map(([x, y]) => { const [X, Y] = tfApp([x, y]); return Math.hypot(X - 128, Y - 128); }));
  const c = tfApp([0, 0]);
  console.log('app: circle r', (100 * tfApp.scale).toFixed(1), 'centre', c.map(v => v.toFixed(1)).join(','), 'farthest from tile centre', far.toFixed(1), 'gap px@16', ((params.shape?.gap ?? 21) * tfApp.scale * 16 / 256).toFixed(2), 'gap px@40', ((params.shape?.gap ?? 21) * tfApp.scale * 40 / 256).toFixed(2));
}
console.log('wrote', Object.keys(files).join(' '));
