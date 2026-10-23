// Builds the bubble path: ellipse (cx,cy,rx,ry) with a tail leaving at angle a (deg, outer edge)
// and rejoining at angle b (deg), tip at (tx,ty); o1/o2/i1/i2 are control points.
export function bubble({ cx, cy, rx, ry, a, b, t, o1, o2, i1, i2 }) {
  const P = th => [cx + rx * Math.cos(th * Math.PI / 180), cy + ry * Math.sin(th * Math.PI / 180)];
  const f = n => +n.toFixed(2);
  const A = P(a).map(f), B = P(b).map(f);
  return `M${A[0]} ${A[1]}C${o1[0]} ${o1[1]} ${o2[0]} ${o2[1]} ${t[0]} ${t[1]}C${i1[0]} ${i1[1]} ${i2[0]} ${i2[1]} ${B[0]} ${B[1]}A${rx} ${ry} 0 1 0 ${A[0]} ${A[1]}Z`;
}
if (process.argv[2]) console.log(bubble(JSON.parse(process.argv[2])));
