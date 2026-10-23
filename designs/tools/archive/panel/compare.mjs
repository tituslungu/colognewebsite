// Final-panel comparison: true-1x small sizes (upscaled nearest-neighbour) + lockups.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const L = '/Users/titus/repos/colognewebsite/designs/logos/';
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/panel/';
const ids = ['divide-1', 'letter-1', 'table-1', 'message-1', 'message-2'];
const uri = p => 'data:image/svg+xml;base64,' + fs.readFileSync(p).toString('base64');
const ex = p => fs.existsSync(p);

const browser = await chromium.launch();
// Pass 1: render tiny sizes at DPR 1, screenshot, then upscale screenshot with pixelated CSS.
const p1 = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 400, height: 60 * ids.length + 20 } });
let rows = '';
for (const id of ids) {
  const fav = ex(L + id + '/favicon.svg') ? L + id + '/favicon.svg' : L + id + '/app-icon.svg';
  rows += `<div class=r>
    <img src="${uri(L + id + '/app-icon.svg')}" width=16 height=16>
    <span class=l><img src="${uri(fav)}" width=16 height=16></span>
    <span class=d><img src="${uri(fav)}" width=16 height=16></span>
    <img class=c src="${uri(L + id + '/app-icon.svg')}" width=40 height=40>
    <img class=c src="${uri(L + id + '/app-icon.svg')}" width=28 height=28>
    <span class=w><img src="${uri(L + id + '/mark.svg')}" width=16 height=16></span>
  </div>`;
}
await p1.setContent(`<style>body{margin:10px;background:#f2f2f0;font:12px sans-serif}
.r{display:flex;gap:12px;align-items:center;height:50px;margin-bottom:10px}
.l{background:#fff;padding:4px}.d{background:#35363a;padding:4px}.w{background:#fff;padding:4px}
.c{border-radius:50%}</style>${rows}`);
await p1.waitForTimeout(300);
await p1.screenshot({ path: OUT + 'tiny-1x.png' });

const p2 = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1400, height: 1240 } });
await p2.setContent(`<style>body{margin:0;background:#fff}img{image-rendering:pixelated;width:1400px}</style><img src="data:image/png;base64,${fs.readFileSync(OUT + 'tiny-1x.png').toString('base64')}">`);
await p2.screenshot({ path: OUT + 'tiny-zoom.png' });

// Pass 2: lockups / logotypes on white, charcoal, photo.
const photo = '/Users/titus/repos/colognewebsite/assets/img/';
const photos = fs.readdirSync(photo).filter(n => /\.(jpe?g|webp|png)$/i.test(n));
const p3 = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1400, height: 900 } });
const items = [
  ['divide-1', 'logotype.svg', 'logotype-reverse.svg', 'logotype-mono.svg'],
  ['letter-1', 'lockup.svg', 'lockup-reverse.svg', 'lockup-mono.svg'],
  ['table-1', 'lockup.svg', 'lockup-reverse.svg', null],
  ['message-1', 'lockup.svg', 'lockup-reverse.svg', null],
  ['message-2', 'lockup.svg', 'lockup-reverse.svg', null],
];
let h = '';
for (const [id, a, b, c] of items) {
  h += `<div class=r><b>${id}</b>
   <span class=w><img src="${uri(L + id + '/' + a)}"></span>
   <span class=k><img src="${uri(L + id + '/' + b)}"></span>
   ${c ? `<span class=k><img src="${uri(L + id + '/' + c)}"></span>` : ''}</div>`;
}
await p3.setContent(`<style>body{margin:16px;font:13px sans-serif;background:#f2f2f0}
.r{display:flex;gap:16px;align-items:center;margin-bottom:16px}b{width:90px}
.w,.k{padding:18px 24px;display:inline-flex}.w{background:#fafaf8}.k{background:#2d2d2d}
img{height:56px}</style>${h}`);
await p3.waitForTimeout(300);
await p3.screenshot({ path: OUT + 'lockups.png', fullPage: true });
console.log(photos.join(', '));
await browser.close();
