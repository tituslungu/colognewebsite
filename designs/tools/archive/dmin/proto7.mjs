const P = (x) => +x.toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
export const V = {};
function U(R, cx, cy, d, ov, flush = true) { const [ex, ey] = pt(cx, cy, R, 90 + d); const s = P(ex - 24 + ov); const eyb = P(2 * cy - ey); const t = flush ? cy - R : ey; return `<path d="M${s} ${P(t)}V${P(2 * cy - t)}"/><path d="M${ex} ${ey}A${R} ${R} 0 1 1 ${ex} ${eyb}"/>`; }
function Lov(r, bx, by, ov, top) { const mu = Math.acos((r - 24 + ov) / r) * 180 / Math.PI; const [tx, ty] = pt(bx, by, r, mu); return `<path d="M${tx} ${ty}A${r} ${r} 0 1 0 ${tx} ${P(2 * by - ty)}"/><path d="M${P(bx + r)} ${top}V${by + r}"/>`; }
V['U d20 ov3 flush'] = U(80, 114, 128, 20, 3);
V['U d16 ov8 flush'] = U(80, 114, 128, 16, 8);
V['U d24 ov8 flush'] = U(80, 116, 128, 24, 8);
V['U d12 ov11 flush'] = U(80, 114, 128, 12, 11);
V['L ov4.7 (mu50)'] = Lov(54, 124, 150, 4.7, 50);
V['L ov8 (mu45)'] = Lov(54, 124, 150, 8, 50);
V['L ov11 (mu41)'] = Lov(54, 124, 150, 11, 50);
V['dee-mono U'] = `<path d="M70 49V180.41A25 25 0 0 0 88.98 204.68A79 79 0 1 0 108.34 49"/>`;
V['dee-mono L'] = `<path d="M176 48V156A48 48 0 1 1 136.34 108.73"/>`;
