// Circle-bowl uppercase D: stem x=xs, circle centre (xs+d, cy), radius R, bottom-left fillet rho, top gap angle.
const f = n => +n.toFixed(2);
export function upperCirc({ xs, cy, R, d, rho, gapDeg, stemTop = null, w = 22, topFillet = false }) {
  const h = Math.sqrt(R * R - d * d); // half chord
  const cx = xs + d;
  // fillet at bottom
  const yf = cy + Math.sqrt((R - rho) ** 2 - (d - rho) ** 2);
  const Fx = xs + rho, Fy = yf;
  const k = R / (R - rho);
  const Tx = cx + (Fx - cx) * k, Ty = cy + (Fy - cy) * k; // tangent on circle
  // top intersection angle (screen coords, measured from +x, y down): point (xs, cy - h)
  const aTop = Math.atan2(-h, xs - cx); // around -110..-180
  const aEnd = aTop + gapDeg * Math.PI / 180; // move clockwise in screen? we end before reaching top intersection when travelling CCW visually
  const Ex = cx + R * Math.cos(aEnd), Ey = cy + R * Math.sin(aEnd);
  const yS = stemTop ?? (cy - h);
  // path: stem top -> down to fillet -> fillet arc (sweep 0 = CCW visually) -> big arc around right (CCW visually: sweep 0) to end
  // big arc from T (bottom-left) going east/up/around to E (top-left). Large arc flag 1.
  const d1 = `M${f(xs)} ${f(yS)} V${f(yf)} A${rho} ${rho} 0 0 0 ${f(Tx)} ${f(Ty)} A${R} ${R} 0 1 0 ${f(Ex)} ${f(Ey)}`;
  return `<path d="${d1}" fill="none" stroke="url(#ink)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
