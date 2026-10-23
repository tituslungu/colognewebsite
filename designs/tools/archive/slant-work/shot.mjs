// node shot.mjs <html> <png> [width]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [html, png, w] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(w || 1400), height: 600 }, deviceScaleFactor: 1 });
await p.goto('file://' + html);
await p.waitForTimeout(200);
await p.screenshot({ path: png, fullPage: true });
await b.close();
