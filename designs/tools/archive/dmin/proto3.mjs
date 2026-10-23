const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
const cw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
const ccw = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}`; };
export const V = {};
function U(R, cx, cy, d, g) { const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 - g); return `<path d="M${s} ${ey}V${P(2 * cy - ey)}"/><path d="${cw(cx, cy, R, 90 + d, -90 - d)}"/>`; }
// lowercase mirror: arc from 90-d (top, slightly right of centre) ccw to 270+d; stem right of the arc ends
function Lm(r, bx, by, d, g, top) { const [ex, ey] = pt(bx, by, r, 90 - d); const s = P(ex + 24 + g); return `<path d="${ccw(bx, by, r, 90 - d, 270 + d)}"/><path d="M${s} ${top}V${P(2 * by - ey)}"/>`; }
V['U-C d14 g10'] = U(86, 116, 128, 14, 10);
V['L-M d14 g10 r56'] = Lm(56, 108, 154, 14, 10, 40);
V['L-M d0 g10 r56'] = Lm(56, 106, 154, 0, 10, 40);
V['L-M d24 g10 r56'] = Lm(56, 110, 154, 24, 10, 40);
V['L-M d14 g6 r60'] = Lm(60, 106, 150, 14, 6, 40);
V['L-M d30 g8 r58'] = Lm(58, 112, 152, 30, 8, 40);
V['L-F C45 chord'] = (() => { const r = 58, bx = 112, by = 150, mu = 45; const [tx] = pt(bx, by, r, mu); return `<path d="${ccw(bx, by, r, mu, 360 - mu)}"/><path d="M${tx} 40V${by + r}"/>`; })();
