import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [tone, w, h, out, css = '', clip = '', wait = '1200'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('file:///Users/titus/repos/colognewebsite/designs/a-stack/index.html?tone=' + tone + '&shot=1');
await p.waitForLoadState('load');
if (css) await p.addStyleTag({ content: css });
await p.waitForTimeout(+wait);
const opts = { path: out };
if (clip) { const [x, y, cw, ch] = clip.split(',').map(Number); opts.clip = { x, y, width: cw, height: ch }; }
await p.screenshot(opts);
await b.close();
