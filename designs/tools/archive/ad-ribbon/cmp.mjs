// node cmp.mjs <out.png> <bigSize> <dir1> [dir2 ...] : per variant row: C ref, D/d blue, D/d charcoal big; then small sizes for all colourways (1x, upscaled 3x)
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [,, out, bs, ...dirs] = process.argv; const BS = +bs;
const cws = ['blue', 'sage', 'sage-dark', 'charcoal', 'white-sage'];
const b = await chromium.launch();
// big
let html = `<body style="margin:0;background:#bbb;padding:8px;font:14px system-ui">`;
for (const d of dirs) { const u = f => 'file://' + path.resolve(d, f);
  html += `<div style="display:flex;gap:8px;margin-bottom:8px;align-items:center"><div style="width:60px">${path.basename(d)}</div><img src="file:///Users/titus/repos/colognewebsite/assets/img/icon.png" width="${BS}" height="${BS}">${['upper-blue', 'lower-blue', 'upper-charcoal', 'lower-charcoal', 'upper-sage', 'lower-sage'].map(n => `<img src="${u(n + '.svg')}" width="${BS}" height="${BS}">`).join('')}</div>`; }
fs.writeFileSync(out + '.html', html + '</body>');
let p = await b.newPage({ viewport: { width: 76 + 7 * (BS + 8), height: dirs.length * (BS + 8) + 16 } });
await p.goto('file://' + path.resolve(out + '.html')); await p.waitForTimeout(300); await p.screenshot({ path: out }); await p.close();
// small @1x
html = `<body style="margin:0;background:#dee1e6;padding:6px">`;
for (const d of dirs) { const u = f => 'file://' + path.resolve(d, f);
  html += `<div style="display:flex;gap:10px;align-items:center;height:46px">` + cws.map(cw => ['upper', 'lower'].map(c => `<img src="${u(`${c}-${cw}.svg`)}" width="16" height="16" style="border-radius:3px"><img src="${u(`${c}-${cw}.svg`)}" width="40" height="40" style="border-radius:50%">`).join('')).join('<span style="width:6px"></span>') + `</div>`; }
fs.writeFileSync(out + '.s.html', html + '</body>');
const W = 760, H = dirs.length * 46 + 12;
p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto('file://' + path.resolve(out + '.s.html')); await p.waitForTimeout(300);
const small = out.replace(/\.png$/, '-small1x.png'); await p.screenshot({ path: small }); await p.close();
fs.writeFileSync(out + '.z.html', `<body style="margin:0"><img src="file://${path.resolve(small)}" style="width:${W * 3}px;image-rendering:pixelated"></body>`);
p = await b.newPage({ viewport: { width: W * 3, height: H * 3 } });
await p.goto('file://' + path.resolve(out + '.z.html')); await p.waitForTimeout(200); await p.screenshot({ path: out.replace(/\.png$/, '-small.png') });
await b.close();
