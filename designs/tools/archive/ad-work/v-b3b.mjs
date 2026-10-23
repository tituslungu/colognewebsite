import { concepts, hangTail } from './concepts.mjs';
import { cut } from './lib.mjs';
import { mk } from './gen.mjs';
import fs from 'fs';
const P = id => JSON.parse(fs.readFileSync(new URL(`./params/${id}.json`, import.meta.url), 'utf8')).shape;
const T = (aA, aB, tip) => ({ aA, aB, tip });
// fan through pivot Q: cut i passes through Q and (x_i, 0)
const fanCut = (Q, x) => ({ p: [x, 0], lean: (Math.atan2(Q[0] - x, -Q[1]) * 180) / Math.PI });
// cut through pivot Q at absolute direction lean
export default () => [
  { name: 'b3 current', def: concepts['bubble-3'](P('bubble-3')) },
  { name: 'fan \\\\ classic tail', def: mk({ cuts: [fanCut([-130, -220], -36), fanCut([-130, -220], 30)], tail: T(100, 135, [-30, 138]), tailAt: [-30, 90], roles: [{ at: [70, -40], role: 'sage' }] }) },
  { name: 'shallow fan, sage top', def: mk({ cuts: [{ p: [0, -34], lean: 66 }, { p: [0, 24], lean: 80 }], tail: T(62, 100, [44, 138]), tailAt: [20, 90], roles: [{ at: [40, -70], role: 'sage' }] }) },
  { name: 'shallow fan, sage bottom+tail', def: mk({ cuts: [{ p: [0, -30], lean: 64 }, { p: [0, 26], lean: 78 }], tail: T(62, 100, [44, 138]), tailAt: [20, 90], roles: [{ at: [20, 80], role: 'sage' }] }) },
  { name: 'shallow parallel 66', def: mk({ cuts: [{ p: [0, -36], lean: 66 }, { p: [0, 22], lean: 66 }], tail: T(62, 100, [44, 138]), tailAt: [20, 90], roles: [{ at: [20, 80], role: 'sage' }] }) },
  { name: 'shallow fan falling', def: mk({ cuts: [{ p: [0, -30], lean: 112 }, { p: [0, 30], lean: 98 }], tail: T(80, 118, [-40, 138]), tailAt: [-20, 90], roles: [{ at: [-40, -70], role: 'sage' }] }) },
  { name: 'fan / pivot top-right', def: mk({ cuts: [fanCut([150, -230], -30), fanCut([150, -230], 32)], tail: T(55, 92, [48, 138]), tailAt: [40, 85], roles: [{ at: [80, 0], role: 'sage' }] }) },
  { name: 'fan / pivot below-left', def: mk({ cuts: [fanCut([-160, 260], -30), fanCut([-160, 260], 30)], tail: T(55, 95, [50, 138]), tailAt: [40, 85], roles: [{ at: [80, 0], role: 'sage' }] }) },
];
