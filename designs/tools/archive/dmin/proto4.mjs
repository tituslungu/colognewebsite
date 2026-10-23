const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
const cw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
const ccw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}`; };
export const V = {};
function U(R, cx, cy, d, g) { const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 - g); return `<path d="M${s} ${ey}V${P(2 * cy - ey)}"/><path d="${cw(cx, cy, R, 90 + d, -90 - d)}"/>`; }
V['U-C stencil'] = U(86, 116, 128, 14, 10);
V['U-K kiss d14'] = U(86, 112, 128, 14, 0);
V['U-K kiss d24'] = U(86, 116, 128, 24, 0);
function Uc(R, cx, cy, phi, ext) { const [tx, ty] = pt(cx, cy, R, 180 - phi); return `<path d="${cw(cx, cy, R, 180 - phi, -180 + phi)}"/><path d="M${tx} ${P(ty - ext)}V${P(2 * cy - ty + ext)}"/>`; }
V['U-H closed'] = Uc(88, 124, 128, 60, 0);
V['U-H2 closed ext'] = Uc(88, 128, 128, 50, 20);
V['U-T circle+line'] = `<path d="M66 50V206"/><circle cx="132" cy="128" r="70"/>`;
function Lk(r, bx, by, mu, g, top = 40, foot = true) { const [tx, ty] = pt(bx, by, r, mu); const sx = P(tx + 24 + g); return `<path d="${ccw(bx, by, r, mu, 360 - mu)}"/><path d="M${sx} ${top}V${foot ? by + r : P(2 * by - ty)}"/>`; }
V['L-K kiss mu58'] = Lk(58, 110, 150, 58, 0);
V['L-K kiss mu50 ov4'] = Lk(58, 110, 150, 50, -4);
function Lc(r, bx, by, mu, top = 40, foot = 'base') { const [tx, ty] = pt(bx, by, r, mu); return `<path d="${ccw(bx, by, r, mu, 360 - mu)}"/><path d="M${tx} ${top}V${P(foot === 'base' ? by + r : 2 * by - ty)}"/>`; }
V['L-F closed C45'] = Lc(58, 112, 150, 45);
V['L-F2 closed C40 short'] = Lc(60, 110, 150, 40, 40, 'term');
V['L-T circle+line'] = `<path d="M176 40V208"/><circle cx="118" cy="150" r="58"/>`;
