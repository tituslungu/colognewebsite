import { hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk, edgeHit, angOf } from './gen.mjs';
// vt with explicit tail: inner edge flush with vertical cut's left edge, tip at depth D,
// outer edge leaving the circle at angle aB (deg) or at the slash corner (+off)
function vt2({ lean = 16, x1 = -44, x2 = 22, gap = 23, D = 132, aB = null, off = 0, name = '' }) {
  const xe = x2 - gap / 2;
  const tip = [xe, Math.sqrt(D * D - xe * xe)];
  const aIn = angOf([xe, Math.sqrt(1e4 - xe * xe)]) - 3;
  const corner = angOf(edgeHit({ p: [x1, 0], lean, gap }, +1, true));
  const b = aB ?? corner + off;
  return { name: `${name} vt2 lean${lean} x1 ${x1} x2 ${x2} D${D} aB ${b.toFixed(0)} (corner ${corner.toFixed(0)})`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: { aA: aIn, aB: b, tip }, tailAt: [xe - 4, 101], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
export default () => [
  vt2({ off: -0.01 }),
  vt2({ lean: 16, x1: -50, x2: 20, aB: 116 }),
  vt2({ lean: 12, x1: -48, x2: 20, aB: 114 }),
  vt2({ lean: 20, x1: -52, x2: 22, aB: 116 }),
];
