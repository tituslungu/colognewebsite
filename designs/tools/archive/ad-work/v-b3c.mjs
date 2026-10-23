import { mk } from './gen.mjs';
const T = (aA, aB, tip) => ({ aA, aB, tip });
// shallow cuts: lean measured from vertical, 90 = horizontal; rising to the right when < 90
const S = ({ l1, y1, l2, y2, sage = 'bottom', tail = 'br', name }) => {
  const tl = tail === 'br' ? T(58, 98, [46, 138]) : T(82, 122, [-46, 138]);
  const at = sage === 'bottom' ? [0, 85] : sage === 'top' ? [0, -85] : [0, (y1 + y2) / 2];
  return { name, def: mk({ cuts: [{ p: [0, y1], lean: l1 }, { p: [0, y2], lean: l2 }], tail: tl, tailAt: [tail === 'br' ? 20 : -20, 92], roles: [{ at, role: 'sage' }] }) };
};
export default () => [
  S({ name: 'rise 24 parallel, sage bottom', l1: 66, y1: -34, l2: 66, y2: 24 }),
  S({ name: 'rise 24/14 fan, sage bottom', l1: 66, y1: -32, l2: 76, y2: 26 }),
  S({ name: 'rise 30/16 fan, sage bottom', l1: 60, y1: -34, l2: 74, y2: 24 }),
  S({ name: 'rise 30/16 fan, sage top', l1: 60, y1: -34, l2: 74, y2: 24, sage: 'top' }),
  S({ name: 'rise 30/16 fan, sage bottom, tail bl', l1: 60, y1: -34, l2: 74, y2: 24, tail: 'bl' }),
  S({ name: 'rise 16/30 (opens left), sage bottom', l1: 74, y1: -30, l2: 60, y2: 28 }),
  S({ name: 'rise 34/20 fan, sage top, tail bl', l1: 56, y1: -30, l2: 70, y2: 28, sage: 'top', tail: 'bl' }),
  S({ name: 'rise 20/34 fan, sage bottom low', l1: 70, y1: -38, l2: 56, y2: 30 }),
];
