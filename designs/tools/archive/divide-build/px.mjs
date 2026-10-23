import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [,, out, ...files] = process.argv;
const L = '/Users/titus/repos/colognewebsite/designs/logos/';
const row = f => `<div style="display:flex;gap:6px;align-items:center;padding:4px">
 <span style="background:#dee1e6;padding:4px;display:flex"><img src="file://${L+f}" width="16" height="16" style="border-radius:3px"></span>
 <span style="background:#202124;padding:4px;display:flex"><img src="file://${L+f}" width="16" height="16" style="border-radius:3px"></span>
 <span style="background:#fff;padding:4px;display:flex"><img src="file://${L+f}" width="32" height="32" style="border-radius:6px"></span>
 <span style="background:#fff;padding:4px;display:flex"><img src="file://${L+f}" width="40" height="40" style="border-radius:50%"></span></div>`;
fs.writeFileSync(out+'.1x.html', `<body style="margin:0;background:#f2f3f1">${files.map(row).join('')}</body>`);
const b = await chromium.launch();
let p = await b.newPage({ viewport: { width: 170, height: files.length*56 }, deviceScaleFactor: 1 });
await p.goto('file://'+out+'.1x.html'); await p.waitForTimeout(300);
await p.screenshot({ path: out+'.1x.png' });
fs.writeFileSync(out+'.html', `<body style="margin:0"><img src="file://${out}.1x.png" style="width:${170*6}px;image-rendering:pixelated"></body>`);
p = await b.newPage({ viewport: { width: 170*6, height: files.length*56*6 } });
await p.goto('file://'+out+'.html'); await p.waitForTimeout(300);
await p.screenshot({ path: out });
await b.close();
