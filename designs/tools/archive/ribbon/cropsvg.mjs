import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [,, src, out, x0, y0, w, h, scale] = process.argv.map((v,i)=>i>3?+v:v);
const fs = require('fs');
fs.writeFileSync(out+'.html',`<body style="margin:0;overflow:hidden"><div style="position:relative;width:${256*scale}px;height:${256*scale}px;left:${-x0*scale}px;top:${-y0*scale}px"><img src="file://${src}" style="position:absolute;inset:0;width:100%;height:100%"></div></body>`);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w*scale, height: h*scale } });
await p.goto('file://'+out+'.html'); await p.waitForTimeout(200); await p.screenshot({ path: out }); await b.close();
