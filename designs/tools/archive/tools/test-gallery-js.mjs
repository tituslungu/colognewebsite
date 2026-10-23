import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///Users/titus/repos/colognewebsite/designs/index.html');
await p.click('.footer-seg button[data-footer="light"]');
const r = await p.evaluate(() => ({
  imgs: [...document.querySelectorAll('img[data-fslug]')].map(i => i.getAttribute('src')).slice(0, 2),
  links: [...document.querySelectorAll('a.open[data-fslug]')].map(a => a.getAttribute('href')).slice(0, 1),
  rounds: [...document.querySelectorAll('.round .eyebrow')].map(e => e.textContent) }));
console.log(JSON.stringify(r), 'errors:', errs);
await b.close();
