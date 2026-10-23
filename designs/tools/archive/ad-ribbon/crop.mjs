// node crop.mjs out.png size x y w svg1 [svg2...] : render region [x,y,w,w] of each svg (256 space) at size px
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [,, out, sz, x, y, w, ...files] = process.argv; const S = +sz, k = S / +w;
const html = `<body style="margin:0;background:#888;display:flex;gap:8px;padding:8px">${files.map(f => `<div style="width:${S}px;height:${S}px;overflow:hidden;position:relative"><img src="file://${path.resolve(f)}" style="position:absolute;width:${256 * k}px;height:${256 * k}px;left:${-x * k}px;top:${-y * k}px"></div>`).join('')}</body>`;
fs.writeFileSync(out + '.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: files.length * (S + 8) + 8, height: S + 16 } });
await p.goto('file://' + path.resolve(out + '.html')); await p.waitForTimeout(200); await p.screenshot({ path: out }); await b.close();
