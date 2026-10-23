import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [iconsDir, svgDir, markPath, outPng] = process.argv.slice(2);
const rows = fs.readFileSync(path.join(iconsDir,'list.tsv'),'utf8').trim().split('\n').map(l=>l.split('\t'));
const b64 = p => fs.readFileSync(p).toString('base64');
let cells = `<div class=c><img src="data:image/svg+xml;base64,${b64(markPath)}"><span>CONCEPT portion-1</span></div>`;
for (const [slug,name] of rows) { const p = path.join(iconsDir, slug+'.jpg'); if (fs.existsSync(p) && fs.statSync(p).size>500) cells += `<div class=c><img src="data:image/jpeg;base64,${b64(p)}"><span>${name.split('|')[0].replace(/</g,'')}</span></div>`; }
for (const f of fs.readdirSync(svgDir).filter(f=>f.endsWith('.svg'))) cells += `<div class=c><img class=s src="data:image/svg+xml;base64,${b64(path.join(svgDir,f))}"><span>SI: ${f}</span></div>`;
const extra = process.argv[6]; if (extra) for (const p of extra.split(',')) cells += `<div class=c><img src="data:image/png;base64,${b64(p)}"><span>${path.basename(p)}</span></div>`;
const html = `<html><body style="margin:0;background:#eee;font:12px sans-serif"><style>.c{display:inline-block;width:130px;margin:6px;text-align:center;vertical-align:top}.c img{width:110px;height:110px;object-fit:contain;background:#fff;border-radius:16px}.c img.s{padding:15px;box-sizing:border-box}.c span{display:block;height:30px;overflow:hidden}</style>${cells}</body></html>`;
const b = await chromium.launch(); const pg = await b.newPage({viewport:{width:1300,height:800}});
await pg.setContent(html); await pg.waitForTimeout(500); await pg.screenshot({path: outPng, fullPage:true}); await b.close();
