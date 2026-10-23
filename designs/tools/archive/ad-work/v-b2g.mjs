import { hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
function lv({ xv = -22, xs = 34, lean = -16, gap = 23, D = 134, spread = 40, name = '' }) {
  const t = hangTail(cut([xv, 0], 0, gap), D, -1, spread);
  return { name: `${name} vL ${xv} slash ${xs}@${lean} D${D} sp${spread}`, def: mk({ cuts: [{ p: [xv, 0], lean: 0, gap }, { p: [xs, 0], lean, gap }], tail: t, tailAt: [xv - 20, 95], roles: [{ at: [95, 0], role: 'sage' }] }) };
}
function vt({ lean = 16, x1 = -42, x2 = 22, gap = 23, D = 132, spread = 30, name = '' }) {
  const t = hangTail(cut([x2, 0], 0, gap), D, -1, spread);
  return { name: `${name} vt lean${lean} x1 ${x1} x2 ${x2} D${D} sp${spread}`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: t, tailAt: [x2 - 20, 95], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
export default () => [
  lv({ xv: -26, xs: 30, lean: 16 }),
  lv({ xv: -24, xs: 36, lean: 22 }),
  lv({ xv: -30, xs: 26, lean: 14, D: 134, spread: 38 }),
  vt({ lean: 16, x1: -44, x2: 22, spread: 30 }),
];
