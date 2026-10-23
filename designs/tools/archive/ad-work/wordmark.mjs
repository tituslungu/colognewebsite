// DIVI wordmark from Helvetica Neue Bold outlines (font units, y up,
// cap height 714), tracked +0.12em (120 units) like the site's CSS.
import fs from 'fs';
const G = JSON.parse(fs.readFileSync(new URL('./glyphs.json', import.meta.url), 'utf8').split('\ncapHeight')[0]);
const CAP = 714, TRACK = 120;

// absolute-command path transformer for M L H V Q C Z
function transform(d, fx, fy) {
  const tok = d.match(/[MLHVQCZ]|-?\d*\.?\d+/g);
  let out = '', i = 0, cmd = '', cx = 0, cy = 0;
  const n = () => parseFloat(tok[i++]);
  const r = v => { const x = Math.round(v * 100) / 100; return (Object.is(x, -0) ? 0 : x).toString(); };
  while (i < tok.length) {
    if (/[A-Z]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'Z') { out += 'Z'; continue; }
    if (cmd === 'M' || cmd === 'L') { cx = n(); cy = n(); out += `${cmd}${r(fx(cx))} ${r(fy(cy))}`; if (cmd === 'M') cmd = 'L'; }
    else if (cmd === 'H') { cx = n(); out += `L${r(fx(cx))} ${r(fy(cy))}`; }
    else if (cmd === 'V') { cy = n(); out += `L${r(fx(cx))} ${r(fy(cy))}`; }
    else if (cmd === 'Q') { const x1 = n(), y1 = n(); cx = n(); cy = n(); out += `Q${r(fx(x1))} ${r(fy(y1))} ${r(fx(cx))} ${r(fy(cy))}`; }
    else if (cmd === 'C') { const x1 = n(), y1 = n(), x2 = n(), y2 = n(); cx = n(); cy = n(); out += `C${r(fx(x1))} ${r(fy(y1))} ${r(fx(x2))} ${r(fy(y2))} ${r(fx(cx))} ${r(fy(cy))}`; }
  }
  // collapse "L x y" that duplicates the previous point
  return out;
}

// Returns { d, width, height } with the wordmark's ink starting at x0 and cap
// top at y0, scaled so cap height = cap.
export function wordmark(x0, y0, cap) {
  const s = cap / CAP;
  let pen = 0, d = '';
  const letters = ['D', 'I', 'V', 'I'];
  const inkLeft = G.D.bounds[0];
  letters.forEach((ch, k) => {
    const g = G[ch];
    const ox = pen;
    d += transform(g.path, x => x0 + (x + ox - inkLeft) * s, y => y0 + (CAP - y) * s);
    pen += g.adv + (k < letters.length - 1 ? TRACK : 0);
  });
  const last = G.I;
  const inkRight = pen - last.adv + last.bounds[2];
  return { d, width: (inkRight - inkLeft) * s, height: cap };
}
