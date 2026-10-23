// Art-directed definitions for bubble-1..3 (normalised: bubble r = 100 at
// origin, SVG axes, gap 23).
import { mk, edgeHit, angOf } from './gen.mjs';
export const GAP = 23;

// bubble-1 Parallel Slices: two parallel slashes, classic tail on the sage
// piece, tail base set back from the cut corner so the piece keeps a short
// run of arc before the tail (reads as a bubble tail, not a pennant).
export function b1({ lean = 28, x1 = -34, x2 = 16, gap = GAP, aA = 58, off = -16, tip = [60, 126] } = {}) {
  const cB = { p: [x2, 0], lean, gap };
  const aB = angOf(edgeHit(cB, +1, true)) + off;
  return mk({ cuts: [{ p: [x1, 0], lean, gap }, cB], tail: { aA, aB, tip }, tailAt: [40, 80], roles: [{ at: [70, 0], role: 'sage' }] });
}

// bubble-2 Slash and D: message-2's vertical cut, sage D and tail kept; a
// second cut leaning `lean` splits the charcoal half. The tail hangs from the
// vertical cut (inner edge flush with it) and its outer edge starts exactly
// at the corner where the slash meets the rim.
export function b2({ lean = 14, x1 = -44, x2 = 18, gap = GAP, D = 134 } = {}) {
  const xe = x2 - gap / 2;
  const tip = [xe, Math.sqrt(D * D - xe * xe)];
  const aIn = angOf([xe, Math.sqrt(1e4 - xe * xe)]) - 3;
  const corner = angOf(edgeHit({ p: [x1, 0], lean, gap }, +1, true));
  return mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: { aA: aIn, aB: corner, tip }, tailAt: [xe - 4, 101], roles: [{ at: [80, 0], role: 'sage' }] });
}

// bubble-3 Low Slices: two shallow cuts rising to the right at different
// angles (fanning 10 deg, meeting far outside), sage bottom share with tail.
export function b3({ l1 = 64, y1 = -30, l2 = 74, y2 = 28, gap = GAP, tail = { aA: 86, aB: 116, tip: [-44, 132] }, tailAt = [-30, 92] } = {}) {
  return mk({ cuts: [{ p: [0, y1], lean: l1, gap }, { p: [0, y2], lean: l2, gap }], tail, tailAt, roles: [{ at: [0, 88], role: 'sage' }] });
}
export const defs = { 'bubble-1': b1, 'bubble-2': b2, 'bubble-3': b3 };
