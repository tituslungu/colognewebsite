// Parametric generator for dee-ribbon templates. node gen.mjs <outdir> '<json params>'
import fs from 'fs'; import path from 'path';
const out = process.argv[2]; const P = Object.assign({
  S: 15, G: 34,                 // stroke, centre-to-centre line spacing (hairpin radius = G/2)
  // uppercase
  UT: 38.5, UB: 217.5, UX0: 56.5, UXC: 120, alpha: 0, // alpha = crescent crossing angle (deg); 0 = designer's tangent peel
  // lowercase
  LCX: 125, LCY: 148.5, LR: 69, Lhook: 40, LstemX: 189.33, LstemTop: 38.5, LstemBot: 217.5, Lshift: null,
  // gradient: angle (deg, deep->light rising to the right), t0/t1 = where deep ends and light reaches full along letter extent
  gAng: 12, gt0: 0.08, gt1: 0.9, dx: 0, dy: 0, ldx: 0, ldy: 0,
}, JSON.parse(process.argv[3] || '{}'));
const f = v => +v.toFixed(2);
const h = P.G / 2;
function gradient(bbox, ang) {
  // bbox [x0,y0,x1,y1]; axis direction u=(cos a, -sin a); project corners, map extent t0..t1
  const a = ang * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
  const cs = [[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[0], bbox[3]], [bbox[2], bbox[3]]].map(([x, y]) => x * ux + y * uy);
  const lo = Math.min(...cs), hi = Math.max(...cs); const cx = (bbox[0] + bbox[2]) / 2, cy = (bbox[1] + bbox[3]) / 2; const cp = cx * ux + cy * uy;
  const p0 = lo + (hi - lo) * P.gt0, p1 = lo + (hi - lo) * P.gt1;
  return [cx + (p0 - cp) * ux, cy + (p0 - cp) * uy, cx + (p1 - cp) * ux, cy + (p1 - cp) * uy].map(f);
}
const head = (comment, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Divi">
  <title>Divi</title>
${comment}
  <defs>
    <linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%TILE_A%"/>
      <stop offset="1" stop-color="%TILE_B%"/>
    </linearGradient>
    <linearGradient id="ink" x1="${g[0]}" y1="${g[1]}" x2="${g[2]}" y2="${g[3]}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%INK_A%"/>
      <stop offset="1" stop-color="%INK_B%"/>
    </linearGradient>
  </defs>
  <rect id="tile" width="256" height="256" fill="url(#tile-g)"/>
`;
// ---------- uppercase ----------
{
  const T = P.UT + P.dy, B = P.UB + P.dy, X0 = P.UX0 + P.dx, XC = P.UXC + P.dx, YM = (T + B) / 2;
  const Ro = (B - T) / 2, Ri = Ro - P.G; const Ti = T + P.G, Bi = B - P.G; const Xh = X0 + h;
  const ribbon = `M${f(X0)} ${f(T + h)} A${h} ${h} 0 0 1 ${f(Xh)} ${f(T)} H${f(XC)} A${f(Ro)} ${f(Ro)} 0 0 1 ${f(XC)} ${f(B)} H${f(Xh)} A${h} ${h} 0 0 1 ${f(X0)} ${f(B - h)} A${h} ${h} 0 0 1 ${f(Xh)} ${f(Bi)} H${f(XC)} A${f(Ri)} ${f(Ri)} 0 0 0 ${f(XC)} ${f(Ti)} H${f(Xh)} A${h} ${h} 0 0 1 ${f(X0)} ${f(T + h)} Z`;
  const SX = X0 + (P.UstemOff||0); const stem = `M${f(SX)} ${f(T + h)} V${f(B - h)}`;
  // crescent line: circle tangent internally to the inner bowl at its rightmost point (XC+Ri, YM)
  let cres;
  const xr = XC + Ri;
  if (!P.alpha) { // designer: outer bowl shifted G toward stem (tangent to bars)
    const cx = XC - P.G; cres = `M${f(cx)} ${f(T)} A${f(Ro)} ${f(Ro)} 0 0 1 ${f(cx)} ${f(B)}`;
  } else {
    const th = (90 - P.alpha) * Math.PI / 180; // crossing the bar y=T at angle alpha
    let R = (YM - T) / Math.sin(th), cx = xr - R, xc = cx + R * Math.cos(th), yc = T;
    if (xc > XC) { // crosses the bowl instead: solve numerically for R s.t. angle with bowl = alpha
      let lo = Ro, hi = 400;
      for (let i = 0; i < 80; i++) { const Rm = (lo + hi) / 2; const c = xr - Rm; // intersect circle (c,YM,Rm) with (XC,YM,Ro)
        const dd = XC - c; const xa = (Rm * Rm - Ro * Ro + dd * dd) / (2 * dd); const ya = Math.sqrt(Math.max(0, Rm * Rm - xa * xa));
        const px = c + xa; const v1 = [px - c, -ya], v2 = [px - XC, -ya]; const ang = Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))) * 180 / Math.PI;
        if (ang > P.alpha) hi = Rm; else lo = Rm; R = Rm; cx = c; xc = px; yc = YM - ya; }
    }
    cres = `M${f(xc)} ${f(yc)} A${f(R)} ${f(R)} 0 0 1 ${f(xc)} ${f(2 * YM - yc)}`;
    P._ucres = { R: f(R), cx: f(cx), xc: f(xc), yc: f(yc) }; P._uR = R;
  }
  const g = gradient([X0 - P.S / 2, T - P.S / 2, XC + Ro + P.S / 2, B + P.S / 2], P.gAng);
  const svg = head(`  <!-- dee-ribbon, uppercase D: the Cologne C mirrored into a bowl and closed with a straight stem.
       Measured from the C: stroke ~17 and lines ~37 apart at a 211-unit letter; here stroke ${P.S}, lines ${P.G}
       apart (centre to centre) at a 195-unit letter, hairpin turns of radius ${h}.
       1 the ribbon: outer line round the bowl, hairpin turns at both stem corners, inner line back
         (the C's terminal hooks, now sitting in the corners);
       2 the stem, tangent to both hairpins so each corner is one rounded loop;
       3 the crescent line (r${f(P._uR)}): it crosses the outer line at ${P.alpha} degrees just where the bar turns into the
         bowl, as the C's inner swing does near its top, and kisses the inner bowl at its far right. The
         crescent of space it leaves on the right is the C's left-side stress, mirrored.
       Gradient: deep at lower left to light at upper right, tilted ${P.gAng} degrees, fixed in tile space so
       overlapping strokes never show seams. Ink centroid sits on the tile centre; all ink within r116. -->`, g) +
  `  <g fill="none" stroke="url(#ink)" stroke-width="${P.S}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${ribbon}"/>
    <path d="${stem}"/>
    <path d="${cres}"/>
  </g>
</svg>
`;
  fs.writeFileSync(path.join(out, 'upper.tmpl.svg'), svg);
}
// ---------- lowercase ----------
{
  const cx = P.LCX + P.ldx, cy = P.LCY + P.ldy, R = P.LR, Ri = R - P.G, a = P.Lhook * Math.PI / 180;
  const po = [cx + R * Math.cos(a), cy - R * Math.sin(a)], pi = [cx + Ri * Math.cos(a), cy - Ri * Math.sin(a)];
  const qo = [po[0], 2 * cy - po[1]], qi = [pi[0], 2 * cy - pi[1]];
  const ribbon = `M${f(po[0])} ${f(po[1])} A${R} ${R} 0 1 0 ${f(qo[0])} ${f(qo[1])} A${h} ${h} 0 0 0 ${f(qi[0])} ${f(qi[1])} A${Ri} ${Ri} 0 1 1 ${f(pi[0])} ${f(pi[1])} A${h} ${h} 0 0 0 ${f(po[0])} ${f(po[1])} Z`;
  const sx = P.LstemX + P.ldx;
  const stem = `M${f(sx)} ${f(P.LstemTop + P.ldy)} V${f(P.LstemBot + P.ldy)}`;
  // crescent: outer circle shifted Lshift toward the stem
  const LS = P.Lshift ?? P.G; const dxh = LS / 2; const yy = Math.sqrt(R * R - dxh * dxh);
  const cres = `M${f(cx + dxh)} ${f(cy - yy)} A${R} ${R} 0 0 0 ${f(cx + dxh)} ${f(cy + yy)}`;
  const g = gradient([cx - R - P.S / 2, P.LstemTop + P.ldy - P.S / 2, sx + P.S / 2, cy + R + P.S / 2], P.lgAng ?? P.gAng);
  const svg = head(`  <!-- dee-ribbon, lowercase d: the Cologne C itself, unflipped, as the bowl, plus an ascender stem.
       Same stroke (${P.S}), line spacing (${P.G}), hairpin radius (${h}) and crossing angle as the uppercase.
       1 the ribbon: outer arc (r${R}) round the left, hairpin hooks at the right, inner arc (r${Ri}) back;
       2 the stem, ascender to baseline, half a stroke beyond the hooks so they stay round knobs
         (closer in, their counters press flat against the stem);
       3 the crescent line: the outer arc shifted ${P.Lshift ?? P.G} toward the stem, crossing the outer arc at about
         ${Math.round(2 * Math.asin((P.Lshift ?? P.G) / 2 / R) * 180 / Math.PI)} degrees and kissing the inner arc on the left, exactly as in the C.
       Placed so the tile centre falls between the outline centre and the ink centre; all ink within r116. -->`, g) +
  `  <g fill="none" stroke="url(#ink)" stroke-width="${P.S}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${ribbon}"/>
    <path d="${stem}"/>
    <path d="${cres}"/>
  </g>
</svg>
`;
  fs.writeFileSync(path.join(out, 'lower.tmpl.svg'), svg);
}
console.error(JSON.stringify(P._ucres || {}));
