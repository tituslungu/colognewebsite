import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const L = '/Users/titus/repos/colognewebsite/designs/logos/';
const photo = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg';
const row = id => `<div class="r"><div class="c w"><img src="file://${L}${id}/lockup.svg"></div>
<div class="c k"><img src="file://${L}${id}/lockup-reverse.svg"></div>
<div class="c p"><img src="file://${L}${id}/lockup-reverse.svg"></div>
<div class="c w"><img src="file://${L}${id}/lockup.svg" style="height:28px"></div></div>`;
const html = `<!doctype html><style>body{margin:0;background:#eee}.r{display:flex;gap:10px;padding:10px}
.c{display:grid;place-items:center;width:420px;height:170px;border-radius:8px}.c img{height:84px}
.w{background:#fafaf8}.k{background:#2d2d2d}.p{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url(${photo}) center/cover}
.c:last-child{width:200px}</style>${row('message-1')}${row('message-2')}`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1520, height: 380 }, deviceScaleFactor: 2 });
(await import('fs')).writeFileSync('/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/msg-ad/lockups.html', html); await p.goto('file:///private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/msg-ad/lockups.html'); await p.waitForLoadState('load'); await new Promise(r => setTimeout(r, 300));
await p.screenshot({ path: process.argv[2], fullPage: true }); await b.close();
