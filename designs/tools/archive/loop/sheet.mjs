// node sheet.mjs out.png cols scale file1 file2 ...
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const [out, cols, scale, ...files] = process.argv.slice(2);
const cw = Math.round(530 * scale), ch = Math.round(655 * scale);
const b = await pw.chromium.launch(); const p = await b.newPage();
await p.setViewportSize({ width: cols * (cw + 6) + 6, height: Math.ceil(files.length / cols) * (ch + 26) + 6 });
await p.setContent(`<body style="margin:0;padding:3px;background:#888;font:bold 13px system-ui;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px">` + files.map(f => `<div><div style="height:20px;color:#fff;white-space:nowrap;overflow:hidden">${f.replace('.png','')}</div><img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="width:${cw}px;height:${ch}px;display:block"></div>`).join('') + '</body>');
await p.waitForTimeout(100); await p.screenshot({ path: out }); await b.close();
