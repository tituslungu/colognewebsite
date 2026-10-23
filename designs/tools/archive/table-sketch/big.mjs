import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const L = '/Users/titus/repos/colognewebsite/designs/logos/';
const html = `<body style="margin:0;background:#f2f3f1;display:flex;gap:20px;padding:20px;flex-wrap:wrap;width:1100px">
${['table-1','table-2'].map(id=>`<img src="file://${L}${id}/app-icon.svg" width="256" style="border-radius:50%"><img src="file://${L}${id}/mark.svg" width="256" style="background:#fafaf8"><img src="file://${L}${id}/mark-mono.svg" width="256" style="background:#2d2d2d"><img src="file://${L}${id}/mark-reverse.svg" width="256" style="background:#24382e">`).join('')}
${['table-1','table-2'].map(id=>`<img src="file://${L}${id}/lockup.svg" height="80" style="background:#fafaf8;padding:16px"><img src="file://${L}${id}/lockup-reverse.svg" height="80" style="background:#2d2d2d;padding:16px">`).join('')}
</body>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1140, height: 900 } });
(await import('fs')).writeFileSync(process.cwd()+'/big.html', html); await p.goto('file://'+process.cwd()+'/big.html'); await p.waitForTimeout(300);
await p.screenshot({ path: 'big.png', fullPage: true }); await b.close();
