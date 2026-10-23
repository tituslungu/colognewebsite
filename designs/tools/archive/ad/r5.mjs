import { K, S, W, WH, svg, circ, rrect } from './geo.mjs';
const out = {};
const both = (name, f) => { out[name] = { tile: svg(f(S, W), K), mono: svg(f(WH, WH)) }; };
const off = ({ L, t, r, gap, dx = L / 4, s = 0.92, rx = t / 2 }) => (tf, df) => {
  const dy = t / 2 + gap + r;
  return rrect(128 - L * s / 2, 128 - t * s / 2, L * s, t * s, rx * s, tf) + circ(128 - dx * s, 128 - dy * s, r * s, df) + circ(128 + dx * s, 128 + dy * s, r * s, df);
};
both('S1 L180 t52 rx14 r26 g10', off({ L: 180, t: 52, r: 26, gap: 10, rx: 14 }));
both('S2 L180 t52 rx18 r26 g10', off({ L: 180, t: 52, r: 26, gap: 10, rx: 18 }));
both('S3 L184 t48 rx14 r26 g10', off({ L: 184, t: 48, r: 26, gap: 10, rx: 14 }));
both('S4 L176 t56 rx16 r26 g10', off({ L: 176, t: 56, r: 26, gap: 10, rx: 16 }));
both('S5 L184 t52 rx12 r27 g11', off({ L: 184, t: 52, r: 27, gap: 11, rx: 12 }));
both('S6 L176 t44 rx12 r26 g12', off({ L: 176, t: 44, r: 26, gap: 12, rx: 12 }));
both('P pill ref', off({ L: 176, t: 38, r: 26, gap: 12 }));
both('S7 sym slab (no offset)', off({ L: 176, t: 52, r: 26, gap: 10, rx: 14, dx: 0 }));
both('S8 L180 t52 rx14 r26 g10 s1.0', off({ L: 180, t: 52, r: 26, gap: 10, rx: 14, s: 1 }));
export default out;
