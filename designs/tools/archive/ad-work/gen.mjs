// Generic split-bubble definitions: any set of straight cuts (crossing or
// not); pieces = every non-empty sign combination; roles by sample points.
import { cut } from './lib.mjs';
import { piece } from './geo.mjs';
import { tailBubble } from './lib.mjs';

const inside = (h, p) => h.n[0] * p[0] + h.n[1] * p[1] - h.d >= 0;

// cuts: [{ p:[x,y], lean, gap }]; tail: { aA, aB, tip } (deg) or null
// roles: [{ at:[x,y], role }] -> piece containing point gets role; others 'ink'
// tailAt: point inside the tail owner piece (defaults to tail tip direction)
export function mk({ cuts, tail = null, roles = [], tailAt = null, gap = 23 }) {
  const C = cuts.map(c => cut(c.p, c.lean, c.gap ?? gap));
  const combos = [];
  const n = C.length;
  for (let m = 0; m < 1 << n; m++) combos.push(C.map((c, i) => ((m >> i) & 1 ? c.right : c.left)));
  const plain = tailBubble({ tip: null });
  const pieces = [];
  for (const hps of combos) {
    const segs = piece(plain, hps);
    if (!segs.length) continue;
    pieces.push({ hps });
  }
  // role assignment
  const roleOf = hps => {
    for (const r of roles) if (hps.every(h => inside(h, r.at))) return r.role;
    return 'ink';
  };
  for (const pc of pieces) pc.role = roleOf(pc.hps);
  let tailOwner = 0;
  if (tail) {
    const at = tailAt ?? [0, 95];
    tailOwner = Math.max(0, pieces.findIndex(pc => pc.hps.every(h => inside(h, at))));
  }
  return { tail: tail ?? { tip: null }, pieces, tailOwner };
}

// helper: x where an edge line (cut c, side) meets circle r=100, lower or upper
export function edgeHit(c, side = -1, lower = true, R = 100) {
  const th = ((c.lean - 90) * Math.PI) / 180;
  const dir = [Math.cos(th), Math.sin(th)];
  const nL = [Math.sin(th), -Math.cos(th)];
  const nn = side < 0 ? nL : [-nL[0], -nL[1]];
  const g = (c.gap ?? 23) / 2;
  const q = [c.p[0] + nn[0] * g, c.p[1] + nn[1] * g];
  const b = q[0] * dir[0] + q[1] * dir[1], cc = q[0] ** 2 + q[1] ** 2 - R * R;
  const t = lower ? -b - Math.sqrt(b * b - cc) : -b + Math.sqrt(b * b - cc);
  return [q[0] + t * dir[0], q[1] + t * dir[1]];
}
export const angOf = p => (Math.atan2(p[1], p[0]) * 180) / Math.PI;
