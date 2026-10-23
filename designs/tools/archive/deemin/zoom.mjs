import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 800 } });
let grid='';
for(let i=0;i<=256;i+=16){grid+=`<line x1="${i}" y1="0" x2="${i}" y2="256" stroke="${i%64?'rgba(255,0,0,.25)':'rgba(255,0,0,.7)'}" stroke-width=".4"/><line y1="${i}" x1="0" y2="${i}" x2="256" stroke="${i%64?'rgba(255,0,0,.25)':'rgba(255,0,0,.7)'}" stroke-width=".4"/>`}
fs.writeFileSync('/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/deemin/zoom.html',`<body style="margin:0"><svg width="800" height="800" viewBox="0 0 256 256"><image href="file:///Users/titus/repos/colognewebsite/assets/img/icon.png" width="256" height="250"/>${grid}<circle cx="128" cy="128" r="128" fill="none" stroke="black" stroke-width=".5"/></svg></body>`);
await p.goto('file:///private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/deemin/zoom.html');
await p.waitForTimeout(300);
await p.screenshot({ path: 'icon-zoom.png' });
await b.close();
