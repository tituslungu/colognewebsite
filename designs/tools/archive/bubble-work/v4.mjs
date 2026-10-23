export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  const P = (a, b, c) => [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right] }];
  // fans with modest angle differences
  for (const [l1, x1, l2, x2, f, nm] of [
    [14, -30, 34, 26, ['char', 'char', 'sage'], 'F5 14/34'],
    [34, -30, 14, 30, ['char', 'char', 'sage'], 'F6 34/14'],
    [0, -26, 26, 30, ['char', 'char', 'sage'], 'F7 0/26 (| /)'],
    [0, -30, 26, 26, ['char', 'sage', 'char'], 'F8 0/26 sage mid'],
    [26, -30, 0, 34, ['char', 'char', 'sage'], 'F9 26/0 (/ |)'],
    [-10, -26, 22, 28, ['char', 'char', 'sage'], 'F10 -10/22 (\\ /)'],
  ]) {
    const a = cut([x1, 0], l1, G), b = cut([x2, 0], l2, G);
    V.push({ name: nm, tail: hangTail(a, 138, -1, 44), pieces: P(a, b), f });
  }
  // 3 cuts, small fan steps
  {
    const g = 20, a = cut([-46, 0], 6, g), b = cut([-4, 0], 20, g), c = cut([38, 0], 34, g);
    V.push({ name: 'F11 6/20/34', tail: hangTail(a, 138, -1, 30), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right, c.left] }, { hps: [c.right] }], f: ['char', 'char', 'char', 'sage'] });
  }
  {
    const g = 20, a = cut([-44, 0], 0, g), b = cut([-2, 0], 18, g), c = cut([40, 0], 36, g);
    V.push({ name: 'F12 0/18/36 sage2', tail: hangTail(a, 138, -1, 30), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right, c.left] }, { hps: [c.right] }], f: ['char', 'char', 'sage', 'char'] });
  }
  // slid slices
  {
    const a = cut([-30, 0], 26, G), b = cut([26, 0], 26, G);
    const s = 12, d = [Math.sin(26 * Math.PI / 180) * s, -Math.cos(26 * Math.PI / 180) * s];
    V.push({ name: 'X1 slid mid', tail: hangTail(a, 138, -1, 44), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left], shift: d }, { hps: [b.right], shift: [d[0] * 2, d[1] * 2] }], f: ['char', 'char', 'sage'] });
  }
  {
    const a = cut([-6, 0], 0, G), b = cutA([0, 0], -26, G);
    V.push({ name: 'X2 vertical, right slid', tail: hangTail(a, 138, -1, 44), pieces: [{ hps: [a.left] }, { hps: [a.right], shift: [0, -14] }], f: ['char', 'sage'] });
  }
  // parallel with unequal 50/30/20 and sage the biggest (right)
  {
    const a = cut([-46, 0], 26, G), b = cut([-4, 0], 26, G);
    V.push({ name: 'P11 big sage right', tail: hangTail(a, 138, -1, 44), pieces: P(a, b), f: ['char', 'char', 'sage'] });
  }
  {
    const a = cut([-46, 0], 26, G), b = cut([-4, 0], 26, G);
    V.push({ name: 'P12 3-tone', tail: hangTail(a, 138, -1, 44), pieces: P(a, b), f: ['char', 'sageD', 'sage'] });
  }
};
