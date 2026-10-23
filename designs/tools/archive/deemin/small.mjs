import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const D = '/Users/titus/repos/colognewebsite/designs/logos/dee-min';
const S = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/deemin';
const cws = ['blue', 'sage', 'sage-dark', 'charcoal', 'white-sage'];
let h = '<body style="margin:0;background:#dee1e6;padding:4px">';
for (const c of ['upper', 'lower']) { h += '<div style="display:flex;gap:6px;align-items:center;height:44px">'; for (const k of cws) h += `<img src="file://${D}/${c}-${k}.svg" width=16 height=16 style="border-radius:3px"><img src="file://${D}/${c}-${k}.svg" width=40 height=40 style="border-radius:50%">`; h += '</div>'; }
fs.writeFileSync(`${S}/small.html`, h + '</body>');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 330, height: 100 }, deviceScaleFactor: 1 });
await p.goto(`file://${S}/small.html`); await p.waitForTimeout(300); await p.screenshot({ path: `${S}/small1x.png` });
const q = await b.newPage({ viewport: { width: 1320, height: 400 } });
await q.setContent(`<body style="margin:0"><img src="data:image/png;base64,${fs.readFileSync(`${S}/small1x.png`).toString('base64')}" style="width:1320px;image-rendering:pixelated"></body>`);
await q.screenshot({ path: `${S}/small-zoom.png` }); await b.close();
