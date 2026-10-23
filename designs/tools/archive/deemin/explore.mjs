import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const DIR = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/deemin';
const f = n => +n.toFixed(2);
const W = 24;
// Uppercase variants. Centerline: stem x=L, top T, bottom B, corner radius rc, right extreme xr.
function upper(v) {
  const { L = 67, T = 50, B = 206, rc = 22, xr = 193, k = 0.5523, mode } = v;
  const h = (B - T) / 2, M = (T + B) / 2;
  const a = h; const xs = xr - a;
  const bowl = `H${f(xs)} C${f(xs + k * a)},${T} ${xr},${f(M - k * h)} ${xr},${M} C${xr},${f(M + k * h)} ${f(xs + k * a)},${B} ${f(xs)},${B}`;
  if (mode === 'corner') { // open at top-left corner
    const d = v.d ?? 30;
    return `M${L + d},${T} ${bowl} H${L + rc} A${rc} ${rc} 0 0 1 ${L},${B - rc} V${T + d}`;
  }
  if (mode === 'arm') { // stem full height, top arm detached
    const g = v.g ?? 36;
    return `M${L + g},${T} ${bowl} H${L + rc} A${rc} ${rc} 0 0 1 ${L},${B - rc} V${T}`;
  }
  if (mode === 'two') { // stem separate, bowl ends near stem
    const g = v.g ?? 36;
    return `M${L},${T} V${B} M${L + g},${T} ${bowl} H${L + g}`;
  }
  if (mode === 'bottom') { // connected at top, open at bottom-left
    const g = v.g ?? 36;
    return `M${L},${B} V${T + rc} A${rc} ${rc} 0 0 1 ${L + rc},${T} ${bowl} H${L + g}`;
  }
  if (mode === 'mirrorC') { // stem + reversed C arc
    const R = v.R ?? 86, cx = v.cx ?? 112, th = v.th ?? 112; // arc from -th to +th degrees
    const p = t => [f(cx + R * Math.cos(t * Math.PI / 180)), f(128 + R * Math.sin(t * Math.PI / 180))];
    const [x1, y1] = p(-th), [x2, y2] = p(th);
    return `M${L},${v.sT ?? 62} V${v.sB ?? 194} M${x1},${y1} A${R} ${R} 0 1 1 ${x2},${y2}`;
  }
}
function lower(v) {
  const { bx = 124, by = 154, r = 52, asc = 50, th = 72, mode, sx } = v;
  const X = sx ?? bx + r;
  const t = th * Math.PI / 180;
  const tx = f(bx + r * Math.cos(t)), ty = f(by - r * Math.sin(t));
  if (mode === 'flow') return `M${tx},${ty} A${r} ${r} 0 1 0 ${X},${by} V${asc}`;
  if (mode === 'cl') { // Cologne c + l
    const o = v.open ?? 50; const a = o * Math.PI / 180;
    const ax = f(bx + r * Math.cos(a)), ay = f(by - r * Math.sin(a)), ay2 = f(by + r * Math.sin(a));
    return `M${ax},${ay} A${r} ${r} 0 1 0 ${ax},${ay2} M${X},${asc} V${by + r}`;
  }
  if (mode === 'foot') { // bowl flows into a stem that reaches the baseline
    const rc = v.rc ?? 20;
    return `M${tx},${ty} A${r} ${r} 0 1 0 ${bx},${by + r} H${X - rc} A${rc} ${rc} 0 0 0 ${X},${by + r - rc} V${asc}`;
  }
}
const tmpl = (d, bg = '#DEF8FB', bg2 = '#A6E5F7', a = '#1151FE', b = '#05DFF2', sw = W) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${bg2}"/></linearGradient><linearGradient id="ink" x1="56" y1="214" x2="204" y2="42" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="256" height="256" fill="url(#tg)"/><path d="${d}" fill="none" stroke="url(#ink)" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export { upper, lower, tmpl };
if (process.argv[2] === 'run') {
  const cands = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  let html = `<body style="margin:0;background:#eee;font:12px sans-serif"><div style="display:flex;flex-wrap:wrap;gap:12px;padding:12px">`;
  cands.forEach((c, i) => {
    const d = c.case === 'U' ? upper(c) : lower(c);
    const s1 = tmpl(d, '#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2', c.w ?? W);
    const s2 = tmpl(d, '#fff', '#fff', '#2D2D2D', '#2D2D2D', c.w ?? W);
    const s3 = tmpl(d, '#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD', c.w ?? W);
    fs.writeFileSync(`${DIR}/c${i}a.svg`, s1); fs.writeFileSync(`${DIR}/c${i}b.svg`, s2); fs.writeFileSync(`${DIR}/c${i}c.svg`, s3);
    html += `<div style="background:#fff;padding:8px;border-radius:10px;display:flex;gap:8px;align-items:center"><div>${c.label||i}</div>
    <div style="position:relative;width:200px;height:200px"><img src="c${i}a.svg" width=200 height=200 style="border-radius:40px"><svg width=200 height=200 viewBox="0 0 256 256" style="position:absolute;left:0;top:0"><circle cx=128 cy=128 r=127 fill=none stroke="rgba(255,0,0,.4)"/><circle cx=128 cy=128 r=106 fill=none stroke="rgba(255,0,0,.2)"/><line x1=128 y1=0 x2=128 y2=256 stroke="rgba(255,0,0,.2)"/><line y1=128 x1=0 y2=128 x2=256 stroke="rgba(255,0,0,.2)"/></svg></div>
    <div style="display:flex;flex-direction:column;gap:6px"><img src="c${i}b.svg" width=64 style="border-radius:14px;box-shadow:0 0 0 1px #ddd"><img src="c${i}c.svg" width=40 style="border-radius:50%"><img src="c${i}a.svg" width=40 style="border-radius:50%"><span><img src="c${i}b.svg" width=16 style="vertical-align:middle"> <img src="c${i}a.svg" width=16 style="vertical-align:middle"> <img src="c${i}c.svg" width=16 style="vertical-align:middle"></span></div></div>`;
  });
  html += '</div></body>';
  fs.writeFileSync(`${DIR}/explore.html`, html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 400 }, deviceScaleFactor: 1 });
  await p.goto(`file://${DIR}/explore.html`); await p.waitForTimeout(300);
  await p.screenshot({ path: `${DIR}/${process.argv[4] || 'explore'}.png`, fullPage: true }); await b.close();
}
