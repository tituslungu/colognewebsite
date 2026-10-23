import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [,, out, ...files] = process.argv;
const cell = f => { const dark = /mono|site/.test(f); const tile = /app-icon/.test(f);
  return `<div style="position:relative;width:400px;height:400px;background:${dark?'#2d2d2d':'#fff'}">
  <img src="file://${f}" width="400" height="400" style="display:block;${tile?'':''}">
  <div style="position:absolute;left:0;right:0;top:200px;height:1px;background:rgba(255,0,80,.5)"></div>
  <div style="position:absolute;top:0;bottom:0;left:200px;width:1px;background:rgba(255,0,80,.5)"></div>
  ${tile?'<div style="position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1px rgba(255,0,80,.6)"></div>':''}</div>`; };
fs.writeFileSync(out + '.html', `<body style="margin:0;display:flex;gap:20px;padding:20px;background:#ddd">${files.map(cell).join('')}</body>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 20 + files.length * 420, height: 440 } });
await p.goto('file://' + out + '.html');
await p.waitForTimeout(300);
await p.screenshot({ path: out });
await b.close();
