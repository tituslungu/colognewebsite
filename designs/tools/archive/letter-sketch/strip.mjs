// node strip.mjs out.png "label|path|height|bg" ...  -> one row per arg
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...rows] = process.argv.slice(2);
const html = `<!doctype html><html><head><style>body{margin:0;background:#e9e9e6;font:600 11px Helvetica;color:#555}
.r{display:flex;align-items:center;gap:16px;padding:14px 20px}.r span{width:150px}.b{padding:24px 36px;border-radius:10px;display:flex;gap:28px;align-items:center}
.photo{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(file:///Users/titus/repos/colognewebsite/assets/img/table.jpg) center/cover}</style></head><body>
${rows.map(r => { const [l, p, h, bg] = r.split('|'); const ps = p.split(','); return `<div class="r"><span>${l}</span><div class="b ${bg === 'photo' ? 'photo' : ''}" style="background-color:${bg === 'photo' ? '' : bg}">${ps.map(x => `<img src="file://${x}" style="height:${h}px">`).join('')}</div></div>`; }).join('')}</body></html>`;
fs.writeFileSync(out.replace(/\.png$/, '.html'), html);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1300, height: 300 }, deviceScaleFactor: 2 });
await pg.goto('file://' + out.replace(/\.png$/, '.html')); await pg.waitForLoadState('load');
await pg.screenshot({ path: out, fullPage: true }); await b.close();
