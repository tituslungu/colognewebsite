import { upperCirc } from './circ.mjs';
const c = [
  ['U-C d.30', upperCirc({ xs: 62, cy: 128, R: 84, d: 26, rho: 26, gapDeg: 28 })],
  ['U-C d.45', upperCirc({ xs: 60, cy: 128, R: 80, d: 36, rho: 24, gapDeg: 26 })],
  ['U-C d.55', upperCirc({ xs: 58, cy: 128, R: 78, d: 44, rho: 22, gapDeg: 24 })],
];
process.env.CANDS = JSON.stringify(c);
process.env.NAME = 'explore2';
await import('./explore.mjs');
