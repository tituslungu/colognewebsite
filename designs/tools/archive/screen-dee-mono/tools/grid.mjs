// usage: node grid.mjs <dir-of-images> <out.png> [cell=140]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [dir, out, cellArg] = process.argv.slice(2);
const cell = +(cellArg || 140);
const files = fs.readdirSync(dir).filter(f => /\.(svg|png|jpe?g|webp|ico)$/i.test(f)).sort();
const items = files.map(f => {
  const buf = fs.readFileSync(path.join(dir, f));
  const ext = path.extname(f).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'ico' ? 'image/x-icon' : ext === 'jpg' ? 'image/jpeg' : 'image/' + ext;
  return `<figure><img src="data:${mime};base64,${buf.toString('base64')}"><figcaption>${f.replace(/\.[^.]+$/, '')}</figcaption></figure>`;
}).join('');
const html = `<!doctype html><html><head><style>
body{margin:0;padding:12px;background:#fff;font:12px system-ui;display:grid;grid-template-columns:repeat(8,${cell}px);gap:8px}
figure{margin:0;text-align:center}img{width:${cell-30}px;height:${cell-30}px;object-fit:contain;display:block;margin:0 auto}
</style></head><body>${items}</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 8 * (cell + 8) + 24, height: 400 } });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('wrote', out, files.length);
