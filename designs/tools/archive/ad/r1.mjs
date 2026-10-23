import { K, S, W, WH, svg, circ, rrect, notched, P } from './geo.mjs';
const out = {};
const both = (name, f) => { out[name] = { tile: svg(f(S, W), K), mono: svg(f(WH, WH)) }; };
// 1 current table-1
both('1 T1 current ÷', (t, d) => rrect(46, 109, 164, 38, 19, t) + circ(128, 109 - 12 - 26, 26, d) + circ(128, 147 + 12 + 26, 26, d));
// 2 nested stadium table for two
both('2 T1 nested pill', (t, d) => {
  const cy = 128, h = 84, w = 176, r = 27, g = 8; const yT = cy - h / 2, yB = cy + h / 2;
  return notched(`<rect x="${128 - w / 2}" y="${yT}" width="${w}" height="${h}" rx="${h / 2}"/>`, [{ x: 128, y: yT - 4, r: r + g }, { x: 128, y: yB + 4, r: r + g }], t) + circ(128, yT - 4, r, d) + circ(128, yB + 4, r, d);
});
// 3 nested slab (rounded rect)
both('3 T1 nested slab', (t, d) => {
  const h = 92, w = 168, r = 25, g = 8; const yT = 128 - h / 2, yB = 128 + h / 2;
  return notched(`<rect x="${128 - w / 2}" y="${yT}" width="${w}" height="${h}" rx="22"/>`, [{ x: 128, y: yT, r: r + g }, { x: 128, y: yB, r: r + g }], t) + circ(128, yT, r, d) + circ(128, yB, r, d);
});
// 4 diagonal offset table for two
both('4 T1 offset diners', (t, d) => rrect(42, 109, 172, 38, 19, t) + circ(88, 71, 26, d) + circ(168, 185, 26, d));
// 5 round cafe table for two, diners left/right nested
both('5 round table for two (L/R)', (t, d) => notched(`<circle cx="128" cy="128" r="60"/>`, [{ x: 58, y: 128, r: 34 }, { x: 198, y: 128, r: 34 }], t) + circ(58, 128, 26, d) + circ(198, 128, 26, d));
// 6 current table-2
both('6 T2 current', (t, d) => {
  const s = .95, T = 52 * s, R = 69 * s, dr = 21 * s, cut = 6;
  const seats = [-67.5, 22.5, 112.5, 202.5].map(a => P(128, 128, R, a));
  return notched(`<circle cx="128" cy="128" r="${T}"/>`, seats.map(([x, y]) => ({ x, y, r: dr + cut })), t) + seats.map(([x, y]) => circ(x, y, dr, d)).join('');
});
// 7 long table for four, nested 2+2
both('7 long table for four', (t, d) => {
  const h = 80, w = 196, r = 22, g = 7, yT = 128 - h / 2, yB = 128 + h / 2;
  const xs = [128 - 46, 128 + 46];
  const cuts = xs.flatMap(x => [{ x, y: yT, r: r + g }, { x, y: yB, r: r + g }]);
  return notched(`<rect x="${128 - w / 2}" y="${yT}" width="${w}" height="${h}" rx="${h / 2}"/>`, cuts, t) + cuts.map(c => circ(c.x, c.y, r, d)).join('');
});
// 8 round table, three diners on the far side (seat for you)
both('8 three across, your seat', (t, d) => {
  const T = 62, R = 72, dr = 22, cut = 7, cy = 140;
  const seats = [-145, -90, -35].map(a => P(128, cy, R, a));
  return notched(`<circle cx="128" cy="${cy}" r="${T}"/>`, seats.map(([x, y]) => ({ x, y, r: dr + cut })), t) + seats.map(([x, y]) => circ(x, y, dr, d)).join('');
});
// 9 five seats round upright
both('9 five seats round', (t, d) => {
  const T = 54, R = 70, dr = 19, cut = 6;
  const seats = [0, 1, 2, 3, 4].map(i => P(128, 128, R, -90 + i * 72));
  return notched(`<circle cx="128" cy="128" r="${T}"/>`, seats.map(([x, y]) => ({ x, y, r: dr + cut })), t) + seats.map(([x, y]) => circ(x, y, dr, d)).join('');
});
// 10 table for two, diners as half discs (shoulders) flat against table
both('10 T1 head+shoulders', (t, d) => {
  const bar = rrect(42, 112, 172, 32, 16, t);
  const top = `<path d="M84 96 A44 44 0 0 1 172 96 Z" fill="${d}" opacity="1"/>`;
  return bar + circ(128, 64, 22, d) + `<path fill="${d}" d="M78 100 a50 26 0 0 1 100 0 z"/>` + circ(128, 192, 22, d) + `<path fill="${d}" d="M78 156 a50 26 0 0 0 100 0 z"/>`;
});
// 11 long table vertical with diners both sides staggered 2+1
both('11 long table staggered 3', (t, d) => {
  const h = 84, w = 184, r = 24, g = 7, yT = 128 - h / 2, yB = 128 + h / 2;
  const cuts = [{ x: 128 - 44, y: yT, r: r + g }, { x: 128 + 44, y: yT, r: r + g }, { x: 128, y: yB, r: r + g }];
  return notched(`<rect x="${128 - w / 2}" y="${yT}" width="${w}" height="${h}" rx="${h / 2}"/>`, cuts, t) + cuts.map(c => circ(c.x, c.y, r, d)).join('');
});
// 12 two diners across a round table, diagonal
both('12 round table, two diagonal', (t, d) => {
  const T = 62, R = 74, dr = 26, cut = 8;
  const seats = [-135, 45].map(a => P(128, 128, R, a));
  return notched(`<circle cx="128" cy="128" r="${T}"/>`, seats.map(([x, y]) => ({ x, y, r: dr + cut })), t) + seats.map(([x, y]) => circ(x, y, dr, d)).join('');
});
export default out;
