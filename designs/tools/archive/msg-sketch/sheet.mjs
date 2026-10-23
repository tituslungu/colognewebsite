// Renders every sketch-*.svg in this folder at several sizes, side by side.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const dir = path.dirname(new URL(import.meta.url).pathname);
const only = process.argv[2] || 'sketch-';
const files = fs.readdirSync(dir).filter(n => n.startsWith(only) && n.endsWith('.svg')).sort();
const u = n => 'file://' + path.join(dir, n);
const html = `<!doctype html><html><head><style>
body{margin:0;background:#f2f3f1;font:600 12px Helvetica Neue,Arial;color:#444}
.row{display:flex;gap:18px;align-items:center;padding:14px 20px;border-bottom:1px solid #ddd}
.n{width:150px}.sw{display:grid;place-items:center;width:170px;height:170px;border-radius:10px}
.w{background:#fafaf8;border:1px solid #e3e3e0}.k{background:#2d2d2d}
.r{border-radius:50%}
.tab{background:#dee1e6;padding:8px;border-radius:6px}.tab.d{background:#35363a}
</style></head><body>
${files.map(n => `<div class="row"><div class="n">${n}</div>
<div class="sw w"><img src="${u(n)}" width="150"></div>
<div class="sw k"><img src="${u(n)}" width="150"></div>
<img class="r" src="${u(n)}" width="120">
<img class="r" src="${u(n)}" width="40">
<img src="${u(n)}" width="32" style="border-radius:7px">
<div class="tab"><img src="${u(n)}" width="16" style="border-radius:3px"></div>
<div class="tab d"><img src="${u(n)}" width="16" style="border-radius:3px"></div>
</div>`).join('')}
</body></html>`;
fs.writeFileSync(path.join(dir, 'sheet.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1100, height: 400 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.join(dir, 'sheet.html'));
await p.waitForLoadState('load');
await p.screenshot({ path: path.join(dir, (process.argv[3] || 'sheet') + '.png'), fullPage: true });
await b.close();
console.log('ok', files.length);
