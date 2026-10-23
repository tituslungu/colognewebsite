export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  // ---- Parallel family
  for (const [lean, x1, x2, f, nm] of [
    [28, -34, 22, ['char', 'char', 'sage'], 'P1 / 28 sage right'],
    [28, -34, 22, ['sage', 'char', 'char'], 'P2 / 28 sage tail'],
    [28, -34, 22, ['char', 'sage', 'sageL'], 'P3 / 28 3-tone'],
    [20, -30, 26, ['char', 'char', 'sage'], 'P4 / 20'],
    [34, -24, 30, ['char', 'char', 'sage'], 'P5 / 34'],
    [28, -44, 4, ['char', 'sage', 'char'], 'P6 / 28 wide right'],
  ]) {
    const c1 = cut([x1, 0], lean, G), c2 = cut([x2, 0], lean, G);
    V.push({ name: nm, tail: hangTail(c1, 138, -1, 44), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right] }], f });
  }
  // backslash with tail at bottom-right hanging from right cut
  {
    const c1 = cut([-22, 0], -28, G), c2 = cut([34, 0], -28, G);
    V.push({ name: 'P7 \\ tail right', tail: hangTail(c2, 138, +1, 44), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right] }], f: ['sage', 'char', 'char'] });
  }
  // 4 slices
  {
    const g = 20, c1 = cut([-46, 0], 26, g), c2 = cut([-4, 0], 26, g), c3 = cut([36, 0], 26, g);
    V.push({ name: 'P8 4 slices', tail: hangTail(c1, 138, -1, 30), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right, c3.left] }, { hps: [c3.right] }], f: ['char', 'char', 'char', 'sage'] });
  }
  // ---- Vertical + diagonal family (keep the sage D on the right)
  {
    const v = cut([10, 0], 0, G);
    const d = cutA([-40, -36], -152, G); // from left edge up-right? direction angle
    V.push({ name: 'VD1 D + left cut', tail: hangTail(v, 138, -1, 44), pieces: [{ hps: [v.left, d.pos] }, { hps: [v.left, d.neg] }, { hps: [v.right] }], f: ['char', 'char', 'sage'] });
  }
  {
    const v = cut([10, 0], 0, G);
    const d = cutA([-40, 10], 30, G);
    V.push({ name: 'VD2 D + left down', tail: { aA: 105, aB: 160, tip: [-66, 128] }, pieces: [{ hps: [v.left, d.pos] }, { hps: [v.left, d.neg] }, { hps: [v.right] }], f: ['char', 'char', 'sage'] });
  }
  {
    const v = cut([-24, 0], 0, G);
    const d = cutA([30, -10], -32, G);
    V.push({ name: 'VD3 | then / right', tail: hangTail(v, 138, -1, 44), pieces: [{ hps: [v.left] }, { hps: [v.right, d.neg] }, { hps: [v.right, d.pos] }], f: ['char', 'sage', 'char'] });
  }
  {
    const v = cut([6, 0], 0, G);
    const d = cutA([0, 46], -30, G);
    V.push({ name: 'VD4 | x / low', tail: { aA: 105, aB: 160, tip: [-66, 128] }, pieces: [{ hps: [v.left, d.neg] }, { hps: [v.left, d.pos] }, { hps: [v.right, d.neg] }, { hps: [v.right, d.pos] }], f: ['char', 'char', 'sage', 'char'] });
  }
  // ---- Non-parallel (fanned) family
  {
    const c1 = cut([-30, 0], 10, G), c2 = cut([26, 0], 38, G);
    V.push({ name: 'F1 fan 10/38', tail: hangTail(c1, 138, -1, 44), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right] }], f: ['char', 'char', 'sage'] });
  }
  {
    const c1 = cut([-30, 0], 38, G), c2 = cut([30, 0], 10, G);
    V.push({ name: 'F2 fan 38/10', tail: hangTail(c1, 138, -1, 44), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right] }], f: ['char', 'char', 'sage'] });
  }
  {
    const g = 20, c1 = cut([-42, 0], 8, g), c2 = cut([0, 0], 26, g), c3 = cut([42, 0], 44, g);
    V.push({ name: 'F3 fan 8/26/44', tail: hangTail(c1, 138, -1, 30), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right, c3.left] }, { hps: [c3.right] }], f: ['char', 'char', 'char', 'sage'] });
  }
  {
    const g = 20, c1 = cut([-40, 0], 36, g), c2 = cut([2, 0], 18, g), c3 = cut([44, 0], 0, g);
    V.push({ name: 'F4 fan 36/18/0', tail: hangTail(c1, 138, -1, 30), pieces: [{ hps: [c1.left] }, { hps: [c1.right, c2.left] }, { hps: [c2.right, c3.left] }, { hps: [c3.right] }], f: ['char', 'char', 'char', 'sage'] });
  }
};
