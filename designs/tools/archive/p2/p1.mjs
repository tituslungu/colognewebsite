// portion-1 "Three Shares": a round chat bubble cut by two chords at different
// angles into three unequal shares. Builds every deliverable from one definition.
import { half, disk, piecePath } from './geo.mjs';

export const P1 = {
  // normalised: circle centre (0,0), radius 1, SVG y-down. Each cut: x where it crosses y=0, angle (deg).
  cuts: [{ x: -0.44, a: -76 }, { x: 0.24, a: -86 }],
  sage: 2,                         // index of the sage share (0 = leftmost)
  // tail hangs below the rim; its left edge is the extension of cut 0, on the side of piece 1
  tail: { cut: 0, piece: 1, depth: 1.24, theta: 100 },
  rCorner: 0.055,                  // fillet where a cut meets the rim (x R)
  rTip: 0.035,
  rJoin: 0.07,                     // concave fillet where the tail meets the rim
};

const sidePick = (x, y, a, g, pt) => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};
const lineThrough = (p, q, inside) => {
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
  let h = half(p[0], p[1], a, 1);
  if (h.n[0] * inside[0] + h.n[1] * inside[1] < h.d) h = half(p[0], p[1], a, -1);
  return h;
};

function tipOf(cx, cy, R, def) {
  const t = def.tail;
  if (t.classic) return [cx + R * t.k * Math.cos(t.phi * Math.PI / 180), cy + R * t.k * Math.sin(t.phi * Math.PI / 180)];
  const c = def.cuts[def.tail.cut];
  const x0 = cx + c.x * R, a = c.a * Math.PI / 180;
  const yTip = cy + def.tail.depth * R;
  return [x0 + (yTip - cy) * Math.cos(a) / Math.sin(a), yTip];
}

// Returns [{d, k, sage}] for a bubble at (cx,cy) radius R with gap G.
export function bubble(cx, cy, R, G, def = P1) {
  const C = disk(cx, cy, R);
  const far = { L: [cx - 10 * R, cy], Rt: [cx + 10 * R, cy] };
  const cuts = def.cuts.map(c => ({ x: cx + c.x * R, y: cy, a: c.a }));
  const sides = k => {
    const s = [];
    if (k > 0) { const c = cuts[k - 1]; s.push(sidePick(c.x, c.y, c.a, G, far.Rt)); }
    if (k < cuts.length) { const c = cuts[k]; s.push(sidePick(c.x, c.y, c.a, G, far.L)); }
    return s;
  };
  const rc = def.rCorner * R;
  const out = [];
  for (let k = 0; k <= cuts.length; k++) out.push({ d: piecePath([C, ...sides(k)], () => rc), k, sage: k === def.sage });
  // tail: triangle (tip, rim point P, interior point on the cut) clipped to its piece's side of the cuts
  const t = def.tail, tip = tipOf(cx, cy, R, def);
  if (t.classic) {
    // short tail: two edges from the tip to rim points at phi-a1 and phi+a2 (just inside the rim)
    const rim = ang => [cx + 0.9 * R * Math.cos(ang * Math.PI / 180), cy + 0.9 * R * Math.sin(ang * Math.PI / 180)];
    const A = rim(t.phi - t.a1), B = rim(t.phi + t.a2);
    const T = [lineThrough(tip, A, B), lineThrough(tip, B, A), lineThrough(A, B, tip)];
    const rt = def.rTip * R;
    out[t.piece].d += piecePath([...T, ...sides(t.piece)], (X, Y, i, j) => ((i === 0 && j === 1) || (i === 1 && j === 0)) ? rt : 0);
    return out;
  }
  const P = [cx + 0.96 * R * Math.cos(t.theta * Math.PI / 180), cy + 0.96 * R * Math.sin(t.theta * Math.PI / 180)];
  const c = cuts[t.cut];
  const Q = [c.x - 0.2 * R * Math.cos(c.a * Math.PI / 180), c.y - 0.2 * R * Math.sin(c.a * Math.PI / 180)];
  const inside = [(tip[0] + P[0] + Q[0]) / 3, (tip[1] + P[1] + Q[1]) / 3];
  const T = [lineThrough(tip, P, Q), lineThrough(tip, Q, P), lineThrough(P, Q, tip)];
  const rt = def.rTip * R;
  // the tail's edge along the cut is the piece's own offset cut line, so clipping makes it exact
  // clip only by the cut the tail hangs from (other cuts' extensions below the rim must not trim it)
  const own = t.piece > t.cut ? sidePick(c.x, c.y, c.a, G, far.Rt) : sidePick(c.x, c.y, c.a, G, far.L);
  const tcs = [...T, own];
  out[t.piece].d += piecePath(tcs, (A, B, i, j) => {
    const isTip = (i === 0 && (j === 1 || j >= 3)) || (j === 0 && (i === 1 || i >= 3)) || (i >= 3 && j === 0);
    return isTip ? rt : 0;
  });
  // concave fillet where the tail's free edge (tip -> P) meets the rim
  if (def.rJoin) out[t.piece].d += joinFillet(tip, P, cx, cy, R, def.rJoin * R);
  return out;
}

