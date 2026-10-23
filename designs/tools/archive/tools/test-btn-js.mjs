import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///Users/titus/repos/colognewebsite/designs/index.html');
await p.click('.btn-seg button[data-btn="soft"]'); await p.click('.ord-seg button[data-ord="im"]');
const r = await p.evaluate(() => ({ img: document.querySelector('img[data-bslug]').getAttribute('src'),
  link: document.querySelector('a.open[data-bslug]').getAttribute('href'),
  broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')),
  sw: document.scrollingElement.scrollWidth - innerWidth, rounds: [...document.querySelectorAll('.round .eyebrow')].map(e => e.textContent) }));
await p.waitForTimeout(400);
await p.screenshot({ path: process.argv[2] + '/gallery-r4.png' });
console.log(JSON.stringify(r), 'errors:', errs); await b.close();
