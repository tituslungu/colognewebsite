import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs');
const out = process.argv[2]; const imgs = process.argv.slice(3);
fs.writeFileSync(out + '.html', `<body style="margin:0;background:#999;display:flex;gap:6px;padding:6px">${imgs.map(i=>`<img src="file://${i}">`).join('')}</body>`);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: imgs.length*166+12, height: 172 } });
await p.goto('file://' + out + '.html'); await p.waitForTimeout(200); await p.screenshot({ path: out }); await b.close();
