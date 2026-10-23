// Quick ideation sheet for the "shared table" direction. Each sketch is an
// app-icon style SVG (256 viewBox). Rendered at 160 / 40 circle / 16 px.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/table-sketch';

const K = '#2D2D2D', S = '#6FAF8E', SL = '#8CC4A5', SD = '#3E7A5B', DS = '#24382E', W = '#FAFAF8', G = '#ECEBE8';
const svg = (body, bg = K) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="${bg}"/>${body}</svg>`;
const c = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const ring = (n, R, r, f, start = -90) => Array.from({ length: n }, (_, i) => {
  const a = (start + i * 360 / n) * Math.PI / 180;
  return c((128 + R * Math.cos(a)).toFixed(2), (128 + R * Math.sin(a)).toFixed(2), r, f);
}).join('');
const arc = (cx, cy, r, a0, a1) => {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)].map(v => v.toFixed(2)).join(' ');
  return `M${p(a0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
};

const P = (R, deg) => [(128 + R * Math.cos(deg * Math.PI / 180)).toFixed(2), (128 + R * Math.sin(deg * Math.PI / 180)).toFixed(2)];
const dotAt = (R, deg, r, f) => { const [x, y] = P(R, deg); return c(x, y, r, f); };
const div = (bw, bh, r, gap, bar, top, bot) => `<rect x="${128-bw/2}" y="${128-bh/2}" width="${bw}" height="${bh}" rx="${bh/2}" fill="${bar}"/>${c(128,128-bh/2-gap-r,r,top)}${c(128,128+bh/2+gap+r,r,bot)}`;
const tri = (tr, dr, R, dy, tf, df) => `<g transform="translate(0 ${dy})">${c(128,128,tr,tf)}${[0,1,2].map(i=>dotAt(R,-90+i*120,dr,df)).join('')}</g>`;
const trio = (tr, dr, R, dy, tf, df, cut) => `<g transform="translate(0 ${dy})">${[0,1,2].map(i=>{const [x,y]=P(R,-90+i*120);return `<circle cx="${x}" cy="${y}" r="${dr+cut}" fill="${K}"/>`}).join('')}${c(128,128,tr,tf)}${[0,1,2].map(i=>dotAt(R,-90+i*120,dr,df)).join('')}</g>`;
const pull = (n, tr, dr, R, start, tf, df, cut, bg=K) => `${Array.from({length:n},(_,i)=>{const [x,y]=P(R,start+i*360/n);return `<circle cx="${x}" cy="${y}" r="${dr+cut}" fill="${bg}"/>`}).join('')}`.replace(/^/, c(128,128,tr,tf)) + Array.from({length:n},(_,i)=>dotAt(R,start+i*360/n,dr,df)).join('');
// draw table first, then cut circles, then diners
const pull2 = (n, tr, dr, R, start, tf, df, cut, bg=K) => c(128,128,tr,tf) + Array.from({length:n},(_,i)=>{const [x,y]=P(R,start+i*360/n);return `<circle cx="${x}" cy="${y}" r="${dr+cut}" fill="${bg}"/>`}).join('') + Array.from({length:n},(_,i)=>dotAt(R,start+i*360/n,dr,df)).join('');
// table + n notches, diners on all except `empty` indices
const seat = (n, tr, dr, R, start, tf, df, cut, empty=[], split=0, dy=0) => {
  let s = c(128,128+dy,tr,tf);
  if (split) s += `<rect x="0" y="${128+dy-split/2}" width="256" height="${split}" fill="${K}"/>`;
  for (let i=0;i<n;i++){ const [x,y]=P(R,start+i*360/n); s += `<circle cx="${x}" cy="${+y+dy}" r="${dr+cut}" fill="${K}"/>`; }
  for (let i=0;i<n;i++){ if (empty.includes(i)) continue; const [x,y]=P(R,start+i*360/n); s += c(x, +y+dy, dr, df); }
  return s;
};
const sketches = {
  'H1 current gather (4 @22.5)': svg(seat(4,52*.95,21*.95,69*.95,-67.5,S,W,6)),
  'H2 empty seat, cardinal (bottom open)': svg(seat(4,54,21,70,-90,S,W,6,[1],0,-4)),
  'H3 empty seat @22.5 (lower-left open)': svg(seat(4,52*.95,21*.95,69*.95,-67.5,S,W,6,[2])),
  'H4 empty seat, 5 seats, bottom open': svg(seat(5,54,18,69,90,S,W,6,[0],0,-6)),
  'H5 split table, diag diners': svg(seat(4,52*.95,21*.95,69*.95,-45,S,W,6,[],10)),
  'H6 empty seat, diag, lower-right open': svg(seat(4,52*.95,21*.95,69*.95,-45,S,W,6,[1])),
  'H7 H2 mono': svg(seat(4,54,21,70,-90,W,W,6,[1],0,-4)),
  'H8 H3 mono': svg(seat(4,52*.95,21*.95,69*.95,-67.5,W,W,6,[2])),
  'H9 6 seats, one empty (bottom)': svg(seat(6,56,16,70,90,S,W,6,[0],0,-4)),
};

const cells = Object.entries(sketches).map(([name, s]) => {
  const uri = 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
  return `<div class="cell"><div class="lab">${name}</div><div class="row">
    <img src="${uri}" width="140" height="140" style="border-radius:28px">
    <img src="${uri}" width="40" height="40" style="border-radius:50%">
    <span class="dk"><img src="${uri}" width="40" height="40" style="border-radius:50%"></span>
    <img src="${uri}" width="16" height="16" style="border-radius:3px">
    <span style="background:#5a4636;padding:10px;border-radius:6px;display:inline-flex"><img src="${uri}" width="40" height="40" style="border-radius:8px"></span>
    <span class="dk"><img src="${uri}" width="16" height="16" style="border-radius:3px"></span>
  </div></div>`;
}).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#fff;font:600 12px Helvetica;color:#333}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:20px;width:1300px}
.cell{border:1px solid #e5e5e5;border-radius:10px;padding:12px}
.row{display:flex;gap:12px;align-items:center;margin-top:8px}
.dk{background:#202124;padding:8px;border-radius:6px;display:inline-flex}
</style></head><body><div class="grid">${cells}</div></body></html>`;
fs.writeFileSync(OUT + '/sheet.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1340, height: 900 }, deviceScaleFactor: 1 });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
console.log('ok');
