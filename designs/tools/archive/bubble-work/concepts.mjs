// Concept definitions in normalised space: bubble circle r = 100 at origin,
// SVG axes (y down). Each piece has a role: 'ink' (charcoal / off-white on
// dark) or 'sage'.
import { cut } from './lib.mjs';
import { deg } from './geo.mjs';

// Tail whose inner edge is flush with a cut's gap edge (side -1 = left of an
// upward cut), tip at distance D from the centre, outer edge leaving the
// circle `spread` degrees further round.
export function hangTail(c, D = 138, side = -1, spread = 44) {
  const th = deg(c.lean - 90);
  const dir = [Math.cos(th), Math.sin(th)];
  const nL = [Math.sin(th), -Math.cos(th)];
  const n = side < 0 ? nL : [-nL[0], -nL[1]];
  const q = [c.p[0] + n[0] * c.gap / 2, c.p[1] + n[1] * c.gap / 2];
  const at = R => { const b = q[0] * dir[0] + q[1] * dir[1], cc = q[0] ** 2 + q[1] ** 2 - R * R; const t = -b - Math.sqrt(b * b - cc); return [q[0] + t * dir[0], q[1] + t * dir[1]]; };
  const hit = at(100), tip = at(D);
  const ang = (Math.atan2(hit[1], hit[0]) * 180) / Math.PI;
  return side < 0 ? { aA: ang - 2, aB: ang + spread, tip } : { aA: ang - spread, aB: ang + 2, tip };
}

const three = (a, b, roles) => [
  { hps: [a.left], role: roles[0] },
  { hps: [a.right, b.left], role: roles[1] },
  { hps: [b.right], role: roles[2] },
];

export const concepts = {
  // Parallel slashes: two cuts at the same lean, three unequal slices.
  'bubble-1': (p = {}) => {
    const { lean = 26, x1 = -38, x2 = 12, gap = 21, D = 138, spread = 44, roles = ['ink', 'ink', 'sage'], tail = 'nib', ct = {} } = p;
    const a = cut([x1, 0], lean, gap), b = cut([x2, 0], lean, gap);
    if (tail === 'classic') {
      // classic tail on the right-hand piece: leaves the circle between
      // angles aA..aB (deg) and points to tip
      let { aA = 58, aB = 96, tip = [64, 134] } = ct;
      if (aB === 'cut') {
        // start the tail exactly at the corner where cut b's right edge meets
        // the circle (lower side), overlapping slightly into the gap so the
        // clip leaves a clean, flush corner with no stub of arc
        const l = (lean * Math.PI) / 180, dir = [Math.sin(l), -Math.cos(l)], nR = [Math.cos(l), Math.sin(l)];
        const q = [x2 + (nR[0] * gap) / 2, (nR[1] * gap) / 2];
        const bb = q[0] * dir[0] + q[1] * dir[1], cc = q[0] ** 2 + q[1] ** 2 - 100 * 100;
        const t = -bb - Math.sqrt(bb * bb - cc);
        const hit = [q[0] + t * dir[0], q[1] + t * dir[1]];
        aB = (Math.atan2(hit[1], hit[0]) * 180) / Math.PI + 1.5;
      }
      return { tail: { aA, aB, tip }, pieces: three(a, b, roles), tailOwner: 2 };
    }
    return { tail: hangTail(a, D, -1, spread), pieces: three(a, b, roles) };
  },
  // Slash + vertical: a slashed cut carrying the tail, then a vertical cut
  // that leaves message-2's sage D on the right.
  'bubble-2': (p = {}) => {
    const { lean = 22, x1 = -40, x2 = 22, gap = 21, D = 138, spread = 44, roles = ['ink', 'ink', 'sage'] } = p;
    const a = cut([x1, 0], lean, gap), b = cut([x2, 0], 0, gap);
    return { tail: hangTail(a, D, -1, spread), pieces: three(a, b, roles) };
  },
  // Fanned back-slashes: two cuts through a common pivot up-left of the
  // bubble, so they open by a few degrees; tail flush with the first cut.
  'bubble-3': (p = {}) => {
    const { Q = [-160, -300], x1 = -34, x2 = 26, gap = 21, D = 138, spread = 34, roles = ['ink', 'ink', 'sage'] } = p;
    const lean = x => (Math.atan2(Q[0] - x, -Q[1]) * 180) / Math.PI;
    const a = cut([x1, 0], lean(x1), gap), b = cut([x2, 0], lean(x2), gap);
    return { tail: hangTail(a, D, -1, spread), pieces: three(a, b, roles) };
  },
};
