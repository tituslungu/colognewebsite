// Writes dee-min upper/lower templates from parameters (JSON in argv[2] overrides defaults).
import fs from 'fs';
const DIR = '/Users/titus/repos/colognewebsite/designs/logos/dee-min';
const o = Object.assign({
  SW: 24, ov: 8,
  R: 78, d: 20, cx: 115, cy: 128,          // uppercase: arc radius, tip overshoot past vertical, centre
  r: 54, asc: 52, bx: 116, by: 152,        // lowercase: bowl radius, ascender above bowl, bowl centre
  g: [52, 192, 222, 62],                   // ink gradient (deep lower-left -> light upper-right)
}, JSON.parse(process.argv[2] || '{}'));
const P = (x) => +(+x).toFixed(2);
const pt = (cx, cy, r, deg) => [P(cx + r * Math.cos(deg * Math.PI / 180)), P(cy - r * Math.sin(deg * Math.PI / 180))];
const head = (label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Divi">
  <title>Divi</title>
  <!-- dee-min / ${label} -->
  <defs>
    <linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%TILE_A%"/>
      <stop offset="1" stop-color="%TILE_B%"/>
    </linearGradient>
    <linearGradient id="ink" x1="${o.g[0]}" y1="${o.g[1]}" x2="${o.g[2]}" y2="${o.g[3]}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%INK_A%"/>
      <stop offset="1" stop-color="%INK_B%"/>
    </linearGradient>
  </defs>
  <rect id="tile" width="256" height="256" fill="url(#tile-g)"/>
  <g fill="none" stroke="url(#ink)" stroke-width="${o.SW}" stroke-linecap="round" stroke-linejoin="round">
`;
const out = {};
{ // Uppercase: a straight stem and one arc; the arc's round tips curl back and rest on the stem.
  const { R, d, ov, cx, cy } = o;
  const [ex, ey] = pt(cx, cy, R, 90 + d), eyb = P(2 * cy - ey);
  const s = P(ex - o.SW + ov);
  out.upper = { stem: s, tips: [ex, ey] };
  fs.writeFileSync(`${DIR}/upper.tmpl.svg`, head('uppercase D: two strokes, a straight stem and one round arc whose round-capped tips curl back and rest on the stem (Cologne-style tubes that touch, no gap, no corner).') +
    `    <path d="M${s} ${P(cy - R)}V${P(cy + R)}"/>\n    <path d="M${ex} ${ey}A${R} ${R} 0 1 1 ${ex} ${eyb}"/>\n  </g>\n</svg>\n`);
}
{ // Lowercase: the Cologne C as the bowl; its round tips rest on one tall stem tangent to the bowl.
  const { r, asc, ov, bx, by } = o;
  const mu = Math.acos((r - o.SW + ov) / r) * 180 / Math.PI;
  const [tx, ty] = pt(bx, by, r, mu), tyb = P(2 * by - ty);
  out.lower = { mu: P(mu), stem: P(bx + r) };
  fs.writeFileSync(`${DIR}/lower.tmpl.svg`, head('lowercase d: two strokes, the Cologne C (mouth about 45 degrees) as the bowl, its round-capped tips resting on one tall stem tangent to the bowl.') +
    `    <path d="M${tx} ${ty}A${r} ${r} 0 1 0 ${tx} ${tyb}"/>\n    <path d="M${P(bx + r)} ${P(by - r - asc)}V${P(by + r)}"/>\n  </g>\n</svg>\n`);
}
console.log(JSON.stringify(o), JSON.stringify(out));
