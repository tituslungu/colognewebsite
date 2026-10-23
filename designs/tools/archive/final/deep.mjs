import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
// 404 served at an arbitrary depth, as GitHub Pages does
let p = await b.newPage({ viewport: { width: 390, height: 664 } });
await p.route('**/a/b/c/missing', r => r.fulfill({ status: 404, contentType: 'text/html', body: fs.readFileSync('/Users/titus/repos/colognewebsite/404.html', 'utf8') }));
const bad = [];
p.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/missing')) bad.push(r.status() + ' ' + r.url()); });
p.on('requestfailed', r => bad.push('FAILED ' + r.url()));
await p.goto('http://127.0.0.1:8765/a/b/c/missing');
await p.waitForTimeout(800);
console.log('deep 404:', await p.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, icon: document.querySelector('.mark img').naturalWidth, photo: getComputedStyle(document.querySelector('.photo > div')).backgroundImage.slice(0, 60), title: document.title })), 'bad:', bad);
await p.close();
// Homepage keyboard order and focus rings
for (const [w, h] of [[1440, 790], [390, 664]]) {
  p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:8765/');
  const seq = [];
  for (let i = 0; i < 7; i++) {
    await p.keyboard.press('Tab');
    seq.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return (a.getAttribute('aria-label') || a.textContent.replace(/\s+/g, ' ').trim()) + ' [' + cs.outlineColor + ' ' + cs.outlineStyle + ']'; }));
  }
  console.log(w, seq.join(' -> '));
  const hov = [];
  for (const s of ['.btn-imessage', '.btn-whatsapp']) {
    const before = await p.evaluate(s => { const cs = getComputedStyle(document.querySelector(s)); return cs.backgroundColor + '/' + cs.borderTopColor + '/' + cs.color; }, s);
    await p.hover(s); await p.waitForTimeout(300);
    const after = await p.evaluate(s => { const cs = getComputedStyle(document.querySelector(s)); return cs.backgroundColor + '/' + cs.borderTopColor + '/' + cs.color; }, s);
    hov.push(`${s}: ${before} -> hover ${after}`);
  }
  console.log('  ' + hov.join('\n  '));
  await p.close();
}
await b.close();
