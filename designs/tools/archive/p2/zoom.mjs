// zoom render of svg files at large size for close inspection
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...files] = process.argv.slice(2);
const dark = f => /mono|site|reverse|app/.test(path.basename(f));
const html = `<!doctype html><body style="margin:0;background:#e9e9e6;display:flex;flex-wrap:wrap;gap:12px;padding:12px">${files.map(f => `<div style="background:${/site/.test(path.basename(f)) ? '#3a332c' : dark(f) && !/app/.test(path.basename(f)) ? '#2d2d2d' : '#fff'};padding:8px"><img src="file://${f}" style="height:${/lockup/.test(f) ? 150 : 400}px"></div>`).join('')}</body>`;
const tmp = out.replace(/\.png$/, '.html');
fs.writeFileSync(tmp, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 500 } });
await p.goto('file://' + tmp);
await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true });
await b.close();
