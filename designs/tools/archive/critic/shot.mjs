import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [file, out, w = 480, h = 360, s = 2] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +s });
await p.goto('file://' + file); await p.waitForTimeout(200);
const bb = await p.evaluate(() => Array.from(document.querySelectorAll('.big path')).map(e => { const r = e.getBBox(); return [r.x, r.y, r.width, r.height].map(n => n.toFixed(2)).join(','); }));
console.log('bboxes (x,y,w,h):', bb.join('  |  '));
await p.screenshot({ path: out }); await b.close();
