const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
export const V = {};
function U(R, d, ov, cxShift = 0) { const cy = 128; const w = R * Math.sin(d * Math.PI / 180) + 24 - ov; const cx = 128 + 3 - (R + 12 - w - 12) / 2 + cxShift; const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 + ov); return `<path d="M${s} ${cy - R}V${cy + R}"/><path d="M${ex} ${ey}A${R} ${R} 0 1 1 ${ex} ${P(2 * cy - ey)}"/>`; }
function L(r, ov, asc, bx, by) { const mu = Math.acos((r - 24 + ov) / r) * 180 / Math.PI; const [tx, ty] = pt(bx, by, r, mu); return `<path d="M${tx} ${ty}A${r} ${r} 0 1 0 ${tx} ${P(2 * by - ty)}"/><path d="M${P(bx + r)} ${by - r - asc}V${by + r}"/>`; }
V['A d20 ov8 R78'] = U(78, 20, 8);
V['B d28 ov8 R76'] = U(76, 28, 8);
V['C d28 ov6 R76'] = U(76, 28, 6);
V['D d34 ov8 R74'] = U(74, 34, 8);
V['a ov8'] = L(54, 8, 48, 122, 148);
V['b ov6'] = L(54, 6, 48, 122, 148);
