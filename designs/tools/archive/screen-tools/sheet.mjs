import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [dir, out] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
let cells = files.map(f => {
  const svg = fs.readFileSync(path.join(dir, f), 'utf8');
  const b64 = Buffer.from(svg).toString('base64');
  return `<div class=c><img src="data:image/svg+xml;base64,${b64}"><span>${esc(f.replace('.svg',''))}</span></div>`;
}).join('');
const html = `<html><body style="margin:0;background:#fff;font:14px sans-serif"><div style="display:grid;grid-template-columns:repeat(8,150px);gap:10px;padding:10px">${cells}</div>
<style>.c{display:flex;flex-direction:column;align-items:center}.c img{width:110px;height:110px;object-fit:contain}</style></body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 800 } });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
