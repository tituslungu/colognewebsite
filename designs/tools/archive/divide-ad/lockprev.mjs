import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...items] = process.argv.slice(2);
const html = `<!doctype html><style>body{margin:0;background:#f2f3f1;font:600 12px Helvetica}.r{display:flex;gap:30px;align-items:center;padding:16px}.b{background:#fafaf8;border:1px solid #ddd;padding:30px;width:560px;display:grid;place-items:center}</style>`+
 items.map(f=>`<div class="r"><div class="b"><img src="file://${f}" style="height:110px"></div><div class="b" style="width:200px"><img src="file://${f}" style="height:28px"></div>${f.split('/').pop()}</div>`).join('');
fs.writeFileSync(out+'.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1100,height:200}, deviceScaleFactor:2 });
await p.goto('file://'+out+'.html'); await p.screenshot({path:out, fullPage:true}); await b.close();
