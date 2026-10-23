import { cut } from './lib.mjs';
import { mk, edgeHit, angOf } from './gen.mjs';
function par({ lean = 28, x1 = -34, x2 = 16, gap = 23, aA = 56, off = -18, tip = [66, 132], name }) {
  const cB = { p: [x2, 0], lean, gap };
  const aB = angOf(edgeHit(cB, +1, true)) + off;
  return { name, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, cB], tail: { aA, aB, tip }, tailAt: [40, 80], roles: [{ at: [70, 0], role: 'sage' }] }) };
}
function vt2({ lean = 16, x1 = -44, x2 = 22, gap = 23, D = 132, name = '' }) {
  const xe = x2 - gap / 2;
  const tip = [xe, Math.sqrt(D * D - xe * xe)];
  const aIn = angOf([xe, Math.sqrt(1e4 - xe * xe)]) - 3;
  const corner = angOf(edgeHit({ p: [x1, 0], lean, gap }, +1, true));
  return { name, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: { aA: aIn, aB: corner - 0.01, tip }, tailAt: [xe - 4, 101], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
const T = (aA, aB, tip) => ({ aA, aB, tip });
const fanCut = (Q, x) => ({ p: [x, 0], lean: (Math.atan2(Q[0] - x, -Q[1]) * 180) / Math.PI });
export default () => [
  par({ name: 'b1 refined' }),
  vt2({ name: 'b2 vt2' }),
  { name: 'b3 shallow fan sage bottom', def: mk({ cuts: [{ p: [0, -32], lean: 62 }, { p: [0, 26], lean: 76 }], tail: T(62, 96, [46, 136]), tailAt: [20, 90], roles: [{ at: [0, 85], role: 'sage' }] }) },
  { name: 'b3 steep fan classic tail', def: mk({ cuts: [fanCut([-130, -220], -36), fanCut([-130, -220], 30)], tail: T(100, 135, [-30, 138]), tailAt: [-30, 90], roles: [{ at: [70, -40], role: 'sage' }] }) },
];
