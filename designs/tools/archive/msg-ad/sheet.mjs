// Art-direction comparison sheet. For every variant <name> with files
// <name>.tile.svg / <name>.mono.svg / <name>.mark.svg in this folder (prefix filter
// argv[2]), renders one row: mark on white, tile, mono on photo, circle crops
// 120/40, 32px tile, 16px tabs light/dark, and a fake WhatsApp chat row.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const dir = path.dirname(new URL(import.meta.url).pathname);
const only = process.argv[2] || '';
const outName = process.argv[3] || 'sheet';
const names = [...new Set(fs.readdirSync(dir).filter(n => n.startsWith(only) && n.endsWith('.tile.svg')).map(n => n.replace('.tile.svg', '')))].sort();
const u = n => 'file://' + path.join(dir, n);
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const html = `<!doctype html><html><head><style>
body{margin:0;background:#f2f3f1;font:600 12px Helvetica Neue,Arial;color:#444}
.row{display:flex;gap:14px;align-items:center;padding:12px 16px;border-bottom:1px solid #ddd}
.n{width:120px}.sw{display:grid;place-items:center;width:150px;height:150px;border-radius:10px}
.w{background:#fafaf8;border:1px solid #e3e3e0}.k{background:#2d2d2d}
.p{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
.r{border-radius:50%}
.tab{background:#dee1e6;padding:8px;border-radius:6px}.tab.d{background:#35363a}
.chat{display:flex;gap:10px;align-items:center;background:#fff;padding:8px 12px;border-radius:8px;width:230px;font:500 13px Helvetica Neue;color:#111}
.chat small{display:block;color:#777;font-weight:400}
</style></head><body>
${names.map(n => `<div class="row"><div class="n">${n}</div>
<div class="sw w"><img src="${u(n + '.mark.svg')}" width="130"></div>
<img src="${u(n + '.tile.svg')}" width="150" style="border-radius:30px">
<div class="sw p"><img src="${u(n + '.mono.svg')}" width="130"></div>
<img class="r" src="${u(n + '.tile.svg')}" width="120">
<img class="r" src="${u(n + '.tile.svg')}" width="40">
<img src="${u(n + '.tile.svg')}" width="32" style="border-radius:7px">
<div class="tab"><img src="${u(n + '.tile.svg')}" width="16" style="border-radius:3px"></div>
<div class="tab d"><img src="${u(n + '.tile.svg')}" width="16" style="border-radius:3px"></div>
<div class="chat"><img class="r" src="${u(n + '.tile.svg')}" width="40"><div>Divi<small>Here's your link to split</small></div></div>
</div>`).join('')}
</body></html>`;
fs.writeFileSync(path.join(dir, outName + '.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 300 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.join(dir, outName + '.html'));
await p.waitForLoadState('load');
await p.screenshot({ path: path.join(dir, outName + '.png'), fullPage: true });
await b.close();
console.log('ok', names.length, names.join(' '));
