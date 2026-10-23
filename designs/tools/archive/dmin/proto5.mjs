const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
const cw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
const ccw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}`; };
export const V = {};
function U(R, cx, cy, d, ov) { const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 + ov); return `<path d="M${s} ${ey}V${P(2 * cy - ey)}"/><path d="${cw(cx, cy, R, 90 + d, -90 - d)}"/>`; }
function L(r, bx, by, mu, ov, top) { const [tx] = pt(bx, by, r, mu); const sx = P(tx + 24 - ov); return `<path d="${ccw(bx, by, r, mu, 360 - mu)}"/><path d="M${sx} ${top}V${by + r}"/>`; }
V['U d14 ov0'] = U(84, 116, 128, 14, 0);
V['U d18 ov3'] = U(84, 116, 128, 18, 3);
V['U d22 ov3'] = U(84, 118, 128, 22, 3);
V['U d18 ov6'] = U(84, 114, 128, 18, 6);
V['L mu42 ov0 (Cologne mouth)'] = L(58, 108, 150, 42, 0, 40);
V['L mu48 ov3'] = L(58, 110, 150, 48, 3, 40);
V['L mu54 ov3'] = L(58, 112, 150, 54, 3, 40);
V['L mu48 ov6'] = L(58, 110, 150, 48, 6, 40);
