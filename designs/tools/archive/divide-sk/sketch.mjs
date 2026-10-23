// Renders every *.svg in a folder as: big tile, 64 tile, 40 circle, 16 tile, 16 on dark.
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const dir = process.argv[2]; const out = process.argv[3];
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
const u = f => 'file://' + path.join(dir, f);
const html = `<!doctype html><html><body style="margin:0;background:#f2f3f1;font:600 12px Helvetica">
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:16px;width:1180px">
${files.map(f => `<div style="background:#fff;border-radius:10px;padding:10px;display:grid;gap:8px;justify-items:center">
<div>${f}</div><img src="${u(f)}" width="200" height="200" style="border-radius:40px">
<div style="display:flex;gap:10px;align-items:center">
<img src="${u(f)}" width="64" height="64" style="border-radius:14px">
<img src="${u(f)}" width="40" height="40" style="border-radius:50%">
<img src="${u(f)}" width="16" height="16" style="border-radius:3px">
<span style="background:#202124;padding:6px;border-radius:4px;display:inline-flex"><img src="${u(f)}" width="16" height="16" style="border-radius:3px"></span>
<span style="background:#dee1e6;padding:6px;border-radius:4px;display:inline-flex"><img src="${u(f)}" width="16" height="16" style="border-radius:3px"></span>
</div></div>`).join('')}
</div></body></html>`;
fs.writeFileSync(path.join(dir, '_sheet.html'), html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1212, height: 800 }, deviceScaleFactor: 1 });
await p.goto('file://' + path.join(dir, '_sheet.html'));
await p.screenshot({ path: out, fullPage: true });
await b.close();
