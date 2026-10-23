// portion-2 "Itemised": a rounded-square chat bubble divided into receipt rows of
// different heights by two non-parallel gaps; your row is sage. The bubble's
// bottom-left corner runs straight down into the tail.
import { half, piecePath } from './geo.mjs';

export const P2 = {
  w: 1, h: 0.9,               // body proportions (unit width)
  r: 0.2,                      // body corner radius (x width)
  // four receipt rows; the gaps zig-zag like a torn receipt edge (y = fraction of body height at the centre line)
  gaps: [{ y: 0.19, a: -2.5 }, { y: 0.52, a: 2 }, { y: 0.73, a: -2.5 }],
  sage: 1,                     // your row
  tail: { inset: true, a: 0.27, b: 0.52, tx: 0.12, d: 0.2 },
  rCut: 0.03,                  // fillet where a gap meets the body edge (x width)
  rTip: 0.025,
  rJoin: 0.05, rJoinA: 0.012,  // concave fillets where the tail meets the body (right, left)
};

const fmt = v => (Math.round(v * 100) / 100).toString();
const mk = (px, py, nx, ny, extra = {}) => { const l = Math.hypot(nx, ny); nx /= l; ny /= l; return { kind: 'line', n: [nx, ny], d: nx * px + ny * py, ...extra }; };
const pick = (x, y, a, g, pt) => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};

// Build at body left x0, top y0, width W, gap G. Returns [{d, sage}] and geometry info.
export function itemised(x0, y0, W, G, def = P2) {
  const H = def.h * W, x1 = x0 + W, y1 = y0 + H, cx = x0 + W / 2;
  const L = mk(x0, 0, 1, 0, { side: 'L' }), Rr = mk(x1, 0, -1, 0, { side: 'R' }), T = mk(0, y0, 0, 1, { side: 'T' }), B = mk(0, y1, 0, -1, { side: 'B' });
  const box = [L, Rr, T, B];
  const gaps = def.gaps.map(g => ({ x: cx, y: y0 + g.y * H, a: g.a }));
  const above = [cx, y0 - 10 * W], below = [cx, y1 + 10 * W];
  const rc = def.r * W, rcut = def.rCut * W;
  const parts = [];
  const ext = (def.extend || 0) * W;
  const boxExt = [L, mk(x1 + ext, 0, -1, 0, { side: 'R' }), T, B];
  for (let k = 0; k <= gaps.length; k++) {
    const cs = [...(k === def.sage && ext ? boxExt : box)];
    if (k > 0) cs.push(pick(gaps[k - 1].x, gaps[k - 1].y, gaps[k - 1].a, G, below));
    if (k < gaps.length) cs.push(pick(gaps[k].x, gaps[k].y, gaps[k].a, G, above));
    const last = k === gaps.length;
    const d = piecePath(cs, (A, Bc) => {
      const sides = [A.side, Bc.side].sort().join('');
      if (A.side && Bc.side) return (last && sides === 'BL' && !def.tail.inset) ? 0 : rc; // the tail corner stays square
      return rcut;
    });
    parts.push({ d, sage: k === def.sage, k, dx: (def.slide && k === def.sage) ? def.slide * W : 0 });
  }
  if (def.tail.inset) {
    parts[gaps.length].d += insetTail(x0, y1, W, def);
    return { parts, bbox: { x0, y0, x1, y1: y1 + def.tail.d * W } };
  }
  // tail: left edge continues the body's left side straight down to the tip
  const tw = def.tail.w * W, td = def.tail.d * W;
  const tip = [x0, y1 + td], base = [x0 + tw, y1];
  const rt = def.rTip * W;
  // tip fillet: between the vertical left edge and the slanted edge
  const ux = base[0] - tip[0], uy = base[1] - tip[1], ul = Math.hypot(ux, uy);
  const u = [ux / ul, uy / ul];                    // along slanted edge, tip -> base
  const half = Math.acos(-u[1]) / 2;               // half the tip angle (vertical edge points up: (0,-1))
  const tdist = rt / Math.tan(half);
  const p1 = [tip[0], tip[1] - tdist], p2 = [tip[0] + u[0] * tdist, tip[1] + u[1] * tdist];
  // concave fillet at base: between slanted edge (direction u) and the bottom edge (horizontal)
  const rj = def.rJoin * W;
  const ang = Math.atan2(-u[1], u[0]);             // angle of edge above horizontal
  const jd = rj * Math.tan(ang / 2);               // tangent length for the exterior angle
  const q1 = [base[0] - u[0] * jd, base[1] - u[1] * jd], q2 = [base[0] + jd, base[1]];
  const top = y1 - Math.max(rc, 2);                // overlap into the body so the union is seamless
  // clockwise like the body pieces, so the overlap stays filled under the nonzero rule
  const tail = `M${fmt(x0)} ${fmt(top)}L${fmt(q2[0])} ${fmt(top)}L${fmt(q2[0])} ${fmt(q2[1])}A${fmt(rj)} ${fmt(rj)} 0 0 0 ${fmt(q1[0])} ${fmt(q1[1])}L${fmt(p2[0])} ${fmt(p2[1])}A${fmt(rt)} ${fmt(rt)} 0 0 1 ${fmt(p1[0])} ${fmt(p1[1])}Z`;
  parts[gaps.length].d += tail;
  return { parts, bbox: { x0, y0, x1, y1: y1 + td } };
}

