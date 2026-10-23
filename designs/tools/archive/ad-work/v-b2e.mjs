import { hangTail, concepts } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
function at({ lean = 16, x1 = -42, x2 = 22, gap = 23, D = 128, spread = 40, name = '' }) {
  const t = hangTail(cut([x1, 0], lean, gap), D, -1, spread);
  return { name: `${name} A-tail lean${lean} x1 ${x1} x2 ${x2} D${D} sp${spread}`, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, { p: [x2, 0], lean: 0, gap }], tail: t, tailAt: [-70, 80], roles: [{ at: [80, 0], role: 'sage' }] }) };
}
export default () => [
  { name: 'message-2 ref', def: { tail: hangTail(cut([0, 0], 0, 23), 134, -1, 40), pieces: [{ hps: [cut([0, 0], 0, 23).left], role: 'ink' }, { hps: [cut([0, 0], 0, 23).right], role: 'sage' }] } },
  at({ lean: 14, x1: -36, x2: 24, D: 130, spread: 46 }),
  at({ lean: 16, x1: -38, x2: 24, D: 128, spread: 50 }),
  at({ lean: 18, x1: -34, x2: 28, D: 130, spread: 48 }),
  at({ lean: 12, x1: -32, x2: 26, D: 132, spread: 46 }),
  at({ lean: 20, x1: -36, x2: 30, D: 130, spread: 50 }),
];
