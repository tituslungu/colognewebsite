import { concepts, hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
const three = (a, b, roles) => [
  { hps: [a.left], role: roles[0] },
  { hps: [a.right, b.left], role: roles[1] },
  { hps: [b.right], role: roles[2] },
];
// vertical cut at x2 carries the tail (message-2 style) on the middle piece;
// slash at x1 with lean on the left
function vt({ lean = 16, x1 = -42, x2 = 22, gap = 23, D = 134, spread = 40, roles = ['ink', 'ink', 'sage'] }) {
  const a = cut([x1, 0], lean, gap), b = cut([x2, 0], 0, gap);
  return { tail: hangTail(b, D, -1, spread), pieces: three(a, b, roles), tailOwner: 1 };
}
export default () => [
  { name: 'b2 current', def: concepts['bubble-2'](P('bubble-2')) },
  { name: 'message-2 ref', def: { tail: hangTail(cut([0, 0], 0, 23), 134, -1, 40), pieces: [{ hps: [cut([0, 0], 0, 23).left], role: 'ink' }, { hps: [cut([0, 0], 0, 23).right], role: 'sage' }] } },
  { name: 'vt lean16 x1-42', def: vt({}) },
  { name: 'vt lean22 x1-46', def: vt({ lean: 22, x1: -46 }) },
  { name: 'vt lean-16 x1-44', def: vt({ lean: -16, x1: -44 }) },
  { name: 'vt lean-24 x1-46', def: vt({ lean: -24, x1: -46 }) },
  { name: 'vt lean30 x1-40 x2 26', def: vt({ lean: 30, x1: -40, x2: 26 }) },
  { name: 'vt lean-30 x1-40 x2 20', def: vt({ lean: -30, x1: -40, x2: 20 }) },
];
