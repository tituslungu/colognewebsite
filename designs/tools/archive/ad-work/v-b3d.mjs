import { mk } from './gen.mjs';
const T = (aA, aB, tip) => ({ aA, aB, tip });
const S = ({ l1 = 62, y1 = -32, l2 = 76, y2 = 26, sage = 'bottom', tail = T(62, 96, [46, 136]), name }) => {
  const at = sage === 'bottom' ? [0, 85] : sage === 'top' ? [0, -85] : [0, (y1 + y2) / 2];
  return { name: `${name} ${l1}@${y1} / ${l2}@${y2} sage ${sage}`, def: mk({ cuts: [{ p: [0, y1], lean: l1 }, { p: [0, y2], lean: l2 }], tail, tailAt: [30, 90], roles: [{ at, role: 'sage' }] }) };
};
export default () => [
  S({ name: 'A' }),
  S({ name: 'mid', sage: 'mid' }),
  S({ name: 'mid thinner', sage: 'mid', y1: -22, y2: 22 }),
  S({ name: 'top', sage: 'top' }),
  S({ name: 'small tail', tail: T(66, 94, [44, 130]) }),
  S({ name: 'fan wider', l1: 58, l2: 78, y1: -30, y2: 26 }),
  S({ name: 'lower cuts', l1: 62, y1: -22, l2: 76, y2: 36 }),
  S({ name: 'higher cuts', l1: 62, y1: -42, l2: 76, y2: 16 }),
];
