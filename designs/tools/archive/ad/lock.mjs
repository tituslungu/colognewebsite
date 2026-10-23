import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const D = 'file:///Users/titus/repos/colognewebsite/designs/logos/' + process.argv[2] + '/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 760 }, deviceScaleFactor: 1 });
await p.goto("file:///private/tmp/");
await p.setContent(`<body style="margin:0;font:12px Helvetica">
<div style="background:#fafaf8;padding:40px;display:flex;gap:40px;align-items:center"><img src="${D}lockup.svg" style="height:150px"><img src="${D}lockup.svg" style="height:40px"><img src="${D}lockup.svg" style="height:24px"></div>
<div style="background:#2d2d2d;padding:40px;display:flex;gap:40px;align-items:center"><img src="${D}lockup-reverse.svg" style="height:150px"><img src="${D}lockup-reverse.svg" style="height:40px"><img src="${D}mark-reverse.svg" style="height:120px"></div>
<div style="background:#fafaf8;padding:20px 40px;display:flex;gap:40px;align-items:center"><img src="${D}mark.svg" style="height:180px;outline:1px dashed #ccc"><img src="${D}app-icon.svg" style="height:180px;border-radius:50%"><img src="${D}app-icon.svg" style="height:180px;border-radius:40px"></div>
</body>`);
await p.waitForTimeout(400);
await p.screenshot({ path: 'lock-' + process.argv[2] + '.png', fullPage: true });
await b.close();
