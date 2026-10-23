// Renders every sketches/*.svg at 160 / 40-circle / 16 on light, charcoal and sage-tile backgrounds.
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const dir = process.argv[2]; const outPng = process.argv[3];
const files = fs.readdirSync(dir).filter(n => n.endsWith('.svg')).sort();
const u = n => 'file://' + path.join(dir, n);
const html = `<!doctype html><html><head><style>
body{margin:0;background:#f2f3f1;font:600 11px Helvetica;color:#444}
.r{display:flex;gap:14px;align-items:center;padding:10px 16px;border-bottom:1px solid #ddd}
.b{display:grid;place-items:center;width:180px;height:180px;border-radius:10px}
.w{background:#fafaf8}.k{background:#2d2d2d}
.c{border-radius:50%;overflow:hidden;width:40px;height:40px;display:block}
.n{width:120px}
</style></head><body>${files.map(n => `<div class="r"><div class="n">${n}</div>
<div class="b w"><img src="${u(n)}" width="160"></div>
<img class="c" src="${u(n)}"><img src="${u(n)}" width="16"><img src="${u(n)}" width="24">
<div style="background:#2d2d2d;padding:12px;border-radius:8px;display:flex;gap:12px;align-items:center"><img class="c" src="${u(n)}"><img src="${u(n)}" width="16"></div>
</div>`).join('')}</body></html>`;
fs.writeFileSync(outPng.replace(/\.png$/, '.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 760, height: 400 }, deviceScaleFactor: 2 });
await p.goto('file://' + outPng.replace(/\.png$/, '.html')); await p.waitForLoadState('load');
await p.screenshot({ path: outPng, fullPage: true }); await b.close();
