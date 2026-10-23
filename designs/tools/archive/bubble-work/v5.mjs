export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  // vertical (with hanging tail, msg-2 DNA) + diagonal T on the right; junction low; D on top-right sage
  for (const [vx, jy, ang, nm, f] of [
    [-14, 34, -30, 'T1 | + / low (D sage)', ['char', 'sage', 'char']],
    [-14, 44, -38, 'T2 | + / lower steeper', ['char', 'sage', 'char']],
    [-8, 20, -22, 'T3 | + / mid', ['char', 'sage', 'char']],
    [-14, 34, -30, 'T4 3-tone', ['char', 'sage', 'sageL']],
  ]) {
    const v = cut([vx, 0], 0, G), d = cutA([vx, jy], ang, G);
    V.push({ name: nm, tail: hangTail(v, 138, -1, 44), pieces: [{ hps: [v.left] }, { hps: [v.right, d.neg] }, { hps: [v.right, d.pos] }], f });
  }
  // vertical + diagonal T on the LEFT (tail piece split): left-top char, left-bottom (tail) sageL, right D sage
  {
    const v = cut([8, 0], 0, G), d = cutA([8, -30], 150, G);
    V.push({ name: 'T5 | + \\ left', tail: hangTail(v, 138, -1, 44), pieces: [{ hps: [v.left, d.pos] }, { hps: [v.left, d.neg] }, { hps: [v.right] }], f: ['char', 'char', 'sage'] });
  }
  // fans of three cuts
  for (const [cuts, f, nm] of [
    [[[-48, 2], [-6, 16], [36, 30]], ['char', 'char', 'char', 'sage'], 'N1 2/16/30'],
    [[[-48, 30], [-6, 16], [36, 2]], ['char', 'char', 'char', 'sage'], 'N2 30/16/2'],
    [[[-50, 0], [-8, 14], [34, 28]], ['char', 'char', 'sage', 'char'], 'N3 0/14/28 sage 3rd'],
    [[[-44, 10], [0, 24], [42, 38]], ['char', 'sageD', 'char', 'sage'], 'N4 10/24/38 2 sage'],
  ]) {
    const g = 20; const c = cuts.map(([x, l]) => cut([x, 0], l, g));
    V.push({ name: nm, tail: hangTail(c[0], 138, -1, 30), pieces: [{ hps: [c[0].left] }, { hps: [c[0].right, c[1].left] }, { hps: [c[1].right, c[2].left] }, { hps: [c[2].right] }], f });
  }
  // parallel refinements
  for (const [l, x1, x2, f, nm] of [
    [26, -44, -2, ['char', 'char', 'sage'], 'P13 26 big sage'],
    [24, -30, 28, ['char', 'char', 'sage'], 'P14 24 even-ish'],
    [30, -40, 14, ['char', 'sage', 'char'], 'P15 30 sage mid'],
  ]) {
    const a = cut([x1, 0], l, G), b = cut([x2, 0], l, G);
    V.push({ name: nm, tail: hangTail(a, 138, -1, 44), pieces: [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right] }], f });
  }
};
