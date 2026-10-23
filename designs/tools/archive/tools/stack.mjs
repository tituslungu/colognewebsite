import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...imgs] = process.argv.slice(2);
const html = '<body style="margin:0;background:#888">' + imgs.map(f => `<div style="margin:0 0 4px"><img style="display:block" src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}"></div>`).join('') + '</body>';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 400 } });
await p.setContent(html); await p.waitForTimeout(100); await p.screenshot({ path: out, fullPage: true }); await b.close();
