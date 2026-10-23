// Exact geometry for "split bubble" marks: a circle + tail, clipped by
// half-planes into pieces. Segments are lines and circular arcs, so output
// paths use true SVG arcs (no polygon approximation).
const EPS = 1e-7;
const TAU = Math.PI * 2;
export const deg = d => (d * Math.PI) / 180;

const ptOnArc = (s, th) => [s.c[0] + s.r * Math.cos(th), s.c[1] + s.r * Math.sin(th)];
const segStart = s => (s.t === 'L' ? s.p0 : ptOnArc(s, s.a0));
const segEnd = s => (s.t === 'L' ? s.p1 : ptOnArc(s, s.a1));
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Bubble: circle centre c, radius r; tail between circle angles aA < aB
// (radians, SVG y-down so 90deg = straight down), tip T. Clockwise outline.
export function bubble({ c, r, aA, aB, tip }) {
  if (tip == null) {
    return [{ t: 'A', c, r, a0: 0, a1: TAU }];
  }
  const PA = [c[0] + r * Math.cos(aA), c[1] + r * Math.sin(aA)];
  const PB = [c[0] + r * Math.cos(aB), c[1] + r * Math.sin(aB)];
  return [
    { t: 'A', c, r, a0: aB, a1: aA + TAU },
    { t: 'L', p0: PA, p1: tip },
    { t: 'L', p0: tip, p1: PB },
  ];
}

// Half-plane keep: n.p >= d.  Build from a line through point p with
// direction angle th (radians); side = +1 keeps the left-normal side.
// offset pushes the boundary into the kept side (half the gap).
export function hp(p, th, side, offset = 0) {
  // normal = rotate direction by +90deg (SVG coords) then * side
  const n = [-Math.sin(th) * side, Math.cos(th) * side];
  const d = n[0] * p[0] + n[1] * p[1] + offset;
  return { n, d };
}

const f = (h, p) => h.n[0] * p[0] + h.n[1] * p[1] - h.d;

function clipSeg(s, h) {
  if (s.t === 'L') {
    const f0 = f(h, s.p0), f1 = f(h, s.p1);
    if (f0 >= -EPS && f1 >= -EPS) return [s];
    if (f0 < -EPS && f1 < -EPS) return [];
    const t = f0 / (f0 - f1);
    const m = [s.p0[0] + t * (s.p1[0] - s.p0[0]), s.p0[1] + t * (s.p1[1] - s.p0[1])];
    return f0 >= -EPS ? [{ t: 'L', p0: s.p0, p1: m }] : [{ t: 'L', p0: m, p1: s.p1 }];
  }
  // arc: g(th) = n.c - d + r*|n| cos(th - phi)
  const nn = Math.hypot(h.n[0], h.n[1]);
  const phi = Math.atan2(h.n[1], h.n[0]);
  const k = (h.d - (h.n[0] * s.c[0] + h.n[1] * s.c[1])) / (s.r * nn);
  const lo = Math.min(s.a0, s.a1), hi = Math.max(s.a0, s.a1);
  let roots = [];
  if (k > -1 && k < 1) {
    const a = Math.acos(k);
    for (const base of [phi + a, phi - a]) {
      for (let m = -3; m <= 3; m++) {
        const th = base + m * TAU;
        if (th > lo + EPS && th < hi - EPS) roots.push(th);
      }
    }
  }
  roots.sort((x, y) => x - y);
  if (s.a1 < s.a0) roots.reverse();
  const cuts = [s.a0, ...roots, s.a1];
  const out = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    if (f(h, ptOnArc(s, mid)) >= 0) out.push({ t: 'A', c: s.c, r: s.r, a0: cuts[i], a1: cuts[i + 1] });
  }
  return out;
}

export function clip(segs, h) {
  const kept = [];
  for (const s of segs) kept.push(...clipSeg(s, h));
  if (!kept.length) return [];
  // merge adjacent arcs and stitch gaps with lines along the clip line
  const out = [];
  for (let i = 0; i < kept.length; i++) {
    const s = kept[i], nx = kept[(i + 1) % kept.length];
    out.push(s);
    const e = segEnd(s), b = segStart(nx);
    if (dist(e, b) > 1e-6) out.push({ t: 'L', p0: e, p1: b });
  }
  return out;
}

export function piece(base, hps) {
  let s = base;
  for (const h of hps) s = clip(s, h);
  return s;
}

const r2 = v => {
  const x = Math.round(v * 100) / 100;
  return (Object.is(x, -0) ? 0 : x).toString();
};

export function toPath(segs, tf = p => p) {
  if (!segs.length) return '';
  // drop zero-length segments
  segs = segs.filter(s => (s.t === 'L' ? dist(s.p0, s.p1) > 1e-4 : Math.abs(s.a1 - s.a0) > 1e-6));
  // a final straight edge back to the start is implied by Z
  if (segs.length >= 2 && segs[segs.length - 1].t === 'L' && dist(segEnd(segs[segs.length - 1]), segStart(segs[0])) < 1e-6) segs = segs.slice(0, -1);
  let d = '';
  const st = tf(segStart(segs[0]));
  d += `M${r2(st[0])} ${r2(st[1])}`;
  for (const s of segs) {
    const e = tf(segEnd(s));
    if (s.t === 'L') d += `L${r2(e[0])} ${r2(e[1])}`;
    else {
      const sw = s.a1 - s.a0;
      // a full circle must be split into two arcs
      if (Math.abs(sw) >= TAU - 1e-6) {
        const m = tf(ptOnArc(s, s.a0 + sw / 2));
        const R = r2(s.r * (tf.scale || 1));
        d += `A${R} ${R} 0 0 ${sw > 0 ? 1 : 0} ${r2(m[0])} ${r2(m[1])}`;
        d += `A${R} ${R} 0 0 ${sw > 0 ? 1 : 0} ${r2(e[0])} ${r2(e[1])}`;
      } else {
        const R = r2(s.r * (tf.scale || 1));
        d += `A${R} ${R} 0 ${Math.abs(sw) > Math.PI ? 1 : 0} ${sw > 0 ? 1 : 0} ${r2(e[0])} ${r2(e[1])}`;
      }
    }
  }
  return d + 'Z';
}

// affine: scale s then translate (tx,ty)
export function tfm(s, tx, ty) {
  const fn = p => [p[0] * s + tx, p[1] * s + ty];
  fn.scale = s;
  return fn;
}

// sampled outline points (for bbox / area / centroid / farthest-point checks)
export function sample(segs, n = 64) {
  const pts = [];
  for (const s of segs) {
    if (s.t === 'L') { for (let i = 0; i < n; i++) { const t = i / n; pts.push([s.p0[0] + t * (s.p1[0] - s.p0[0]), s.p0[1] + t * (s.p1[1] - s.p0[1])]); } }
    else for (let i = 0; i < n * 4; i++) pts.push(ptOnArc(s, s.a0 + (i / (n * 4)) * (s.a1 - s.a0)));
  }
  return pts;
}

export function polyArea(pts) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
    const c = x0 * y1 - x1 * y0;
    a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c;
  }
  a /= 2;
  return { area: Math.abs(a), cx: cx / (6 * a), cy: cy / (6 * a) };
}

export function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
