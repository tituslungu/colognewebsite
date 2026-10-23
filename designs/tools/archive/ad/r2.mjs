import { K, S, W, WH, svg, circ, rrect, notched, P } from './geo.mjs';
const out = {};
const both = (name, f) => { out[name] = { tile: svg(f(S, W), K), mono: svg(f(WH, WH)) }; };
const nestRound = (T, R, dr, cut, angs, cy = 128) => (t, d) => {
  const seats = angs.map(a => P(128, cy, R, a));
  return notched(`<circle cx="128" cy="${cy}" r="${T}"/>`, cut ? seats.map(([x, y]) => ({ x, y, r: dr + cut })) : [], t) + seats.map(([x, y]) => circ(x, y, dr, d)).join('');
};
both('G1 cardinal 4 shallow', nestRound(58, 74, 20, 6, [-90, 0, 90, 180]));
both('G2 diagonal 4 nested', nestRound(58, 74, 20, 6, [-135, -45, 45, 135]));
both('G3 detached 4 @22.5', nestRound(50, 82, 19, 0, [-67.5, 22.5, 112.5, 202.5]));
both('G4 six nested upright', nestRound(62, 78, 15, 5, [-90, -30, 30, 90, 150, 210]));
both('G6 straddling no cut', (t, d) => nestRound(56, 62, 20, 0, [-67.5, 22.5, 112.5, 202.5])(t, d));
// offset table for two
const off = (bw, bh, r, gap, dx) => (t, d) => rrect(128 - bw / 2, 128 - bh / 2, bw, bh, bh / 2, t) + circ(128 - dx, 128 - bh / 2 - gap - r, r, d) + circ(128 + dx, 128 + bh / 2 + gap + r, r, d);
const offR = (bw, bh, r, gap, dx) => (t, d) => rrect(128 - bw / 2, 128 - bh / 2, bw, bh, bh / 2, t) + circ(128 + dx, 128 - bh / 2 - gap - r, r, d) + circ(128 - dx, 128 + bh / 2 + gap + r, r, d);
both('O1 offset ±36 (\\)', off(172, 38, 26, 12, 36));
both('O2 offset ±36 (/)', offR(172, 38, 26, 12, 36));
both('O3 offset ±50 r28', off(184, 40, 28, 12, 50));
both('O4 offset ±24 subtle', off(168, 38, 26, 12, 24));
both('O5 offset, bar 44 thick', off(176, 46, 26, 12, 40));
both('O6 offset, gap 16, r24', off(172, 36, 24, 16, 40));
export default out;
