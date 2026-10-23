import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [dir, out, filter] = process.argv.slice(2);
let files = fs.readdirSync(dir).filter(f => f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.ico')).sort();
if (filter) files = files.filter(f => filter.split(',').some(p => f.startsWith(p)));
const cells = files.map(f => {
  const buf = fs.readFileSync(path.join(dir, f));
  const mime = f.endsWith('.svg') ? 'image/svg+xml' : f.endsWith('.webp') ? 'image/webp' : f.endsWith('.ico') ? 'image/x-icon' : 'image/png';
  return `<div class="c"><img src="data:${mime};base64,${buf.toString('base64')}"><span>${f.replace(/\.[a-z]+$/,'')}</span></div>`;
}).join('');
const html = `<html><body style="--cols:${process.env.COLS||10};--cw:${process.env.CW||120}px;--sz:${process.env.SZ||80}px;margin:0;background:#fff;font:11px sans-serif"><div style="display:grid;grid-template-columns:repeat(var(--cols),var(--cw));gap:6px;padding:8px">${cells}</div>
<style>.c{display:flex;flex-direction:column;align-items:center;gap:4px}.c img{width:var(--sz);height:var(--sz);object-fit:contain}</style></body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(process.env.VW||1300), height: 400 } });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log(files.length, 'icons ->', out);
