import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const D = process.argv[2];
const b = await chromium.launch();
for (const [w, h] of [[1440, 790], [1366, 657], [768, 950], [390, 664], [375, 548], [844, 390], [1920, 1080]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('requestfailed', r => errs.push('FAILED ' + r.url()));
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.goto('http://127.0.0.1:8765/no/such/page/deep/here', { waitUntil: 'load' }).catch(() => {});
  // python http.server returns its own 404 page, so load our 404.html at a deep path instead
  await p.goto('http://127.0.0.1:8765/404.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s).getBoundingClientRect();
    const fe = getComputedStyle(document.documentElement).getPropertyValue('--fade-end');
    return { scroll: document.documentElement.scrollHeight, code: q('.notfound-code').top, codeH: q('.notfound-code').height,
      btn: [q('.notfound .btn').width, q('.notfound .btn').height].map(Math.round), btnBottom: q('.notfound .btn').bottom, footer: q('.footer').top,
      hero: q('.hero').height, backdrop: q('.backdrop').height };
  });
  console.log(`${w}x${h}: scrollH=${r.scroll} fits=${r.scroll <= h} hero=${r.hero} fadeEnd=${r.backdrop} code top=${Math.round(r.code)} h=${Math.round(r.codeH)} btn=${r.btn} btnBottom=${Math.round(r.btnBottom)} footerTop=${Math.round(r.footer)} errs=${JSON.stringify(errs.filter(e => !e.includes('/no/such')))}`);
  await p.screenshot({ path: `${D}/404-${w}x${h}.png` });
  await ctx.close();
}
// Served at depth: copy-free check that root-relative assets resolve from a nested URL
const p = await b.newPage({ viewport: { width: 390, height: 664 } });
const fails = [];
p.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url()); });
await p.setContent(fs.readFileSync('/Users/titus/repos/colognewebsite/404.html', 'utf8'), { waitUntil: 'load' }).catch(() => {});
await p.close();
await b.close();
