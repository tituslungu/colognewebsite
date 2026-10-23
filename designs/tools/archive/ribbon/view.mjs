// Render one or more SVG files side by side at a given size, with optional circle-crop guide.
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2]; const size = +process.argv[3]; const files = process.argv.slice(4);
const html = `<body style="margin:0;background:#ddd;display:flex;gap:12px;padding:12px;flex-wrap:wrap">${files.map(f=>`<div style="position:relative;width:${size}px;height:${size}px"><img src="file://${f}" width="${size}" height="${size}"><svg viewBox="0 0 256 256" style="position:absolute;inset:0;width:100%;height:100%"><circle cx="128" cy="128" r="128" fill="none" stroke="rgba(255,0,0,.5)" stroke-width=".5"/><circle cx="128" cy="128" r="116" fill="none" stroke="rgba(255,0,0,.3)" stroke-width=".5" stroke-dasharray="2 2"/><line x1="128" y1="0" x2="128" y2="256" stroke="rgba(255,0,0,.25)" stroke-width=".4"/><line y1="128" x1="0" y2="128" x2="256" stroke="rgba(255,0,0,.25)" stroke-width=".4"/></svg></div>`).join('')}</body>`;
fs.writeFileSync(out + '.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: files.length * (size + 12) + 12, height: size + 24 } });
await p.goto('file://' + out + '.html'); await p.waitForTimeout(200);
await p.screenshot({ path: out }); await b.close();
