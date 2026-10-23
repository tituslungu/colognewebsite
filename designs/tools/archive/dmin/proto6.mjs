const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
export const V = {};
// Uppercase: stem tangent offset so arc tip overlaps stem by ov; stem extends e beyond the tips
function U(R, cx, cy, d, ov, e) { const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 + ov); const eyb = P(2 * cy - ey); return `<path d="M${s} ${P(ey - e)}V${P(eyb + e)}"/><path d="M${ex} ${ey}A${R} ${R} 0 1 1 ${ex} ${eyb}"/>`; }
// Lowercase: stem tangent to the bowl circle
function L(r, bx, by, mu, top) { const [tx, ty] = pt(bx, by, r, mu); const sx = P(bx + r); return `<path d="M${tx} ${ty}A${r} ${r} 0 1 0 ${tx} ${P(2 * by - ty)}"/><path d="M${sx} ${top}V${by + r}"/>`; }
V['U e0'] = U(80, 114, 128, 20, 3, 0);
V['U e5 flush'] = U(80, 114, 128, 20, 3, 4.8);
V['U e10'] = U(80, 114, 128, 20, 3, 10);
V['U d26 e5'] = U(80, 116, 128, 26, 3, 9);
V['L r54 mu50'] = L(54, 124, 150, 50, 50);
V['L r54 mu56'] = L(54, 124, 150, 56, 50);
