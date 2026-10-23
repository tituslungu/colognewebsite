import { half, disk, piecePath, trace } from './geo.mjs';
const cut = (x, y, a, g) => pt => {
  let h = half(x, y, a, 1, g / 2);
  const hh = half(x, y, a, 1, 0);
  if (hh.n[0] * pt[0] + hh.n[1] * pt[1] < hh.d) h = half(x, y, a, -1, g / 2);
  return h;
};
const C = disk(128, 120, 96);
const a = cut(134, 120, 74, 16), b = cut(184, 120, 62, 16);
for (const cs of [[C, a([0,128])], [C, a([256,128]), b([0,128])]]) {
  const t = trace(cs);
  console.log('seed', t.o, t.verts.map(v => [v.p.map(x=>x.toFixed(1)), v.a, v.b]));
  console.log(piecePath(cs, () => 5));
}
