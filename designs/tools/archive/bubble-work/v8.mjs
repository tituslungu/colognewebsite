export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  const P4 = c => [{ hps: [c[0].left] }, { hps: [c[0].right, c[1].left] }, { hps: [c[1].right, c[2].left] }, { hps: [c[2].right] }];
  const g = 19;
  {
    const c = [cut([-52, 0], 2, g), cut([-8, 0], 16, g), cut([38, 0], 30, g)];
    V.push({ name: 'G1 fan 2/16/30', tail: hangTail(c[0], 138, -1, 32), pieces: P4(c), f: ['char', 'char', 'char', 'sage'] });
  }
  {
    const c = [cut([-54, 0], 30, g), cut([-12, 0], 18, g), cut([34, 0], 6, g)];
    V.push({ name: 'G1b fan 30/18/6', tail: hangTail(c[0], 138, -1, 32), pieces: P4(c), f: ['char', 'char', 'char', 'sage'] });
  }
  {
    const c = [cut([-52, 0], 28, g), cut([-14, 0], 28, g), cut([34, 0], 28, g)];
    V.push({ name: 'G2 4 slices 28', tail: hangTail(c[0], 138, -1, 32), pieces: P4(c), f: ['char', 'char', 'char', 'sage'] });
  }
  {
    const c = [cut([-52, 0], 28, g), cut([-14, 0], 28, g), cut([34, 0], 28, g)];
    V.push({ name: 'G2b 4 slices sage 2', tail: hangTail(c[0], 138, -1, 32), pieces: P4(c), f: ['char', 'char', 'sage', 'char'] });
  }
  // Y near bottom with tail hanging from the stem (stem = vertical cut, bottom part)
  {
    const J = [-14, 40];
    const stem = cut([-14, 0], 0, G);
    V.push({ name: 'G3 Y low', tail: hangTail(stem, 138, -1, 40), pieces: [
      { hps: wedge(J, 90, 200) }, { hps: wedge(J, 200, 290 + 18) }, { hps: wedge(J, -52, 90) }], f: ['char', 'sage', 'char'], tailOwner: 0 });
  }
  // T: slanted bar + vertical stem down with tail (dome on top)
  {
    const h = cutA([0, -26], -14, G), s = cut([-4, 0], 0, G);
    V.push({ name: 'G4 slab + stem', tail: hangTail(s, 138, -1, 40), pieces: [{ hps: [h.pos, s.left] }, { hps: [h.neg] }, { hps: [h.pos, s.right] }], f: ['char', 'sage', 'char'], tailOwner: 0 });
  }
  // two chops crossing outside (bottom-left): big middle piece
  {
    const a = cut([-46, 0], 30, G), b = cutA([0, 52], -18 + 0, G);
    V.push({ name: 'G5 two chops', tail: hangTail(a, 138, -1, 40), pieces: [{ hps: [a.left] }, { hps: [a.right, b.neg] }, { hps: [a.right, b.pos] }], f: ['char', 'sage', 'char'], tailOwner: 0 });
  }
  // shallow parallel, tail on the middle band
  {
    const a = cutA([0, -34], -32, G), b = cutA([0, 22], -32, G);
    V.push({ name: 'G6 shallow band tail', tail: { aA: 104, aB: 150, tip: [-66, 130] }, pieces: [{ hps: [a.neg] }, { hps: [a.pos, b.neg] }, { hps: [b.pos] }], f: ['sage', 'char', 'char'], tailOwner: 1 });
  }
  // check bubble-3 fix
  {
    const a = cut([-34, 0], -18, G), b = cut([20, 0], 22, G);
    V.push({ name: 'V fixed (drop?)', tail: hangTail(a, 138, -1, 44), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right] }], f: ['char', 'char', 'sage'] });
  }
};
