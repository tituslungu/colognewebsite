export default ({ V, cut, cutA, wedge, hangTail, G }) => {
  // cuts through pivot Q and the points (x, 0)
  const fan = (Q, xs, g) => xs.map(x => cut([x, 0], Math.atan2(Q[0] - x, -Q[1]) * 180 / Math.PI, g));
  const P4 = c => [{ hps: [c[0].left] }, { hps: [c[0].right, c[1].left] }, { hps: [c[1].right, c[2].left] }, { hps: [c[2].right] }];
  const P3 = c => [{ hps: [c[0].left] }, { hps: [c[0].right, c[1].left] }, { hps: [c[1].right] }];
  for (const [Q, xs, f, nm, g] of [
    [[230, -330], [-50, -6, 40], ['char', 'char', 'char', 'sage'], 'H1 pivot up-right, 4', 19],
    [[150, -260], [-50, -8, 36], ['char', 'char', 'sage', 'char'], 'H2 pivot closer, 4', 19],
    [[-200, -330], [-44, 0, 44], ['char', 'char', 'char', 'sage'], 'H3 pivot up-left, 4', 19],
    [[200, -280], [-36, 24], ['char', 'char', 'sage'], 'H4 pivot up-right, 3', 21],
    [[-160, -300], [-34, 26], ['char', 'char', 'sage'], 'H5 pivot up-left, 3', 21],
    [[-40, 420], [-50, -6, 40], ['char', 'char', 'char', 'sage'], 'H6 pivot below, 4', 19],
  ]) {
    const c = fan(Q, xs, g);
    V.push({ name: nm + ' ' + c.map(k => k.lean.toFixed(0)).join('/'), tail: hangTail(c[0], 138, -1, 34), pieces: xs.length === 3 ? P4(c) : P3(c), f });
  }
};
