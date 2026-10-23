// Contact sheet of PNG icons with their index numbers. Usage: node pnggrid.mjs <dir> <outPrefix> [perPage]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [dir, outPrefix, per='96'] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 800 } });
for (let pg = 0; pg * +per < files.length; pg++) {
  const chunk = files.slice(pg * +per, (pg + 1) * +per);
  let html = `<html><body style="margin:10px;background:#ddd;font:13px sans-serif"><div style="display:flex;flex-wrap:wrap;gap:6px">`;
  for (const f of chunk) html += `<div style="width:100px;text-align:center"><img src="file://${path.join(dir,f)}" style="width:96px;height:96px"><div>${f.replace('.png','')}</div></div>`;
  html += `</div></body></html>`;
  const hp = `${outPrefix}-${pg}.html`; fs.writeFileSync(hp, html);
  await p.goto('file://' + hp); await p.waitForTimeout(400);
  await p.screenshot({ path: `${outPrefix}-${pg}.png`, fullPage: true });
  console.log(`${outPrefix}-${pg}.png`);
}
await b.close();
