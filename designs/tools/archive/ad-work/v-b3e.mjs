import { mk } from './gen.mjs';
import { build } from './lib.mjs';
const T = (aA, aB, tip) => ({ aA, aB, tip });
const S = ({ l1 = 64, y1 = -30, l2 = 74, y2 = 28, tail = T(64, 94, [44, 132]), tailAt = [30, 92], name = '' }) => {
  return { name: `${name} ${l1}@${y1} / ${l2}@${y2}`, def: mk({ cuts: [{ p: [0, y1], lean: l1 }, { p: [0, y2], lean: l2 }], tail, tailAt, roles: [{ at: [0, 88], role: 'sage' }] }) };
};
export default () => [
  S({ name: 'fan10' }),
  S({ name: 'fan8', l1: 65, l2: 73, y1: -30, y2: 26 }),
  S({ name: 'fan10 tail BL', tail: T(86, 116, [-44, 132]), tailAt: [-30, 92] }),
  S({ name: 'fan12', l1: 62, l2: 74, y1: -32, y2: 28 }),
  S({ name: 'fan10 rise 20', l1: 66, l2: 76, y1: -30, y2: 28 }),
  S({ name: 'fan10 rise 28', l1: 58, l2: 68, y1: -30, y2: 28 }),
];
