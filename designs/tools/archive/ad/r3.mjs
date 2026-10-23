import { K, S, W, WH, svg, circ, rrect } from './geo.mjs';
const out = {};
const both = (name, f) => { out[name] = { tile: svg(f(S, W), K), mono: svg(f(WH, WH)) }; };
// centred on the glyph's own bbox; s = scale
const off = (bw, bh, r, gap, dx, s = 1) => (t, d) => {
  const g = (x, y) => [128 + x * s, 128 + y * s];
  const dy = bh / 2 + gap + r;
  const [bx, by] = g(-bw / 2, -bh / 2);
  const [ax, ay] = g(-dx, -dy), [cx, cy] = g(dx, dy);
  return rrect(bx, by, bw * s, bh * s, bh * s / 2, t) + circ(ax, ay, r * s, d) + circ(cx, cy, r * s, d);
};
both('A sym ÷ (reference)', off(164, 38, 26, 12, 0));
both('B ±32', off(172, 38, 26, 12, 32));
both('C ±40', off(172, 38, 26, 12, 40));
both('D ±48', off(176, 38, 26, 12, 48));
both('E ±40 bar40 gap10 r26', off(176, 40, 26, 10, 40));
both('F ±40 r24 bar36 gap12', off(172, 36, 24, 12, 40, 1.05));
both('G ±44 r27 bar38 gap11 s1.05', off(176, 38, 27, 11, 44, 1.0));
both('H ±40 short bar 150', off(150, 38, 26, 12, 40));
both('I ±40 long bar 192', off(192, 38, 26, 12, 40));
export default out;
