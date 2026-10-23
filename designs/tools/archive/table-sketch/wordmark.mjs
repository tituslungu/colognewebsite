// Geometric "DIVI" drawn as paths, matched to Helvetica Neue Bold uppercase
// with +0.12em tracking (the site's wordmark). Units: cap height 714 (font
// units per 1000 em), scaled to `capH`.
const n = v => +v.toFixed(2);
export const M = {
  H: 714,
  stem: 157,          // I and D stem
  dBar: 132,          // D top/bottom stroke
  dW: 632,            // D ink width
  dBowl: 157,         // D right stroke at mid height
  // outer D curve: straight top until oa, quarter superellipse to (dW, ob)
  oa: 318, ob: 300, ok: 0.63,
  // inner counter: straight until ia, curve to (dW - dBowl, ib)
  ia: 292, ib: 300, ik: 0.57,
  vW: 631, vTop: 158, vBot: 202, vApex: 532,
  // ink-to-ink positions with +120 tracking
  x: { D: 0, I1: 861, V: 1208, I2: 2026 },
  width: 2183,
};

function dPath(o, s) {
  const { H, stem, dBar, dW, dBowl, oa, ob, ok, ia, ib, ik } = M;
  const X = v => n(o + v * s), Y = v => n(v * s);
  // Outer contour (clockwise)
  const outer = [
    `M${X(0)} ${Y(0)}`, `H${X(oa)}`,
    `C${X(oa + ok * (dW - oa))} ${Y(0)} ${X(dW)} ${Y(ob - ok * ob)} ${X(dW)} ${Y(ob)}`,
    `V${Y(H - ob)}`,
    `C${X(dW)} ${Y(H - ob + ok * ob)} ${X(oa + ok * (dW - oa))} ${Y(H)} ${X(oa)} ${Y(H)}`,
    `H${X(0)}`, 'Z',
  ].join('');
  // Inner counter (counter-clockwise so evenodd/nonzero both punch it)
  const ir = dW - dBowl;           // inner right edge
  const it = dBar, ibt = H - dBar; // inner top / bottom
  const ih = ib - it;              // vertical reach of the inner curve
  const inner = [
    `M${X(stem)} ${Y(it)}`, `V${Y(ibt)}`, `H${X(ia)}`,
    `C${X(ia + ik * (ir - ia))} ${Y(ibt)} ${X(ir)} ${Y(ibt - ik * ih)} ${X(ir)} ${Y(ibt - ih)}`,
    `V${Y(it + ih)}`,
    `C${X(ir)} ${Y(it + ih - ik * ih)} ${X(ia + ik * (ir - ia))} ${Y(it)} ${X(ia)} ${Y(it)}`,
    'Z',
  ].join('');
  return outer + inner;
}
const iPath = (o, s) => `M${n(o)} 0H${n(o + M.stem * s)}V${n(M.H * s)}H${n(o)}Z`;
function vPath(o, s) {
  const { H, vW, vTop, vBot, vApex } = M;
  const X = v => n(o + v * s), Y = v => n(v * s);
  const bl = (vW - vBot) / 2, br = bl + vBot;
  return `M${X(0)} ${Y(0)}H${X(vTop)}L${X(vW / 2)} ${Y(vApex)}L${X(vW - vTop)} ${Y(0)}H${X(vW)}L${X(br)} ${Y(H)}H${X(bl)}Z`;
}

export function wordmark({ capH = 100, fill = '#2D2D2D' } = {}) {
  const s = capH / M.H;
  const d = [dPath(M.x.D * s, s), iPath(M.x.I1 * s, s), vPath(M.x.V * s, s), iPath(M.x.I2 * s, s)].join('');
  return { paths: `<path fill="${fill}" fill-rule="evenodd" d="${d}"/>`, width: M.width * s, height: capH };
}
