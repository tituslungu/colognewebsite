// node smallzoom.mjs out.png a.svg b.svg ...  -> each row: 16px tab (light+dark), 24, 32, 40 circle at 1x and 2x, magnified
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...files] = process.argv.slice(2);
const b = await chromium.launch();
async function shot(dsf) {
  const rows = files.map(f0 => { const f = 'data:image/svg+xml;base64,' + fs.readFileSync(f0).toString('base64'); return `<div style="display:flex;gap:6px;align-items:center;height:48px;padding:4px">
    <img src="${f}" width="16" height="16" style="border-radius:3px">
    <span style="background:#35363a;padding:4px;display:flex"><img src="${f}" width="16" height="16" style="border-radius:3px"></span>
    <img src="${f}" width="24" height="24" style="border-radius:5px">
    <img src="${f}" width="32" height="32" style="border-radius:7px">
    <img src="${f}" width="40" height="40" style="border-radius:50%">
    <span style="background:#fff;padding:4px;display:flex"><img src="${f}" width="40" height="40" style="border-radius:50%"></span></div>`; }).join('');
  const p = await b.newPage({ viewport: { width: 260, height: 56 * files.length + 8 }, deviceScaleFactor: dsf });
  await p.setContent(`<body style="margin:0;background:#f2f3f1">${rows}</body>`);
  await p.waitForTimeout(300);
  const buf = await p.screenshot();
  await p.close();
  return buf.toString('base64');
}
const a = await shot(1), c = await shot(2);
const p = await b.newPage({ viewport: { width: 1600, height: 100 } });
await p.setContent(`<body style="margin:0;display:flex;align-items:flex-start;gap:20px;background:#ccc"><img src="data:image/png;base64,${a}" style="image-rendering:pixelated;width:${260*3}px;height:auto"><img src="data:image/png;base64,${c}" style="image-rendering:pixelated;width:${260*3}px;height:auto"></body>`);
await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true });
await b.close();
