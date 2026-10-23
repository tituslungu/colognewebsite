// node preview.mjs out.png file1.svg[:label] file2.svg ...  (each row: mark large on white, charcoal, photo; circle 120/40; 32; 16)
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...items] = process.argv.slice(2);
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const rows = items.map(it => { const [f, label] = it.split(':'); return `<div class="row"><div class="lab">${label||f.split('/').pop()}</div>
<div class="sw w"><img src="file://${f}" width="200"></div>
<div class="sw k"><img src="file://${f}" width="200"></div>
<div class="sw p"><img src="file://${f}" width="44"></div>
<img class="r" src="file://${f}" width="120"><img class="r" src="file://${f}" width="40">
<img src="file://${f}" width="32" style="border-radius:6px"><div class="tab"><img src="file://${f}" width="16"></div><div class="tab d"><img src="file://${f}" width="16"></div></div>`}).join('');
const html = `<!doctype html><style>body{margin:0;background:#f2f3f1;font:600 12px Helvetica}.row{display:flex;gap:14px;align-items:center;padding:10px 16px}.lab{width:90px}
.sw{width:220px;height:220px;display:grid;place-items:center;border-radius:10px}.w{background:#fafaf8;border:1px solid #ddd}.k{background:#2d2d2d}
.p{width:150px;height:110px;background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
.r{border-radius:50%}.tab{background:#fff;padding:8px;border-radius:6px}.tab.d{background:#35363a}</style>${rows}`;
fs.writeFileSync(out + '.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1250, height: 300 }, deviceScaleFactor: 2 });
await p.goto('file://' + out + '.html'); await p.waitForLoadState('load');
await p.screenshot({ path: out, fullPage: true }); await b.close();
