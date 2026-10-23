export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  const P3 = (a, b) => [{ hps: [a.left] }, { hps: [a.right, b.left] }, { hps: [b.right] }];
  // vertical (tail, msg-2 DNA) + diagonal on right, gentle fan
  for (const [x1, x2, l2, f, nm] of [
    [-30, 30, 14, ['char', 'char', 'sage'], 'VF1 |/ 14'],
    [-30, 34, 18, ['char', 'sage', 'char'], 'VF2 |/ 18 sage mid'],
    [-36, 36, 18, ['char', 'char', 'sage'], 'VF3 |/ 18'],
    [-34, 22, -14, ['char', 'char', 'sage'], 'VF4 |\\ -14'],
  ]) {
    const a = cut([x1, 0], 0, G), b = cut([x2, 0], l2, G);
    V.push({ name: nm, tail: hangTail(a, 138, -1, 44), pieces: P3(a, b), f });
  }
  // slash on left (tail) + vertical on right (sage D)
  for (const [x1, l1, x2, f, nm] of [
    [-34, 18, 30, ['char', 'char', 'sage'], 'SV1 /| 18'],
    [-40, 22, 22, ['char', 'char', 'sage'], 'SV2 /| 22'],
    [-26, -16, 30, ['char', 'char', 'sage'], 'SV3 \\| -16'],
  ]) {
    const a = cut([x1, 0], l1, G), b = cut([x2, 0], 0, G);
    V.push({ name: nm, tail: hangTail(a, 138, -1, 44), pieces: P3(a, b), f });
  }
  // mirrored "\ /" gentle (V opening up) and "/ \"
  {
    const a = cut([-30, 0], -12, G), b = cut([30, 0], 12, G);
    V.push({ name: 'M1 \\ / gentle', tail: hangTail(a, 138, -1, 44), pieces: P3(a, b), f: ['char', 'char', 'sage'] });
  }
  {
    const a = cut([-30, 0], 12, G), b = cut([30, 0], -12, G);
    V.push({ name: 'M2 / \\ gentle', tail: hangTail(a, 138, -1, 44), pieces: P3(a, b), f: ['char', 'char', 'sage'] });
  }
};
