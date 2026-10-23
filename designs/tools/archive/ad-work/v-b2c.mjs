import { hangTail, concepts } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
// tail on the sage D, hanging from the right edge of the vertical cut
function dt({ lean = 16, x1 = -42, x2 = 18, gap = 23, D = 132, spread = 32, name = '' }) {
  const t = hangTail(cut([x2, 0], 0, gap), D, +1, spread);
  return { name: `${name} D-tail lean${lean} x1 ${x1} x2 ${x2} D${D} sp${spread}`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: t, tailAt: [x2 + 20, 95], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
export default () => [
  { name: 'b2 current', def: concepts['bubble-2'](P('bubble-2')) },
  dt({}),
  dt({ x2: 10, x1: -46 }),
  dt({ lean: 20, x1: -40, x2: 14 }),
  dt({ lean: -16, x1: -40, x2: 14, name: 'backslash' }),
  dt({ lean: 12, x1: -44, x2: 6, spread: 34 }),
  dt({ lean: 18, x1: -50, x2: 4, spread: 34, D: 134 }),
  dt({ lean: 24, x1: -36, x2: 20 }),
];
