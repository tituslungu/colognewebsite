// Contact sheet: node harness.mjs <sketches.mjs> <out.png>
// sketches module default-exports { name: {tile: svgString, mono: svgString?} }
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const mod = await import(path.resolve(process.argv[2]) + '?t=' + Date.now());
const out = path.resolve(process.argv[3]);
const sk = mod.default;
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const uri = s => 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
const cells = Object.entries(sk).map(([name, o]) => {
  const t = uri(o.tile), m = o.mono ? uri(o.mono) : null;
  return `<div class="cell"><div class="lab">${name}</div><div class="row">
    <img src="${t}" width="150" height="150" style="border-radius:32px">
    <div class="col">
      <div class="row2">
        <img src="${t}" width="40" height="40" style="border-radius:50%">
        <span class="dk"><img src="${t}" width="40" height="40" style="border-radius:50%"></span>
        <img src="${t}" width="16" height="16" style="border-radius:3px">
        <span class="dk"><img src="${t}" width="16" height="16" style="border-radius:3px"></span>
        <img src="${t}" width="24" height="24" style="border-radius:5px">
      </div>
      <div class="row2">
        <span class="ph"><img src="${t}" width="40" height="40" style="border-radius:8px"></span>
        ${m ? `<span class="ph"><img src="${m}" width="40" height="40"></span><span class="wh"><img src="${m}" width="56" height="56" style="filter:invert(1) brightness(.18)"></span>` : ''}
      </div>
    </div>
  </div></div>`;
}).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#fff;font:600 12px Helvetica;color:#333}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:16px;width:1350px}
.cell{border:1px solid #e5e5e5;border-radius:10px;padding:10px}
.row{display:flex;gap:12px;align-items:center;margin-top:6px}
.col{display:grid;gap:10px}
.row2{display:flex;gap:10px;align-items:center}
.dk{background:#202124;padding:6px;border-radius:6px;display:inline-flex}
.ph{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) 30% 20%/400px;padding:10px;border-radius:6px;display:inline-flex}
.wh{background:#fafaf8;border:1px solid #eee;padding:4px;border-radius:6px;display:inline-flex}
</style></head><body><div class="grid">${cells}</div></body></html>`;
fs.writeFileSync(out.replace(/\.png$/, '.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1380, height: 900 }, deviceScaleFactor: 1.5 });
await p.goto('file://' + out.replace(/\.png$/, '.html'));
await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log('ok', out);
