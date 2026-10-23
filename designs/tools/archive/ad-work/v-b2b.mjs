import { hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
// vertical cut at x2 carries a message-2 tail on the middle piece; slash at x1
function vt({ lean = 16, x1 = -42, x2 = 22, gap = 23, D = 132, spread = 30, name }) {
  const t = hangTail(cut([x2, 0], 0, gap), D, -1, spread);
  return { name: `${name || ''} lean${lean} x1 ${x1} x2 ${x2} D${D} sp${spread}`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: t, tailAt: [x2 - 20, 95], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
export default () => [
  vt({}),
  vt({ spread: 26, D: 130 }),
  vt({ lean: 20, x1: -44 }),
  vt({ lean: 18, x1: -46, x2: 18 }),
  vt({ lean: 14, x1: -40, x2: 24, spread: 28 }),
  vt({ lean: 20, x1: -40, x2: 26, spread: 28 }),
  vt({ lean: 18, x1: -48, x2: 22, spread: 30 }),
  vt({ lean: 22, x1: -50, x2: 20, spread: 30 }),
];
