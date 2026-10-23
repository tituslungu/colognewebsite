// node shot.mjs in.html out.png [width]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [inp, out, w] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +(w || 1400), height: 600 }, deviceScaleFactor: 1 });
await p.goto('file://' + inp); await p.waitForLoadState('load');
await p.screenshot({ path: out, fullPage: true }); await b.close();
