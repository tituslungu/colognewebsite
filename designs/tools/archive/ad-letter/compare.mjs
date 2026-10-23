// node compare.mjs out.png dir  -> renders every <name>-app.svg / <name>-mono.svg / <name>-mark.svg in dir as a row
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, dir] = process.argv.slice(2);
const names = [...new Set(fs.readdirSync(dir).filter(n => n.endsWith('-app.svg')).map(n => n.replace(/-app\.svg$/, '')))].sort();
const u = n => 'file://' + path.join(dir, n);
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const row = n => {
  const fav = fs.existsSync(path.join(dir, n + '-fav.svg')) ? n + '-fav.svg' : n + '-app.svg';
  return `<div class="r"><span>${n}</span>
  <div class="c w"><img src="${u(n+'-mark.svg')}" width="110"></div>
  <img src="${u(n+'-app.svg')}" width="64" style="border-radius:14px">
  <img src="${u(n+'-app.svg')}" width="40" style="border-radius:50%">
  <img src="${u(n+'-app.svg')}" width="32" style="border-radius:7px">
  <div class="tb"><img src="${u(fav)}" width="16"><b>Divi</b></div>
  <div class="tb dk"><img src="${u(fav)}" width="16"><b>Divi</b></div>
  <div class="c p"><img src="${u(n+'-mono.svg')}" width="44"><img src="${u(n+'-mono.svg')}" width="32"><img src="${u(n+'-mono.svg')}" width="22"></div>
  <div class="c w"><img src="${u(n+'-mark.svg')}" width="32"><img src="${u(n+'-mark.svg')}" width="20"></div>
  </div>`;
};
const html = `<!doctype html><html><head><style>body{margin:0;background:#e9e9e6;font:600 11px Helvetica;color:#555}
.r{display:flex;align-items:center;gap:14px;padding:10px 16px;border-bottom:1px solid #ddd}.r span{width:90px}
.c{display:flex;gap:14px;align-items:center;padding:12px 16px;border-radius:10px}
.w{background:#fafaf8}.p{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
.tb{display:flex;gap:6px;align-items:center;background:#fff;padding:8px 10px;border-radius:7px;color:#222}.tb.dk{background:#35363a;color:#eee}
</style></head><body>${names.map(row).join('')}</body></html>`;
fs.writeFileSync(out.replace(/\.png$/, '.html'), html);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1250, height: 200 }, deviceScaleFactor: 2 });
await pg.goto('file://' + out.replace(/\.png$/, '.html')); await pg.waitForLoadState('load');
await pg.screenshot({ path: out, fullPage: true }); await b.close();
console.log(names.join(' '));
