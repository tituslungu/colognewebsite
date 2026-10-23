// node zoomimg.mjs out.png width file1 [file2 ...]  -- shows images side by side at given width, smooth scaling, with grid
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs');
const [,, out, w, ...files] = process.argv; const W = +w;
const html = `<body style="margin:0;background:#888;display:flex;gap:10px;padding:10px">${files.map(f=>`<div style="position:relative;width:${W}px;height:${W}px;background:#fff"><img src="file://${f}" style="width:${W}px;height:${W}px;object-fit:contain;display:block"><svg viewBox="0 0 256 256" style="position:absolute;inset:0;width:100%;height:100%">${[32,64,96,128,160,192,224].map(v=>`<line x1="${v}" y1="0" x2="${v}" y2="256" stroke="rgba(255,0,0,.25)" stroke-width=".3"/><line y1="${v}" x1="0" y2="${v}" x2="256" stroke="rgba(255,0,0,.25)" stroke-width=".3"/>`).join('')}</svg></div>`).join('')}</body>`;
fs.writeFileSync(out + '.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: files.length*(W+10)+10, height: W+20 } });
await p.goto('file://' + out + '.html'); await p.waitForTimeout(300); await p.screenshot({ path: out }); await b.close();