// Inset tail: leaves the bottom edge between a and b (x fractions of width), tip at (tx, d).
// Concave fillets at both junctions, small round at the tip. Clockwise.
function insetTail(x0, y1, W, def) {
  const t = def.tail;
  const A = [x0 + t.a * W, y1], Bp = [x0 + t.b * W, y1], tip = [x0 + t.tx * W, y1 + t.d * W];
  const rj = def.rJoin * W, rjA = (def.rJoinA ?? def.rJoin) * W, rt = def.rTip * W;
  const unit = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
  const angBetween = (u, v) => Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1])));
  // path: along the bottom edge leftwards from B, concave turn into edge B->tip, convex tip, edge tip->A, concave turn back onto the bottom edge
  const left = [-1, 0], right = [1, 0];
  const uB = unit(Bp, tip), uA = unit(tip, A);
  const tB = rj * Math.tan(angBetween(left, uB) / 2);
  const tT = rt / Math.tan((Math.PI - angBetween(uB, uA)) / 2);
  const tA = rjA * Math.tan(angBetween(uA, left) / 2);
  const b1 = [Bp[0] + tB, y1], b2 = [Bp[0] + uB[0] * tB, Bp[1] + uB[1] * tB];
  const t1 = [tip[0] - uB[0] * tT, tip[1] - uB[1] * tT], t2 = [tip[0] + uA[0] * tT, tip[1] + uA[1] * tT];
  const a1 = [A[0] - uA[0] * tA, A[1] - uA[1] * tA], a2 = [A[0] - tA, y1];
  const top = y1 - 2 * Math.max(rj, rjA);
  return `M${fmt(a2[0])} ${fmt(top)}L${fmt(b1[0])} ${fmt(top)}L${fmt(b1[0])} ${fmt(b1[1])}A${fmt(rj)} ${fmt(rj)} 0 0 0 ${fmt(b2[0])} ${fmt(b2[1])}L${fmt(t1[0])} ${fmt(t1[1])}A${fmt(rt)} ${fmt(rt)} 0 0 1 ${fmt(t2[0])} ${fmt(t2[1])}L${fmt(a1[0])} ${fmt(a1[1])}A${fmt(rjA)} ${fmt(rjA)} 0 0 0 ${fmt(a2[0])} ${fmt(a2[1])}Z`;
}

export function shares(def = P2) {
  // share of body area per row (ignores tail and corner rounding)
  const N = 400, cnt = new Array(def.gaps.length + 1).fill(0);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = (i + .5) / N - 0.5, y = (j + .5) / N * def.h;
    cnt[def.gaps.reduce((s, g) => s + (y > g.y * def.h + x * Math.tan(g.a * Math.PI / 180) ? 1 : 0), 0)]++;
  }
  return cnt.map(c => Math.round(100 * c / (N * N)));
}
