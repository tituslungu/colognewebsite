// Geometry helpers for the portion-* logo concepts.
// A "piece" is a convex region: the intersection of half-planes and (optionally)
// one disk. Its boundary is traced exactly and every corner gets a true arc fillet.
// SVG coordinates (y down). Output paths are traced clockwise on screen.

const EPS = 1e-9;
export const rad = d => (d * Math.PI) / 180;
const fmt = v => {
  const s = (Math.round(v * 100) / 100).toFixed(2);
  return s.replace(/\.?0+$/, '').replace(/^-0$/, '0');
};
export const f = fmt;

// Half-plane { kind:'line', n:[nx,ny] (unit, pointing INTO the region), d } : n.p >= d
export function half(px, py, angleDeg, side, inset = 0) {
  // line through (px,py) with direction angleDeg; side=+1 keeps the left-hand normal side
  const a = rad(angleDeg);
  const dir = [Math.cos(a), Math.sin(a)];
  let n = [-dir[1], dir[0]];
  if (side < 0) n = [-n[0], -n[1]];
  return { kind: 'line', n, d: n[0] * px + n[1] * py + inset };
}
// Half-plane from a point and an inward normal angle.
export function halfN(px, py, normalDeg, inset = 0) {
  const a = rad(normalDeg);
  const n = [Math.cos(a), Math.sin(a)];
  return { kind: 'line', n, d: n[0] * px + n[1] * py + inset };
}
export function disk(cx, cy, R) { return { kind: 'disk', c: [cx, cy], R }; }

const inside = (cs, p, tol = 1e-6) => cs.every(c => c.kind === 'line'
  ? c.n[0] * p[0] + c.n[1] * p[1] >= c.d - tol
  : Math.hypot(p[0] - c.c[0], p[1] - c.c[1]) <= c.R + tol);

function rayHit(c, o, u) {
  // distance t>0 at which ray o + t u leaves constraint c (Infinity if never)
  if (c.kind === 'line') {
    const nu = c.n[0] * u[0] + c.n[1] * u[1];
    if (nu >= -EPS) return Infinity;
    return (c.d - (c.n[0] * o[0] + c.n[1] * o[1])) / nu;
  }
  const dx = o[0] - c.c[0], dy = o[1] - c.c[1];
  const b = dx * u[0] + dy * u[1];
  const cc = dx * dx + dy * dy - c.R * c.R;
  return -b + Math.sqrt(Math.max(0, b * b - cc));
}

function intersect(a, b, near) {
  // intersection points of two constraint boundaries; returns the one nearest `near`
  let pts = [];
  if (a.kind === 'line' && b.kind === 'line') {
    const det = a.n[0] * b.n[1] - a.n[1] * b.n[0];
    if (Math.abs(det) < EPS) return null;
    pts = [[(a.d * b.n[1] - a.n[1] * b.d) / det, (a.n[0] * b.d - a.d * b.n[0]) / det]];
  } else {
    const L = a.kind === 'line' ? a : b, C = a.kind === 'line' ? b : a;
    if (C.kind !== 'disk') {
      // two circles
      return circleCircle(a, b, near);
    }
    const t0 = [L.n[1], -L.n[0]];
    const p0 = [L.n[0] * L.d, L.n[1] * L.d];
    const dx = p0[0] - C.c[0], dy = p0[1] - C.c[1];
    const bq = dx * t0[0] + dy * t0[1];
    const cq = dx * dx + dy * dy - C.R * C.R;
    const disc = bq * bq - cq;
    if (disc < 0) return null;
    const s = Math.sqrt(disc);
    pts = [-bq - s, -bq + s].map(t => [p0[0] + t * t0[0], p0[1] + t * t0[1]]);
  }
  pts.sort((p, q) => Math.hypot(p[0] - near[0], p[1] - near[1]) - Math.hypot(q[0] - near[0], q[1] - near[1]));
  return pts[0];
}
function circleCircle(a, b, near) {
  const d = Math.hypot(b.c[0] - a.c[0], b.c[1] - a.c[1]);
  const l = (a.R * a.R - b.R * b.R + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, a.R * a.R - l * l));
  const ex = (b.c[0] - a.c[0]) / d, ey = (b.c[1] - a.c[1]) / d;
  const mx = a.c[0] + l * ex, my = a.c[1] + l * ey;
  const pts = [[mx - h * ey, my + h * ex], [mx + h * ey, my - h * ex]];
  pts.sort((p, q) => Math.hypot(p[0] - near[0], p[1] - near[1]) - Math.hypot(q[0] - near[0], q[1] - near[1]));
  return pts[0];
}

// Inward offset of a constraint by r (the locus of fillet centres).
function offset(c, r) {
  if (c.kind === 'line') return { kind: 'line', n: c.n, d: c.d + r };
  return { kind: 'disk', c: c.c, R: c.R - r };
}
function tangentPoint(c, center, r) {
  if (c.kind === 'line') return [center[0] - c.n[0] * r, center[1] - c.n[1] * r];
  const k = c.R / (c.R - r);
  return [c.c[0] + (center[0] - c.c[0]) * k, c.c[1] + (center[1] - c.c[1]) * k];
}

