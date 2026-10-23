import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...items] = process.argv.slice(2);
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const html = `<!doctype html><style>body{margin:0;background:#f2f3f1}.r{display:flex;gap:20px;align-items:center;padding:12px}.b{padding:30px;width:520px;display:grid;place-items:center;border-radius:8px}.w{background:#fafaf8;border:1px solid #ddd}.k{background:#2d2d2d}.p{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}</style>`+
 items.map(it=>{const [f,bg]=it.split(':');return `<div class="r"><div class="b ${bg}"><img src="file://${f}" style="height:90px"></div><div class="b ${bg}" style="width:160px"><img src="file://${f}" style="height:22px"></div></div>`}).join('');
fs.writeFileSync(out+'.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:900,height:200}, deviceScaleFactor:2 });
await p.goto('file://'+out+'.html'); await p.screenshot({path:out, fullPage:true}); await b.close();
