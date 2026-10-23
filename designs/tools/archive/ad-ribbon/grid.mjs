// node grid.mjs out.png size dir : rows = upper/lower, cols = C ref + 5 colourways
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [,, out, sz, dir] = process.argv; const S = +sz; const cws = ['blue', 'sage', 'sage-dark', 'charcoal', 'white-sage'];
const u = f => 'file://' + path.resolve(dir, f);
let html = `<body style="margin:0;background:#ccc;padding:8px">`;
for (const c of ['upper', 'lower']) html += `<div style="display:flex;gap:8px;margin-bottom:8px"><img src="file:///Users/titus/repos/colognewebsite/assets/img/icon.png" width="${S}" height="${S}" style="border-radius:${S * .2}px">${cws.map(cw => `<img src="${u(`${c}-${cw}.svg`)}" width="${S}" height="${S}" style="border-radius:${S * .2}px">`).join('')}</div>`;
fs.writeFileSync(out + '.html', html + '</body>');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 6 * (S + 8) + 8, height: 2 * (S + 8) + 8 } });
await p.goto('file://' + path.resolve(out + '.html')); await p.waitForTimeout(300); await p.screenshot({ path: out }); await b.close();
