import { concepts } from './concepts.mjs';
import { mk, edgeHit, angOf } from './gen.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
// parallel slashes at lean, offsets x1,x2; classic tail on right piece
// tail base from the cut corner (+off deg) to aA; tip
function par({ lean = 28, x1 = -34, x2 = 16, gap = 23, aA = 58, off = 1.5, tip = [58, 130], name }) {
  const cB = { p: [x2, 0], lean, gap };
  const corner = edgeHit(cB, +1, true);
  const aB = angOf(corner) + off;
  return { name, def: mk({ cuts: [{ p: [x1, 0], lean, gap }, cB], tail: { aA, aB, tip }, tailAt: [40, 80], roles: [{ at: [70, 0], role: 'sage' }] }) };
}
export default () => [
  { name: 'b1 current', def: concepts['bubble-1'](P('bubble-1')) },
  par({ name: 'tail smaller tip 54,126 aA62', aA: 62, tip: [54, 126] }),
  par({ name: 'tail off corner -10, aA 52, tip 62,128', aA: 52, off: -12, tip: [64, 130] }),
  par({ name: 'tail narrow: aA 60, off -16, tip 66,132', aA: 56, off: -18, tip: [70, 134] }),
  par({ name: 'lean 24', lean: 24, aA: 58, tip: [58, 130] }),
  par({ name: 'lean 32', lean: 32, aA: 58, tip: [58, 130], x1: -32, x2: 18 }),
  par({ name: 'lean 28, wider middle (x1 -38)', x1: -40, x2: 14, aA: 58, tip: [58, 130] }),
  par({ name: 'tail down (tip 40,134), aA 66', aA: 66, tip: [40, 136] }),
];
