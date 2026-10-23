// Builds designs/logos/dee-mono/{upper,lower}.tmpl.svg from a few parameters and reports geometry checks.
import fs from 'fs';
const DIR = process.env.OUT || '/Users/titus/repos/colognewebsite/designs/logos/dee-mono';
fs.mkdirSync(DIR, { recursive: true });
const P = JSON.parse(process.env.P || '{}');
const W = P.w ?? 22;              // stroke weight (Cologne C is ~22/256)
const f = n => +n.toFixed(2);

// ---------- Uppercase D ----------
// Stem at x = xs; bowl = circle centre (xs + d, cy) radius R, cut by the stem; fillet rho at bottom-left;
// the stroke starts at the top of the stem, runs down, turns through the fillet, sweeps round the bowl
// and stops gapDeg short of where it would meet the stem again (the "not quite closing" signature).
const U = { xs: 62, cy: 128, R: 82, d: 40, rho: 26, gapDeg: 27, dx: 0, dy: 0, ...P.U };
function upper() {
  const { xs, cy, R, d, rho, gapDeg } = U;
  const cx = xs + d, h = Math.sqrt(R * R - d * d);
  const yf = cy + Math.sqrt((R - rho) ** 2 - (d - rho) ** 2);
  const Fx = xs + rho, Fy = yf, k = R / (R - rho);
  const Tx = cx + (Fx - cx) * k, Ty = cy + (Fy - cy) * k;
  const aTop = Math.atan2(-h, xs - cx);
  const aEnd = aTop + gapDeg * Math.PI / 180;
  const Ex = cx + R * Math.cos(aEnd), Ey = cy + R * Math.sin(aEnd);
  const yS = cy - h + (U.stemDrop ?? 0);
  const path = `M${f(xs)} ${f(yS)}V${f(yf)}A${rho} ${rho} 0 0 0 ${f(Tx)} ${f(Ty)}A${R} ${R} 0 1 0 ${f(Ex)} ${f(Ey)}`;
  // geometry samples for checks
  const pts = [];
  for (let y = yS; y <= yf; y += 1) pts.push([xs, y]);
  const a0 = Math.atan2(Ty - cy, Tx - cx);
  // travel CCW visually = decreasing screen angle from a0 down to aEnd (wrapping)
  let a1 = aEnd; while (a1 > a0) a1 -= 2 * Math.PI;
  for (let a = a0; a >= a1; a -= 0.01) pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
  const gap = Math.hypot(Ex - xs, Math.max(0, yS - Ey)) - W; // end cap to stem (stem top is below/at Ey?)
  const gapToStemTop = Math.hypot(Ex - xs, Ey - yS) - W;
  return { path, pts, ends: [[xs, yS], [Ex, Ey]], gap: Math.min(gap, gapToStemTop), info: { cx, h, yS, yf, Ex: f(Ex), Ey: f(Ey) } };
}

// ---------- Lowercase d ----------
// Bowl = circle centre (cx, cy) radius r; the stem is tangent to it on the right and rises to the
// ascender yA. The stroke starts at the top of the ascender, runs down the stem, flows into the bowl
// at mid-height, goes round underneath and up the left, and stops short of the stem at the top right.
const L = { cx: 116, cy: 158, r: 48, yA: 50, th: 78, ...P.L };
function lower() {
  const { cx, cy, r, yA, th } = L;
  const a = th * Math.PI / 180;
  const sx = cx + r * Math.cos(a), sy = cy - r * Math.sin(a);
  const xr = cx + r;
  // drawn from the ascender down, then clockwise (sweep 1) round the bowl: right -> bottom -> left -> top -> gap
  const path = `M${f(xr)} ${f(yA)}V${f(cy)}A${r} ${r} 0 1 1 ${f(sx)} ${f(sy)}`;
  const pts = [];
  for (let y = yA; y <= cy; y += 1) pts.push([xr, y]);
  for (let t = 0; t <= 2 * Math.PI - a; t += 0.01) pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  const gap = (xr - sx) - W; // horizontal distance from start cap to stem (stem passes at that height)
  return { path, pts, ends: [[xr, yA], [sx, sy]], gap, info: { sx: f(sx), sy: f(sy) } };
}

function bbox(pts) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { x0: Math.min(...xs) - W / 2, x1: Math.max(...xs) + W / 2, y0: Math.min(...ys) - W / 2, y1: Math.max(...ys) + W / 2 };
}
function report(name, g) {
  const b = bbox(g.pts);
  const maxR = Math.max(...g.pts.map(([x, y]) => Math.hypot(x - 128, y - 128))) + W / 2;
  const cxb = (b.x0 + b.x1) / 2, cyb = (b.y0 + b.y1) / 2;
  // stroke-area centroid (uniform stroke -> centroid of centreline samples by arc length approx)
  let sx = 0, sy = 0, n = 0; for (const [x, y] of g.pts) { sx += x; sy += y; n++; }
  console.log(name, JSON.stringify({ bbox: [f(b.x0), f(b.y0), f(b.x1), f(b.y1)], w: f(b.x1 - b.x0), h: f(b.y1 - b.y0), bboxCentre: [f(cxb), f(cyb)], massCentre: [f(sx / n), f(sy / n)], maxRadius: f(maxR), visibleGap: f(g.gap), ...g.info }));
}

// Shared defs. The ink gradient runs from the letter's lower-left (deep) to its upper-right (light),
// like the Cologne C; the tile is a soft top-to-bottom wash.
const tpl = (title, path, ink, note) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <title>${title}</title>
  <!-- ${note} -->
  <defs>
    <linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%TILE_A%"/>
      <stop offset="1" stop-color="%TILE_B%"/>
    </linearGradient>
    <linearGradient id="ink" x1="${ink[0]}" y1="${ink[1]}" x2="${ink[2]}" y2="${ink[3]}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%INK_A%"/>
      <stop offset="1" stop-color="%INK_B%"/>
    </linearGradient>
  </defs>
  <rect id="tile" width="256" height="256" fill="url(#tile-g)"/>
  <path d="${path}" fill="none" stroke="url(#ink)" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"${P.tx || P.ty ? '' : ''}/>
</svg>
`;

const u = upper(), l = lower();
report('upper', u); report('lower', l);
const inkU = P.inkU ?? [58, 210, 200, 48];
const inkL = P.inkL ?? [66, 212, 178, 46];
fs.writeFileSync(DIR + '/upper.tmpl.svg', tpl('Divi - minimal D (uppercase)', u.path, inkU, `One ${W}-unit round-capped stroke: down the stem, round the bowl (a circle of radius ${U.R} cut by the stem), stopping one gap short of the stem top - the Cologne C's open mouth kept as the single signature.`));
fs.writeFileSync(DIR + '/lower.tmpl.svg', tpl('Divi - minimal d (lowercase)', l.path, inkL, `One ${W}-unit round-capped stroke: down the ascender, into a round bowl (radius ${L.r}) tangent to the stem, round underneath and over the top, stopping one gap short of the stem.`));
console.log('wrote templates');
