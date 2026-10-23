import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const dirs = ['lg18', 'lg28', 'lg38']; const cws = ['blue', 'sage', 'sage-dark'];
let html = `<body style="margin:0;background:#fff;padding:6px;font:11px system-ui">`;
for (const d of dirs) html += `<div style="display:flex;gap:10px;align-items:center;margin-bottom:6px"><span style="width:34px">${d}</span>` + cws.map(cw => `<img src="file://${path.resolve(d, `lower-${cw}.svg`)}" width="150" height="150" style="border-radius:30px"><img src="file://${path.resolve(d, `lower-${cw}.svg`)}" width="40" height="40" style="border-radius:50%"><span style="background:#dee1e6;padding:4px;border-radius:4px;display:inline-flex"><img src="file://${path.resolve(d, `lower-${cw}.svg`)}" width="16" height="16" style="border-radius:3px"></span>`).join('') + `</div>`;
fs.writeFileSync('lgcmp.html', html + '</body>');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 760, height: 490 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.resolve('lgcmp.html')); await p.waitForTimeout(300); await p.screenshot({ path: 'lgcmp.png' }); await b.close();