// Fills the sharp re-entrant corner between a straight edge (from `a` towards `b`, b inside
// the circle) and the circle (cx,cy,R) with a fillet of radius r.
function joinFillet(a, b, cx, cy, R, r) {
  const fmt = v => (Math.round(v * 100) / 100).toString();
  const ux = b[0] - a[0], uy = b[1] - a[1], L = Math.hypot(ux, uy), u = [ux / L, uy / L];
  // J: where the edge enters the circle
  const dx = a[0] - cx, dy = a[1] - cy, bq = dx * u[0] + dy * u[1], cq = dx * dx + dy * dy - R * R;
  const tJ = -bq - Math.sqrt(bq * bq - cq);
  const J = [a[0] + u[0] * tJ, a[1] + u[1] * tJ];
  // fillet centre: offset the edge by r away from the circle centre, distance R + r from C
  let n = [-u[1], u[0]];
  if (n[0] * (cx - J[0]) + n[1] * (cy - J[1]) > 0) n = [-n[0], -n[1]];
  const p0 = [a[0] + n[0] * r, a[1] + n[1] * r];
  const ex = p0[0] - cx, ey = p0[1] - cy, b2 = ex * u[0] + ey * u[1], c2 = ex * ex + ey * ey - (R + r) * (R + r);
  const ts = [-b2 - Math.sqrt(b2 * b2 - c2), -b2 + Math.sqrt(b2 * b2 - c2)];
  const Fs = ts.map(t => [p0[0] + u[0] * t, p0[1] + u[1] * t]);
  Fs.sort((p, q) => Math.hypot(p[0] - J[0], p[1] - J[1]) - Math.hypot(q[0] - J[0], q[1] - J[1]));
  const F = Fs[0];
  const T1 = [F[0] - n[0] * r, F[1] - n[1] * r];                       // on the edge
  const k = R / (R + r), T2 = [cx + (F[0] - cx) * k, cy + (F[1] - cy) * k]; // on the rim
  // patch T1 -> J (along edge) -> T2 (along rim) -> T1 (fillet arc); orientation picked by cross product
  const cross = (T1[0] - J[0]) * (T2[1] - J[1]) - (T1[1] - J[1]) * (T2[0] - J[0]);
  const sweepRim = cross > 0 ? 1 : 0;
  return `M${fmt(T1[0])} ${fmt(T1[1])}L${fmt(J[0])} ${fmt(J[1])}A${fmt(R)} ${fmt(R)} 0 0 ${sweepRim} ${fmt(T2[0])} ${fmt(T2[1])}A${fmt(r)} ${fmt(r)} 0 0 ${sweepRim} ${fmt(T1[0])} ${fmt(T1[1])}Z`;
}
export function reach(cx, cy, R, px, py, def = P1) {
  let m = 0;
  for (let i = 0; i < 720; i++) { const a = i / 720 * 2 * Math.PI; m = Math.max(m, Math.hypot(cx + R * Math.cos(a) - px, cy + R * Math.sin(a) - py)); }
  const tip = tipOf(cx, cy, R, def);
  return Math.max(m, Math.hypot(tip[0] - px, tip[1] - py));
}
export function bbox(cx, cy, R, def = P1) {
  const tip = tipOf(cx, cy, R, def);
  return { x0: Math.min(cx - R, tip[0]), y0: cy - R, x1: cx + R, y1: Math.max(cy + R, tip[1]) };
}
export function shares(def = P1) {
  const N = 500, cnt = new Array(def.cuts.length + 1).fill(0); let tot = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = -1 + 2 * (i + .5) / N, y = -1 + 2 * (j + .5) / N; if (x * x + y * y > 1) continue; tot++;
    cnt[def.cuts.reduce((s, c) => s + (x > c.x + y / Math.tan(c.a * Math.PI / 180) ? 1 : 0), 0)]++;
  }
  return cnt.map(c => Math.round(100 * c / tot));
}
