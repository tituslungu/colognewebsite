export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  const T = { aA: 104, aB: 156, tip: [-64, 132] };
  // shallow parallel bands (rising to the right), angle = direction deg in SVG (negative = rising)
  for (const [a, y1, y2, f, nm] of [
    [-14, -30, 22, ['sage', 'char', 'char'], 'S1 bands -14'],
    [-14, -40, 10, ['char', 'sage', 'char'], 'S1b bands mid sage'],
    [-20, -24, 30, ['sage', 'char', 'char'], 'S1c bands -20'],
  ]) {
    const c1 = cutA([0, y1], a, G), c2 = cutA([0, y2], a, G);
    V.push({ name: nm, tail: T, pieces: [{ hps: [c1.neg] }, { hps: [c1.pos, c2.neg] }, { hps: [c2.pos] }], f });
  }
  // fanned shallow
  {
    const c1 = cutA([0, -30], -4, G), c2 = cutA([0, 22], -24, G);
    V.push({ name: 'S2 shallow fan', tail: T, pieces: [{ hps: [c1.neg] }, { hps: [c1.pos, c2.neg] }, { hps: [c2.pos] }], f: ['sage', 'char', 'char'] });
  }
  // shallow + steep crossing
  {
    const h = cutA([0, -6], -16, G), s = cut([12, 0], 22, G);
    V.push({ name: 'S3 cross', tail: T, pieces: [{ hps: [h.neg, s.left] }, { hps: [h.neg, s.right] }, { hps: [h.pos, s.left] }, { hps: [h.pos, s.right] }], f: ['char', 'sage', 'char', 'char'] });
  }
  {
    const h = cutA([0, 18], -16, G), s = cut([-14, 0], 22, G);
    V.push({ name: 'S3b cross low', tail: hangTail(s, 138, -1, 40), pieces: [{ hps: [h.neg, s.left] }, { hps: [h.neg, s.right] }, { hps: [h.pos, s.left] }, { hps: [h.pos, s.right] }], f: ['char', 'sage', 'char', 'char'] });
  }
  // T: shallow full + steep stem up
  {
    const h = cutA([0, 14], -16, G), s = cut([-6, 0], 20, G);
    V.push({ name: 'S4 T stem up', tail: T, pieces: [{ hps: [h.neg, s.left] }, { hps: [h.neg, s.right] }, { hps: [h.pos] }], f: ['char', 'sage', 'char'] });
  }
  // T: shallow full + steep stem down
  {
    const h = cutA([0, -18], -16, G), s = cut([10, 0], 20, G);
    V.push({ name: 'S5 T stem down', tail: hangTail(s, 138, -1, 40), pieces: [{ hps: [h.neg] }, { hps: [h.pos, s.left] }, { hps: [h.pos, s.right] }], f: ['sage', 'char', 'char'] });
  }
  // steep / full + perpendicular on the right only
  {
    const s = cut([-16, 0], 28, G), h = cutA([20, 10], -28 - 0, G);
    V.push({ name: 'S6 / + perp right', tail: hangTail(s, 138, -1, 44), pieces: [{ hps: [s.left] }, { hps: [s.right, h.neg] }, { hps: [s.right, h.pos] }], f: ['char', 'sage', 'char'] });
  }
  // vertical (msg-2) + shallow on the right only
  {
    const v = cut([-10, 0], 0, G), h = cutA([30, 20], -16, G);
    V.push({ name: 'S7 | + shallow right', tail: hangTail(v, 138, -1, 44), pieces: [{ hps: [v.left] }, { hps: [v.right, h.neg] }, { hps: [v.right, h.pos] }], f: ['char', 'sage', 'char'] });
  }
  // vertical + shallow full crossing
  {
    const v = cut([-8, 0], 0, G), h = cutA([0, 26], -16, G);
    V.push({ name: 'S8 | x shallow', tail: { aA: 104, aB: 156, tip: [-64, 132] }, pieces: [{ hps: [v.left, h.neg] }, { hps: [v.left, h.pos] }, { hps: [v.right, h.neg] }, { hps: [v.right, h.pos] }], f: ['char', 'char', 'sage', 'char'] });
  }
  // steep / + shallow crossing with sage top-right only, tail from steep
  {
    const s = cut([-10, 0], 26, G), h = cutA([0, 20], -12, G);
    V.push({ name: 'S9 / x shallow', tail: hangTail(s, 138, -1, 40), pieces: [{ hps: [s.left, h.neg] }, { hps: [s.left, h.pos] }, { hps: [s.right, h.neg] }, { hps: [s.right, h.pos] }], f: ['char', 'char', 'sage', 'char'] });
  }
  // parallel with wide sage middle
  {
    const c1 = cut([-38, 0], 26, G), c2 = cut([20, 0], 26, G);
    V.push({ name: 'P9 / wide sage mid', tail: hangTail(c1, 138, -1, 44), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right] }], f: ['char', 'sage', 'char'] });
  }
  // parallel, tail on the right piece at bottom (hang from right cut, right side)
  {
    const c1 = cut([-30, 0], 26, G), c2 = cut([24, 0], 26, G);
    V.push({ name: 'P10 / tail mid', tail: hangTail(c1, 138, +1, 34), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right] }], f: ['char', 'char', 'sage'] });
  }
};
