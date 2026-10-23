// Builds the dee-min templates from a few parameters.
import fs from 'fs';
const OUT = '/Users/titus/repos/colognewebsite/designs/logos/dee-min';
fs.mkdirSync(OUT, { recursive: true });
const P = JSON.parse(process.argv[2] || '{}');
const f = n => +(+n).toFixed(2);
const W = P.w ?? 24;
// Uppercase: one continuous line. Starts at the top arm's terminal, runs right, round bowl, back along
// the base, rounded heel, up the stem, and stops short of the top-left corner (the one opening).
function upper() {
  const L = P.L ?? 67, T = P.T ?? 50, B = P.B ?? 206, rc = P.rc ?? 36, xr = P.xr ?? 193;
  const k = P.k ?? 0.5523, da = P.da ?? 30, ds = P.ds ?? 30;
  const h = (B - T) / 2, M = (T + B) / 2, a = P.a ?? h, xs = xr - a;
  return `M${f(L + da)} ${T}H${f(xs)}C${f(xs + k * a)} ${T} ${xr} ${f(M - k * h)} ${xr} ${M}C${xr} ${f(M + k * h)} ${f(xs + k * a)} ${B} ${f(xs)} ${B}H${f(L + rc)}A${rc} ${rc} 0 0 1 ${L} ${f(B - rc)}V${f(T + ds)}`;
}
// Lowercase: one continuous line. Starts at the bowl's top terminal, runs anticlockwise round the bowl,
// flows tangentially into the stem at the bowl's right edge and rises as the ascender.
function lower() {
  const bx = P.bx ?? 123, by = P.by ?? 152, r = P.r ?? 52, asc = P.asc ?? 48, th = (P.th ?? 72) * Math.PI / 180;
  const tx = f(bx + r * Math.cos(th)), ty = f(by - r * Math.sin(th));
  return `M${tx} ${ty}A${r} ${r} 0 1 0 ${f(bx + r)} ${by}V${asc}`;
}
const svg = (label, d) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Divi">
  <title>Divi</title>
  <!-- dee-min / ${label}: the Cologne C's round-capped stroke, drawn as a single line with one opening. -->
  <defs>
    <linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%TILE_A%"/>
      <stop offset="1" stop-color="%TILE_B%"/>
    </linearGradient>
    <linearGradient id="ink" x1="${P.gx1 ?? 58}" y1="${P.gy1 ?? 214}" x2="${P.gx2 ?? 200}" y2="${P.gy2 ?? 44}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%INK_A%"/>
      <stop offset="1" stop-color="%INK_B%"/>
    </linearGradient>
  </defs>
  <rect id="tile" width="256" height="256" fill="url(#tile-g)"/>
  <path d="${d}" fill="none" stroke="url(#ink)" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
fs.writeFileSync(`${OUT}/upper.tmpl.svg`, svg('uppercase D', upper()));
fs.writeFileSync(`${OUT}/lower.tmpl.svg`, svg('lowercase d', lower()));
console.log(upper()); console.log(lower());
