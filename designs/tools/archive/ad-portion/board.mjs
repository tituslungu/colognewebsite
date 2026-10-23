// Usage: node board.mjs out.png id1 id2 ... (or path/to/file.svg entries)
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
import path from "path"; const [o, ...ids] = process.argv.slice(2); const out = path.resolve(o);
const L = '/Users/titus/repos/colognewebsite/designs/logos/';
const src = (id, f) => id.endsWith('/') ? 'file://' + id + f : 'file://' + L + id + '/' + f;
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const rows = ids.map(id => `<div class="r"><b>${id.split('/').filter(Boolean).pop()}</b>
<div class="sw w"><img src="${src(id,'mark.svg')}" width="110"></div>
<div class="sw p"><img src="${src(id,'mark-mono.svg')}" width="110"></div>
<img class="c" src="${src(id,'app-icon.svg')}" width="96" style="border-radius:50%">
<img src="${src(id,'app-icon.svg')}" width="40" style="border-radius:50%">
<img src="${src(id,'app-icon.svg')}" width="32" style="border-radius:7px">
<img src="${src(id,'app-icon.svg')}" width="16" style="border-radius:3px">
<span class="dk"><img src="${src(id,'app-icon.svg')}" width="16" style="border-radius:3px"></span>
<div class="sw p" style="width:70px;height:70px"><img src="${src(id, fs.existsSync((id.endsWith('/')?id:L+id+'/')+'site-icon.svg')?'site-icon.svg':'app-icon.svg')}" width="40"></div>
</div>`).join('');
const html = `<!doctype html><html><head><style>body{margin:0;background:#f2f3f1;font:600 12px Helvetica}
.r{display:flex;align-items:center;gap:14px;padding:8px 16px;border-bottom:1px solid #ddd}
b{width:90px}.sw{display:grid;place-items:center;width:130px;height:130px;border-radius:10px}
.w{background:#fafaf8;border:1px solid #e3e3e0}.p{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
.dk{background:#35363a;padding:8px;border-radius:6px;display:flex}</style></head><body>${rows}</body></html>`;
const hp = out.replace(/\.png$/, '.html');
fs.writeFileSync(hp, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 400 }, deviceScaleFactor: 2 });
await p.goto('file://' + hp); await p.waitForLoadState('load');
await p.screenshot({ path: out, fullPage: true });
await b.close();
