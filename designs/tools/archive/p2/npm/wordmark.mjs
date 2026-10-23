// Outlines "DIVI" in Helvetica Neue Bold with +0.12em tracking, as SVG path data.
// divi(capHeight, x, baseline) -> { d, width, ink: {x0, x1} }
import * as fontkit from 'fontkit';
const font = fontkit.openSync('/System/Library/Fonts/HelveticaNeue.ttc').fonts.find(f => f.postscriptName === 'HelveticaNeue-Bold');
const fmt = v => (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, '').replace(/^-0$/, '0');

export function divi(capH, x = 0, baseline = 0, tracking = 0.12) {
  const s = capH / font.capHeight; // font units -> output units
  const run = font.layout('DIVI');
  let pen = 0, d = '';
  let inkX0 = Infinity, inkX1 = -Infinity;
  run.glyphs.forEach((g, i) => {
    for (const c of g.path.commands) {
      const a = c.args;
      const P = (k) => [x + (pen + a[k]) * s, baseline - a[k + 1] * s];
      const pts = [];
      if (c.command === 'moveTo') { const p = P(0); pts.push(p); d += `M${fmt(p[0])} ${fmt(p[1])}`; }
      else if (c.command === 'lineTo') { const p = P(0); pts.push(p); d += `L${fmt(p[0])} ${fmt(p[1])}`; }
      else if (c.command === 'quadraticCurveTo') { const p = P(0), q = P(2); pts.push(p, q); d += `Q${fmt(p[0])} ${fmt(p[1])} ${fmt(q[0])} ${fmt(q[1])}`; }
      else if (c.command === 'bezierCurveTo') { const p = P(0), q = P(2), r = P(4); pts.push(p, q, r); d += `C${fmt(p[0])} ${fmt(p[1])} ${fmt(q[0])} ${fmt(q[1])} ${fmt(r[0])} ${fmt(r[1])}`; }
      else if (c.command === 'closePath') d += 'Z';
      for (const p of pts) { inkX0 = Math.min(inkX0, p[0]); inkX1 = Math.max(inkX1, p[0]); }
    }
    pen += run.positions[i].xAdvance + (i < run.glyphs.length - 1 ? tracking * font.unitsPerEm : 0);
  });
  return { d, width: pen * s, ink: { x0: inkX0, x1: inkX1 } };
}

if (process.argv[1] && process.argv[1].endsWith('wordmark.mjs')) {
  const w = divi(100, 0, 100);
  console.log(JSON.stringify({ width: w.width, ink: w.ink, len: w.d.length }));
}
