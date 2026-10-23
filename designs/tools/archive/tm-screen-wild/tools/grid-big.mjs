// usage: node grid.mjs in.json out.png  -- renders labelled grid of remote icons
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [inp, out] = process.argv.slice(2);
const items = JSON.parse(fs.readFileSync(inp, 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const html = `<!doctype html><meta charset=utf-8><style>body{margin:0;padding:12px;background:#ddd;font:12px sans-serif;display:grid;grid-template-columns:repeat(3,420px);gap:10px}
div{background:#fff;padding:6px;text-align:center}img{width:400px;height:400px;object-fit:contain;display:block;margin:0 auto 4px}</style>` +
  items.map((it,i) => `<div><img src="${esc(it.url)}"><b>${i}</b> ${esc(it.label)}</div>`).join('');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1320, height: 400 } });
await p.setContent(html, { waitUntil: 'networkidle', timeout: 60000 });
await p.screenshot({ path: out, fullPage: true });
await b.close();
