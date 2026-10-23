import { bubble, hp, piece, toPath, tfm, sample, polyArea, bbox, deg } from './geo.mjs';
export { deg };

export const C = {
  char: '#2D2D2D', sage: '#6FAF8E', sageL: '#8CC4A5', sageD: '#3E7A5B', deep: '#24382E',
  off: '#FAFAF8', gray: '#ECEBE8', white: '#FFFFFF',
};

// A cut: line through point p (normalised coords, circle r=100 at origin)
// with lean from vertical in degrees (+ leans top to the right, like "/").
// Returns helpers to build the two kept half-planes with half-gap offset.
export function cut(p, lean, gap) {
  const th = deg(lean - 90); // direction pointing "up" the cut
  return {
    right: hp(p, th, +1, gap / 2), // the side to the right of an upward cut
    left: hp(p, th, -1, gap / 2),
    p, lean, gap,
  };
}
// general cut by direction angle (deg, SVG y-down); sides 'pos'/'neg'
export function cutA(p, angDeg, gap) {
  const th = deg(angDeg);
  return { pos: hp(p, th, +1, gap / 2), neg: hp(p, th, -1, gap / 2), p, angDeg, gap };
}

export function tailBubble(o = {}) {
  const r = o.r ?? 100;
  return bubble({ c: [0, 0], r, aA: deg(o.aA ?? 100), aB: deg(o.aB ?? 150), tip: o.tip === null ? null : (o.tip ?? [-62, 132]) });
}

// pieces: array of { hps: [...halfplanes], fill: idx }
export function build(def) {
  const base = tailBubble(def.tail || {});
  const plain = tailBubble({ ...(def.tail || {}), tip: null });
  const owner = def.tailOwner ?? 0;
  return def.pieces.map((pc, i) => {
    let segs = piece(i === owner ? base : plain, pc.hps);
    if (pc.shift) segs = shiftSegs(segs, pc.shift);
    return { segs, role: pc.role };
  });
}

export function shiftSegs(segs, [dx, dy]) {
  return segs.map(s => s.t === 'L' ? { ...s, p0: [s.p0[0] + dx, s.p0[1] + dy], p1: [s.p1[0] + dx, s.p1[1] + dy] } : { ...s, c: [s.c[0] + dx, s.c[1] + dy] });
}

export function stats(pieces) {
  const all = pieces.flatMap(p => sample(p.segs));
  const bb = bbox(all);
  let A = 0, X = 0, Y = 0;
  const areas = pieces.map(p => {
    const a = polyArea(sample(p.segs));
    A += a.area; X += a.cx * a.area; Y += a.cy * a.area;
    return a.area;
  });
  return { bb, area: A, cx: X / A, cy: Y / A, areas, pts: all };
}

// Fit pieces into a 256 box.  mode 'tile': farthest point from the
// tile centre <= R (circle-crop safe), anchored at a blend of the area
// centroid and the bbox centre.  mode 'box': bbox max side = R*2.
export function fit(pieces, { R = 110, mode = 'tile', blend = 0.5, cx = 128, cy = 128, dx = 0, dy = 0 } = {}) {
  const st = stats(pieces);
  const ax = blend * st.cx + (1 - blend) * (st.bb.x0 + st.bb.w / 2);
  const ay = blend * st.cy + (1 - blend) * (st.bb.y0 + st.bb.h / 2);
  let s;
  if (mode === 'tile') {
    const far = Math.max(...st.pts.map(([x, y]) => Math.hypot(x - ax, y - ay)));
    s = R / far;
  } else s = (R * 2) / Math.max(st.bb.w, st.bb.h);
  return tfm(s, cx - ax * s + dx, cy - ay * s + dy);
}

export function paths(pieces, tf, fills) {
  return pieces.map((p, i) => `<path fill="${fills[p.role ?? i] ?? fills[i]}" d="${toPath(p.segs, tf)}"/>`).join('');
}
export function onePath(pieces, tf, fill) {
  return `<path fill="${fill}" d="${pieces.map(p => toPath(p.segs, tf)).join('')}"/>`;
}
