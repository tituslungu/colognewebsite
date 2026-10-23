// node zoomx.mjs <slug> <query> <w>x<h> <x,y,cw,ch> <out.png> <scale> [css]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, query, vp, clip, out, scale = '4', css = ''] = process.argv.slice(2);
const [w, h] = vp.split('x').map(Number);
const [x, y, cw, ch] = clip.split(',').map(Number);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Number(scale), isMobile: w < 800, hasTouch: w < 800 });
const p = await ctx.newPage();
await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
if (css) await p.addStyleTag({ content: css });
await p.waitForTimeout(1200);
await p.screenshot({ path: out, clip: { x, y, width: cw, height: ch } });
await b.close();
