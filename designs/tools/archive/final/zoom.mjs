import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const D = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 800, height: 420 } });
const crops = [['1440x790-still', 125, 23, 54], ['390x664-still', 15, 12, 46]];
let html = '<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:10px;padding:10px">';
for (const [t, x, y, s] of crops) for (const k of ['prod', 'ref']) {
  const a = fs.readFileSync(`${D}/${k}-${t}.png`).toString('base64');
  html += `<div style="width:180px;height:180px;overflow:hidden;position:relative"><img style="position:absolute;left:${-x * 180 / s}px;top:${-y * 180 / s}px;transform-origin:0 0;image-rendering:pixelated;width:${(+t.split('x')[0]) * 180 / s}px" src="data:image/png;base64,${a}"><span style="position:absolute;left:4px;bottom:2px;color:#fff;font:12px sans-serif;background:#000">${k} ${t}</span></div>`;
}
await p.setContent(html);
await p.waitForTimeout(200);
await p.screenshot({ path: `${D}/icon-zoom.png` });
await b.close();
