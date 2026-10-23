// stitch the three hero crops (top-left corner) side by side
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const base = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/logo-shots/';
const ids = ['bubble-1', 'bubble-2', 'bubble-3'];
const html = `<body style="margin:0;display:flex;gap:6px;background:#000">${ids.map(i => `<div style="width:460px;height:300px;overflow:hidden"><img src="file://${base}${i}/hero-crop.png" style="width:1400px;margin:-20px 0 0 -230px"></div>`).join('')}</body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1392, height: 300 }, deviceScaleFactor: 1 });
await p.setContent(html);
await p.waitForTimeout(300);
await p.screenshot({ path: process.argv[2] });
await b.close();
