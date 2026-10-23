import { concepts, hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk, edgeHit, angOf } from './gen.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
// classic tail at bottom: from angle a0..a1, tip
const T = (aA, aB, tip) => ({ aA, aB, tip });
export default () => [
  { name: 'b3 current', def: concepts['bubble-3'](P('bubble-3')) },
  { name: 'b1 current', def: concepts['bubble-1'](P('bubble-1')) },
  // B: steep / on left, shallow / bottom-right lip (sage) carrying tail
  { name: 'B steep+shallow lip', def: mk({ cuts: [{ p: [-38, 0], lean: 22 }, { p: [30, 30], lean: 62 }], tail: T(50, 95, [52, 136]), tailAt: [40, 80], roles: [{ at: [60, 60], role: 'sage' }] }) },
  // C: crossing off-centre: four pieces
  { name: 'C cross offcentre', def: mk({ cuts: [{ p: [-18, 0], lean: 24 }, { p: [0, 30], lean: 76 }], tail: T(60, 100, [40, 138]), tailAt: [20, 80], roles: [{ at: [50, -40], role: 'sage' }] }) },
  { name: 'C2 cross lowleft', def: mk({ cuts: [{ p: [-30, 0], lean: 18 }, { p: [0, 40], lean: 70 }], tail: T(55, 95, [50, 138]), tailAt: [30, 85], roles: [{ at: [30, -30], role: 'sage' }] }) },
  // D: shallow fan from the left: cuts lean 64 and 80 (nearly horizontal, rising right)
  { name: 'D shallow fan', def: mk({ cuts: [{ p: [0, -30], lean: 62 }, { p: [0, 28], lean: 76 }], tail: T(70, 110, [20, 140]), tailAt: [0, 85], roles: [{ at: [40, -70], role: 'sage' }] }) },
  // E: steep + shallow, steep carries the tail (message-2 style), shallow cuts top-right cap
  { name: 'E vertical tail + cap', def: (() => { const c = { p: [-14, 0], lean: 8, gap: 23 }; const t = hangTail(cut(c.p, c.lean, 23), 134, -1, 30); return mk({ cuts: [c, { p: [40, -30], lean: 52 }], tail: t, tailAt: [-40, 80], roles: [{ at: [70, -50], role: 'sage' }] }); })() },
  // F: two slashes at 14 and 40 lean, not crossing (converge above-right)
  { name: 'F 14/40', def: mk({ cuts: [{ p: [-40, 0], lean: 14 }, { p: [22, 20], lean: 40 }], tail: T(60, 100, [55, 136]), tailAt: [40, 85], roles: [{ at: [70, 0], role: 'sage' }] }) },
];