// Trace the convex region and return { edges:[{c, from, to}], verts }.
export function trace(cs, seed) {
  // interior seed: provided, or the centroid of a coarse inside-sample
  let o = seed;
  if (!o) {
    let sx = 0, sy = 0, k = 0;
    for (let x = -100; x <= 400; x += 2) for (let y = -100; y <= 400; y += 2)
      if (inside(cs, [x, y], -0.5)) { sx += x; sy += y; k++; }
    if (!k) throw new Error('empty region');
    o = [sx / k, sy / k];
  }
  const N = 7200;
  const owner = [];
  for (let i = 0; i < N; i++) {
    const a = (2 * Math.PI * i) / N;
    const u = [Math.cos(a), Math.sin(a)];
    let best = Infinity, bi = -1;
    cs.forEach((c, j) => { const t = rayHit(c, o, u); if (t < best) { best = t; bi = j; } });
    owner.push({ j: bi, p: [o[0] + best * u[0], o[1] + best * u[1]] });
  }
  // rotate so that index 0 starts a run
  let start = 0;
  while (owner[start].j === owner[(start - 1 + N) % N].j) { start++; if (start >= N) break; }
  const runs = [];
  for (let k = 0; k < N; k++) {
    const e = owner[(start + k) % N];
    if (!runs.length || runs[runs.length - 1].j !== e.j) runs.push({ j: e.j, first: e.p, last: e.p });
    else runs[runs.length - 1].last = e.p;
  }
  // drop tiny runs (numerical slivers)
  const rr = runs.filter(r => Math.hypot(r.first[0] - r.last[0], r.first[1] - r.last[1]) > 1e-3 || runs.length <= 2);
  const verts = [];
  for (let k = 0; k < rr.length; k++) {
    const A = rr[k], B = rr[(k + 1) % rr.length];
    const v = intersect(cs[A.j], cs[B.j], A.last);
    verts.push({ p: v, a: A.j, b: B.j });
  }
  return { cs, verts, o };
}

// Build a filleted path. radius(ci, cj, cs) gives the fillet radius at the vertex
// where constraint ci (incoming) meets cj (outgoing).
export function piecePath(cs, radius, seed) {
  const { verts } = trace(cs, seed);
  const n = verts.length;
  const scale = verts.map(() => 1);
  const corner = (v, k) => {
    const r = radius(cs[v.a], cs[v.b], v.a, v.b) * scale[k];
    if (!r) return { tin: v.p, tout: v.p, r: 0, a: v.a, b: v.b };
    const center = intersect(offset(cs[v.a], r), offset(cs[v.b], r), v.p);
    if (!center) return { tin: v.p, tout: v.p, r: 0, a: v.a, b: v.b };
    return { tin: tangentPoint(cs[v.a], center, r), tout: tangentPoint(cs[v.b], center, r), r, a: v.a, b: v.b, center };
  };
  // edge k runs from corner k-1 to corner k along constraint verts[k].a
  const overlaps = corners => {
    const bad = [];
    for (let k = 0; k < n; k++) {
      const prev = corners[(k - 1 + n) % n], cur = corners[k], c = cs[cur.a];
      const v0 = verts[(k - 1 + n) % n].p, v1 = verts[k].p;
      if (c.kind === 'line') {
        const ex = cur.tin[0] - prev.tout[0], ey = cur.tin[1] - prev.tout[1];
        if (ex * (v1[0] - v0[0]) + ey * (v1[1] - v0[1]) < -1e-6) bad.push(k);
      } else {
        const ang = p => Math.atan2(p[1] - c.c[1], p[0] - c.c[0]);
        let sw = ang(cur.tin) - ang(prev.tout); while (sw < 0) sw += 2 * Math.PI;
        let vs = ang(v1) - ang(v0); while (vs < 0) vs += 2 * Math.PI;
        if (sw > vs + 1e-6) bad.push(k);
      }
    }
    return bad;
  };
  let corners = verts.map(corner);
  for (let it = 0; it < 60; it++) {
    const bad = overlaps(corners);
    if (!bad.length) break;
    for (const k of bad) { scale[k] *= 0.85; scale[(k - 1 + n) % n] *= 0.85; }
    corners = verts.map(corner);
  }
  let d = '';
  for (let k = 0; k < n; k++) {
    const prev = corners[(k - 1 + n) % n], cur = corners[k];
    if (k === 0) d += `M${fmt(prev.tout[0])} ${fmt(prev.tout[1])}`;
    const c = cs[cur.a];
    if (c.kind === 'line') d += `L${fmt(cur.tin[0])} ${fmt(cur.tin[1])}`;
    else {
      const a0 = Math.atan2(prev.tout[1] - c.c[1], prev.tout[0] - c.c[0]);
      const a1 = Math.atan2(cur.tin[1] - c.c[1], cur.tin[0] - c.c[0]);
      let sweep = a1 - a0; while (sweep < 0) sweep += 2 * Math.PI;
      const large = sweep > Math.PI ? 1 : 0;
      d += `A${fmt(c.R)} ${fmt(c.R)} 0 ${large} 1 ${fmt(cur.tin[0])} ${fmt(cur.tin[1])}`;
    }
    if (cur.r) d += `A${fmt(cur.r)} ${fmt(cur.r)} 0 0 1 ${fmt(cur.tout[0])} ${fmt(cur.tout[1])}`;
  }
  return d + 'Z';
}

// Area of a convex region (numerical, for checking share proportions).
export function area(cs) {
  let k = 0;
  const s = 0.5;
  for (let x = -40; x <= 300; x += s) for (let y = -40; y <= 300; y += s) if (inside(cs, [x, y], 0)) k++;
  return k * s * s;
}

// Helpers for transforms of path strings (uniform scale + translate).
export function tx(d, s, dx, dy) {
  // only handles M L A Z with absolute coords as produced above
  return d.replace(/([MLA])([^MLAZ]*)/g, (m, cmd, args) => {
    const v = args.trim().split(/[ ,]+/).map(Number);
    if (cmd === 'A') {
      return 'A' + [fmt(v[0] * s), fmt(v[1] * s), v[2], v[3], v[4], fmt(v[5] * s + dx), fmt(v[6] * s + dy)].join(' ');
    }
    return cmd + fmt(v[0] * s + dx) + ' ' + fmt(v[1] * s + dy);
  });
}
