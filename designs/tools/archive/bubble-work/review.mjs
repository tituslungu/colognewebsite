import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const ids = (process.argv[2] || 'bubble-1,bubble-2,bubble-3').split(',');
const base = 'file:///Users/titus/repos/colognewebsite/designs/logos/';
const row = id => `<div class="r"><b>${id}</b>
  <img src="${base}${id}/app-icon.svg" width="16" style="border-radius:3px">
  <span class="tab"><img src="${base}${id}/app-icon.svg" width="16" style="border-radius:3px"> Divi</span>
  <span class="tab d"><img src="${base}${id}/app-icon.svg" width="16" style="border-radius:3px"> Divi</span>
  <img src="${base}${id}/app-icon.svg" width="32" style="border-radius:7px">
  <img src="${base}${id}/app-icon.svg" width="40" style="border-radius:50%">
  <img src="${base}${id}/app-icon.svg" width="56" style="border-radius:50%">
  <span class="w"><img src="${base}${id}/mark.svg" width="40"></span>
  <span class="w"><img src="${base}${id}/mark.svg" width="24"></span>
  <span class="k"><img src="${base}${id}/mark-mono.svg" width="40"></span>
  <span class="w lk"><img src="${base}${id}/lockup.svg" height="44"></span>
  <span class="k lk"><img src="${base}${id}/lockup-reverse.svg" height="44"></span>
</div>`;
const html = `<!doctype html><html><head><style>body{margin:0;background:#f2f3f1;font:12px Helvetica}.r{display:flex;align-items:center;gap:14px;padding:10px 14px;border-bottom:1px solid #ddd}.r b{width:70px}.tab{display:inline-flex;gap:6px;align-items:center;background:#fff;padding:6px 10px;border-radius:6px}.tab.d{background:#35363a;color:#e8eaed}.w{background:#fff;padding:8px;display:inline-flex}.k{background:#2d2d2d;padding:8px;display:inline-flex}.lk{padding:12px 16px}</style></head><body>${ids.map(row).join('')}</body></html>`;
fs.writeFileSync(new URL('./review.html', import.meta.url), html);
const b = await chromium.launch();
for (const dsf of [1, 2]) {
  const p = await b.newPage({ viewport: { width: 1180, height: 100 }, deviceScaleFactor: dsf });
  await p.goto(new URL('./review.html', import.meta.url).href);
  await p.screenshot({ path: new URL(`./review@${dsf}x.png`, import.meta.url).pathname, fullPage: true });
}
await b.close();
console.log('ok');
