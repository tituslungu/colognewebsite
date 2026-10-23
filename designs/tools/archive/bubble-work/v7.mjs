export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  const P4 = c => [{ hps: [c[0].left] }, { hps: [c[0].right, c[1].left] }, { hps: [c[1].right, c[2].left] }, { hps: [c[2].right] }];
  const g = 19;
  // pivot fans: all cuts through pivot Q (outside the circle)
  for (const [Q, leans, f, nm] of [
    [[-60, 260], [2, 16, 30], ['char', 'char', 'char', 'sage'], 'PF1 pivot below'],
    [[-40, 300], [4, 14, 24], ['char', 'char', 'sage', 'char'], 'PF2 pivot far below'],
    [[60, -300], [10, 20, 30], ['char', 'char', 'char', 'sage'], 'PF3 pivot far above'],
    [[0, 330], [-12, 2, 16], ['char', 'char', 'char', 'sage'], 'PF4 pivot below centre'],
    [[-20, 280], [-4, 10, 24], ['char', 'sageD', 'char', 'sage'], 'PF5 two tones'],
    [[-20, 280], [-4, 10, 24], ['char', 'char', 'sage', 'sageL'], 'PF6 graded'],
  ]) {
    const c = leans.map(l => cut(Q, l, g));
    V.push({ name: nm, tail: hangTail(c[0], 138, -1, 30), pieces: P4(c), f });
  }
  // progressive rotation, no shared pivot, unequal widths
  {
    const c = [cut([-50, 0], 4, g), cut([-8, 0], 18, g), cut([40, 0], 32, g)];
    V.push({ name: 'PR1 4/18/32 wide', tail: hangTail(c[0], 138, -1, 30), pieces: P4(c), f: ['char', 'char', 'char', 'sage'] });
  }
  // V asymmetric (check-ish)
  {
    const a = cut([-34, 0], -18, G), b = cut([20, 0], 22, G);
    V.push({ name: 'M3 \\ / check-ish', tail: hangTail(a, 138, -1, 44), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right] }], f: ['char', 'char', 'sage'] });
  }
  {
    const a = cut([-34, 0], -14, G), b = cut([26, 0], 14, G);
    V.push({ name: 'M4 V sage mid', tail: hangTail(a, 138, -1, 44), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right] }], f: ['char', 'sage', 'char'] });
  }
};
