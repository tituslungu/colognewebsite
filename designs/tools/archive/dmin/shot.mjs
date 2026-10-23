// Usage: node shot.mjs <html-file> <png-out> [width] [height]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [,, html, out, w = '1400', h = '900', dpr = '1'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr });
await p.goto('file://' + html); await p.waitForLoadState('load'); await p.waitForTimeout(200);
await p.screenshot({ path: out, fullPage: true });
await b.close();
