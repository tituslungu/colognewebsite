import { hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
// vertical cut on the left carries message-2's tail on the left piece;
// a slanted cut on the right splits off a sage segment (tilted D)
function lv({ xv = -22, xs = 34, lean = -16, gap = 23, D = 134, spread = 40, mid = 'ink', name = '' }) {
  const t = hangTail(cut([xv, 0], 0, gap), D, -1, spread);
  return { name: `${name} vL ${xv} slash ${xs}@${lean} D${D} sp${spread}`, def: mk({ cuts: [{ p: [xv, 0], lean: 0, gap }, { p: [xs, 0], lean, gap }], tail: t, tailAt: [xv - 20, 95], roles: [{ at: [95, 0], role: 'sage' }, ...(mid !== 'ink' ? [{ at: [(xv + xs) / 2, 0], role: mid }] : [])] }) };
}
export default () => [
  lv({}),
  lv({ xs: 30, lean: -20 }),
  lv({ xv: -26, xs: 30, lean: 16 }),
  lv({ xv: -18, xs: 40, lean: -24 }),
  lv({ xv: -24, xs: 26, lean: -12 }),
  lv({ xv: -20, xs: 36, lean: 20 }),
  lv({ xv: -20, xs: 34, lean: -18, mid: 'sage', name: 'sage mid' }),
  lv({ xv: -20, xs: 34, lean: -18, mid: 'sageD', name: 'deep mid' }),
];
