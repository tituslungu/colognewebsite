// Art-direction sketch sheet: node sk.mjs <variants.mjs> <out-name>
// variants module default-exports () => [{ name, def, appR?, blend? }]
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { C, build, fit, paths, stats } from './lib.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const mod = await import(path.resolve(process.argv[2]));
const name = process.argv[3] || 'sk';
const V = mod.default();
const enc = s => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
const cells = [];
for (const v of V) {
  const pcs = build(v.def);
  const st = stats(pcs);
  const fill = r => (r === 'sage' ? C.sage : r === 'sageL' ? C.sageL : r === 'sageD' ? C.sageD : C.char);
  const fillD = r => (r === 'sage' ? C.sage : r === 'sageL' ? C.sageL : r === 'sageD' ? C.sageD : C.off);
  const tfM = fit(pcs, { mode: 'box', R: 104, blend: 0.5 });
  const tfT = fit(pcs, { mode: 'tile', R: v.appR ?? 108, blend: v.blend ?? 0.6 });
  const P = (tf, f) => pcs.map(p => `<path fill="${f(p.role)}" d="${toD(p, tf)}"/>`).join('');
  const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${P(tfM, fill)}</svg>`;
  const mono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${P(tfM, () => '#fff')}</svg>`;
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="${C.char}"/>${P(tfT, fillD)}</svg>`;
  const shares = st.areas.map(a => Math.round((a / st.area) * 100)).join('/');
  cells.push(`<div class="v"><b>${v.name}</b> <i>${shares}</i><div class="r">
    <span class="w"><img src="${enc(mark)}" width="150"></span>
    <span class="ph"><img src="${enc(mono)}" width="64"></span>
    <img src="${enc(tile)}" width="64" style="border-radius:14px">
    <canvas data-src="${enc(tile)}" data-s="40" data-round="1" data-z="3"></canvas>
    <canvas data-src="${enc(tile)}" data-s="16" data-z="4"></canvas>
    <span class="w"><img src="${enc(mark)}" width="22"></span>
  </div></div>`);
}
import { toPath } from './geo.mjs';
function toD(p, tf) { return toPath(p.segs, tf); }
const html = `<!doctype html><html><head><style>body{margin:0;background:#f2f3f1;font:12px Helvetica}.g{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;padding:14px;width:1300px}.v{border:1px solid #ddd;background:#fff;padding:8px}.v i{color:#888}.r{display:flex;gap:10px;align-items:center;margin-top:6px}.w{background:#fafaf8;display:inline-flex}.ph{background:#3b342d;padding:6px;display:inline-flex}canvas{image-rendering:pixelated}</style></head><body><div class="g">${cells.join('')}</div>
<script>
const jobs=[...document.querySelectorAll('canvas')].map(c=>new Promise(res=>{const s=+c.dataset.s,z=+c.dataset.z;const im=new Image();im.onload=()=>{const o=document.createElement('canvas');o.width=o.height=s;const x=o.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,s,s);x.save();if(c.dataset.round){x.beginPath();x.arc(s/2,s/2,s/2,0,7);x.clip();}else{x.beginPath();x.roundRect(0,0,s,s,s*.2);x.clip();}x.drawImage(im,0,0,s,s);x.restore();c.width=c.height=s*z;const y=c.getContext('2d');y.imageSmoothingEnabled=false;y.drawImage(o,0,0,s*z,s*z);res();};im.src=c.dataset.src;}));
Promise.all(jobs).then(()=>document.body.dataset.done=1);
</script></body></html>`;
fs.writeFileSync(path.join(here, name + '.html'), html);
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1330, height: 600 }, deviceScaleFactor: 1 });
await pg.goto('file://' + path.join(here, name + '.html'));
await pg.waitForSelector('body[data-done]');
await pg.screenshot({ path: path.join(here, name + '.png'), fullPage: true });
await b.close();
console.log('ok', path.join(here, name + '.png'));
