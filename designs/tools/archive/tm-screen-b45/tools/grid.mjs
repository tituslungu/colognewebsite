// Renders a comparison grid: Divi concept marks next to downloaded brand SVGs (as <img>, black on white).
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [dlDir, outPng, ...concepts] = process.argv.slice(2);
const files = fs.readdirSync(dlDir).filter(f => f.endsWith('.svg') && fs.statSync(path.join(dlDir, f)).size > 150).sort();
const cell = (src, label, bg='#fff') => `<div class="c"><div class="i" style="background:${bg}"><img src="file://${src}"></div><div class="l">${label}</div></div>`;
let html = `<html><head><style>body{margin:16px;font:12px sans-serif;background:#eee}.g{display:flex;flex-wrap:wrap;gap:10px}.c{width:120px}.i{width:120px;height:120px;display:flex;align-items:center;justify-content:center;border:1px solid #ccc}.i img{width:96px;height:96px;object-fit:contain}.l{text-align:center;margin-top:3px;word-break:break-all}</style></head><body><div class="g">`;
for (const c of concepts) {
  html += cell(`/Users/titus/repos/colognewebsite/designs/logos/${c}/mark.svg`, `${c} mark`);
  html += cell(`/Users/titus/repos/colognewebsite/designs/logos/${c}/mark-mono.svg`, `${c} mono`, '#222');
}
for (const f of files) html += cell(path.join(dlDir, f), f.replace('.svg',''));
html += `</div></body></html>`;
const htmlPath = outPng.replace(/\.png$/, '.html');
fs.writeFileSync(htmlPath, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
await p.goto('file://' + htmlPath);
await p.waitForTimeout(500);
await p.screenshot({ path: outPng, fullPage: true });
await b.close();
console.log('wrote', outPng);
