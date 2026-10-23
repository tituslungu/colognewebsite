// Builds a comparison page of candidate D/d constructions.
import fs from 'fs';
const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
// arc from angle a0 to a1 (degrees, math orientation, y up) going clockwise-on-screen if cw
function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
  const sweepDeg = a0 - a1; // decreasing angle = clockwise on screen (y down)
  const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
  const sweep = sweepDeg > 0 ? 1 : 0;
  return `M${x0} ${y0}A${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`;
}
const SW = 24;
const V = {
  // uppercase
  'U-A current': `<path d="M94 43H114C159.84 43 197 80.16 197 126C197 171.84 159.84 209 114 209H101A38 38 0 0 1 63 171V74"/>`,
  'U-B semicircle g16': (() => { const T = 44, B = 212, R = (B - T) / 2, cy = (T + B) / 2, s = 66, cx = s + 24 + 16; return `<path d="M${s} ${T}V${B}"/><path d="${arc(cx, cy, R, 90, -90)}"/>`; })(),
  'U-B2 semicircle g12': (() => { const T = 44, B = 212, R = (B - T) / 2, cy = (T + B) / 2, s = 68, cx = s + 24 + 12; return `<path d="M${s} ${T}V${B}"/><path d="${arc(cx, cy, R, 90, -90)}"/>`; })(),
  'U-C arc+12deg': (() => { const R = 86, cy = 128, cx = 116, d = 12; const [ex, ey] = pt(cx, cy, R, 90 + d); const s = ex - 24 - 14; return `<path d="M${P(s)} ${ey}V${P(2 * cy - ey)}"/><path d="${arc(cx, cy, R, 90 + d, -90 - d)}"/>`; })(),
  'U-D arms': (() => { const T = 44, B = 212, R = (B - T) / 2, cy = (T + B) / 2, s = 62, cx = 126; return `<path d="M${s} ${T}V${B}"/><path d="M${s + 24 + 14} ${T}H${cx}${arc(cx, cy, R, 90, -90).replace(/^M[^A]+/, '')}H${s + 24 + 14}"/>`; })(),
  // lowercase
  'L-A current': `<path d="M135.02 95.16A53 53 0 1 0 177 147V44"/>`,
  'L-C c75 tangent': (() => { const r = 54, bx = 118, by = 152, mu = 75; const sx = bx + r; return `<path d="${arc(bx, by, r, mu, -mu + 360 - 360)}".replace/><path d="M${sx} 40V${by + r}"/>`; })(),
};
// fix L-C: arc from mu going counter-clockwise (increasing angle) to 360-mu
function cArc(bx, by, r, mu) { const [x0, y0] = pt(bx, by, r, mu), [x1, y1] = pt(bx, by, r, 360 - mu); return `M${x0} ${y0}A${r} ${r} 0 1 0 ${x1} ${y1}`; }
function lowerC(r, bx, by, mu, gap, top = 40, foot = true) {
  const [tx] = pt(bx, by, r, mu); const sx = P(tx + 24 + gap);
  return `<path d="${cArc(bx, by, r, mu)}"/><path d="M${sx} ${top}V${foot ? by + r : by}"/>`;
}
V['L-C c75 tangent'] = lowerC(54, 116, 150, 75, 16);
V['L-C2 c68'] = lowerC(54, 116, 150, 68, 16);
V['L-C3 c60'] = lowerC(54, 116, 150, 60, 16);
V['L-D cologne c45'] = lowerC(54, 112, 150, 45, 14);
const CW = [
  ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'],
  ['#FFFFFF', '#FFFFFF', '#2D2D2D', '#2D2D2D'],
  ['#6FAF8E', '#3E7A5B', '#FFFFFF', '#FFFFFF'],
  ['#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD'],
];
let n = 0;
const svg = (body, cw) => { n++; return `<svg viewBox="0 0 256 256"><defs><linearGradient id="t${n}" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${cw[0]}"/><stop offset="1" stop-color="${cw[1]}"/></linearGradient><linearGradient id="i${n}" x1="48" y1="200" x2="214" y2="60" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${cw[2]}"/><stop offset="1" stop-color="${cw[3]}"/></linearGradient></defs><rect width="256" height="256" fill="url(#t${n})"/><g fill="none" stroke="url(#i${n})" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`; };
const sizes = [150, 64, 40, 16];
let html = `<!doctype html><html><body style="margin:0;background:#f2f3f1;font:600 12px Helvetica"><table style="border-spacing:10px 6px">`;
for (const [k, body] of Object.entries(V)) {
  html += `<tr><th style="text-align:left;width:120px">${k}</th>`;
  for (const cw of CW.slice(0, 2)) for (const s of sizes) html += `<td><div style="width:${s}px;height:${s}px;border-radius:${s >= 40 ? (s === 40 ? '50%' : s * .2 + 'px') : '3px'};overflow:hidden">${svg(body, cw).replace('<svg', `<svg width="${s}" height="${s}"`)}</div></td>`;
  for (const cw of CW.slice(2)) for (const s of [64, 40, 16]) html += `<td><div style="width:${s}px;height:${s}px;border-radius:${s === 40 ? '50%' : s * .2 + 'px'};overflow:hidden">${svg(body, cw).replace('<svg', `<svg width="${s}" height="${s}"`)}</div></td>`;
  html += `</tr>`;
}
html += `</table></body></html>`;
fs.writeFileSync(process.argv[2], html);
