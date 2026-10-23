import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const L = '/Users/titus/repos/colognewebsite/designs/logos/';
const row = id => `<div style="display:flex;gap:20px;margin-bottom:20px">
<div style="background:#fafaf8;padding:40px;border:1px solid #ddd"><img src="file://${L}${id}/lockup.svg" height="120"></div>
<div style="background:#2d2d2d;padding:40px"><img src="file://${L}${id}/lockup-reverse.svg" height="120"></div>
<div style="background:#fafaf8;padding:20px;display:grid;gap:10px;align-content:center"><img src="file://${L}${id}/lockup.svg" height="28"><img src="file://${L}${id}/lockup.svg" height="18"></div></div>`;
const html = `<body style="margin:0;padding:20px;background:#eee">${row('message-1')}${row('message-2')}</body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 520 }, deviceScaleFactor: 1.5 });
(await import('fs')).writeFileSync(process.cwd() + '/lockups.html', html); await p.goto('file://' + process.cwd() + '/lockups.html');
await p.waitForTimeout(400);
await p.screenshot({ path: 'lockups.png', fullPage: true });
await b.close();
