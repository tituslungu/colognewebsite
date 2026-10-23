import fs from 'fs';
const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
// clockwise (on screen) arc from angle a0 down to a1 (a0 > a1)
const cw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
// counter-clockwise (on screen) arc from a0 up to a1 (a1 > a0)
const ccw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}`; };
export const V = {};
// Uppercase stencil: stem + arc that overshoots 90 by d degrees, visible gap g
function U(R, cx, cy, d, g, stemExt = 0) { const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 - g); return `<path d="M${s} ${P(ey - stemExt)}V${P(2 * cy - ey + stemExt)}"/><path d="${cw(cx, cy, R, 90 + d, -90 - d)}"/>`; }
V['U-C d8 g14'] = U(86, 116, 128, 8, 14);
V['U-C d14 g14'] = U(86, 118, 128, 14, 14);
V['U-C d20 g14'] = U(86, 120, 128, 20, 14);
V['U-C d14 g10'] = U(86, 116, 128, 14, 10);
// Uppercase closed geometric: semicircle + stem as diameter
V['U-G closed'] = `<path d="M70 44V212"/><path d="${cw(110, 128, 84, 90, -90)}H70M110 44H70"/>`;
// Lowercase stencil with small gaps
function Ls(r, bx, by, mu, g, top = 40) { const [tx] = pt(bx, by, r, mu); const sx = P(tx + 24 + g); return `<path d="${ccw(bx, by, r, mu, 360 - mu)}"/><path d="M${sx} ${top}V${by + r}"/>`; }
V['L-E c68 g8'] = Ls(56, 114, 150, 68, 8);
V['L-E c62 g6'] = Ls(56, 114, 150, 62, 6);
// Lowercase "C + stem chord": stem passes through the C's terminal centres
function Lc(r, bx, by, mu, top = 40, foot = 'base') { const [tx, ty] = pt(bx, by, r, mu); const sx = tx; const bot = foot === 'base' ? by + r : 2 * by - ty; return `<path d="${ccw(bx, by, r, mu, 360 - mu)}"/><path d="M${sx} ${top}V${P(bot)}"/>`; }
V['L-F C45 chord'] = Lc(58, 112, 150, 45);
V['L-F C35 chord'] = Lc(58, 108, 150, 35);
V['L-F C45 chord shortfoot'] = Lc(58, 112, 150, 45, 40, 'term');
// Uppercase reversed-C + stem chord (closed, stem through terminals)
function Uc(R, cx, cy, phi, ext) { const [tx, ty] = pt(cx, cy, R, 180 - phi); return `<path d="${cw(cx, cy, R, 180 - phi, -180 + phi)}"/><path d="M${tx} ${P(ty - ext)}V${P(2 * cy - ty + ext)}"/>`; }
V['U-H revC chord'] = Uc(88, 124, 128, 60, 0);
