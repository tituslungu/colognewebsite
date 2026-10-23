import { hangTail, concepts } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
function vt({ lean = 16, x1 = -42, x2 = 22, gap = 23, D = 132, spread = 30, name = '' }) {
  const t = hangTail(cut([x2, 0], 0, gap), D, -1, spread);
  return { name: `${name} vt lean${lean} x1 ${x1} x2 ${x2} D${D} sp${spread}`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: t, tailAt: [x2 - 20, 95], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
function at({ lean = 16, x1 = -42, x2 = 22, gap = 23, D = 128, spread = 40, name = '' }) {
  const t = hangTail(cut([x1, 0], lean, gap), D, -1, spread);
  return { name: `${name} A-tail lean${lean} x1 ${x1} x2 ${x2} D${D} sp${spread}`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: t, tailAt: [-70, 80], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
export default () => [
  { name: 'b2 current', def: concepts['bubble-2'](P('bubble-2')) },
  at({ D: 128, spread: 40 }),
  at({ lean: 10, x1: -36, x2: 24, D: 130, spread: 40 }),
  vt({ lean: 14, x1: -52, x2: 20, spread: 28 }),
  vt({ lean: 16, x1: -44, x2: 22, spread: 30 }),
  at({ lean: 8, x1: -30, x2: 26, D: 132, spread: 38 }),
];
