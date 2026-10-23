// node stack.mjs out.png cols a.png b.png ... -> grid of images
import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, cols, ...imgs] = process.argv.slice(2);
const html = `<!doctype html><body style="margin:0;background:#ddd"><div style="display:grid;grid-template-columns:repeat(${cols},max-content);gap:10px;padding:10px">${imgs.map(i => `<img src="file://${i}" style="width:${i.includes('d-bleed') ? 390 : 640}px">`).join('')}</div></body>`;
fs.writeFileSync(out + '.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 400 }, deviceScaleFactor: 2 });
await p.goto('file://' + out + '.html'); await p.waitForLoadState('load'); await p.screenshot({ path: out, fullPage: true }); await b.close();
