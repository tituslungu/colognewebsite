import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const [t, out] = [Number(process.argv[2]), process.argv[3]];
const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 530, height: 655 } });
const shots = [];
for (const p of ['/Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg', '/Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg']) {
  const pg = await ctx.newPage(); await pg.goto(pathToFileURL(p).href); await pg.waitForTimeout(150);
  await pg.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), t * 1000);
  await pg.waitForTimeout(50);
  shots.push('data:image/png;base64,' + (await pg.screenshot()).toString('base64'));
  // report computed transforms of moving things
  console.log(p.split('/').pop(), JSON.stringify(await pg.evaluate(() => ['hmove','hpress','mp0','mp1','mp2','ring0','qrpop','pg0','pg1'].map(c => { const e = document.querySelector('.' + c); const s = getComputedStyle(e); return c + ':' + s.transform + '|' + s.opacity; }))));
}
const pg = await ctx.newPage();
await pg.setViewportSize({ width: 1600, height: 660 });
await pg.setContent('<body style="margin:0;display:flex"><canvas id=c width=530 height=655></canvas></body>');
await pg.evaluate(async ([a, b]) => {
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
  const [ia, ib] = await Promise.all([load(a), load(b)]);
  const c = document.getElementById('c'), x = c.getContext('2d');
  x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, 530, 655);
  x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, 530, 655);
  const o = x.createImageData(530, 655);
  for (let i = 0; i < da.data.length; i += 4) { const d = Math.max(...[0,1,2].map(k => Math.abs(da.data[i+k] - db.data[i+k]))); const g = da.data[i] * .3; o.data[i] = d > 2 ? 255 : g; o.data[i+1] = d > 2 ? 0 : g; o.data[i+2] = d > 2 ? 0 : g; o.data[i+3] = 255; }
  x.putImageData(o, 0, 0);
}, shots);
await pg.screenshot({ path: out, clip: { x: 0, y: 0, width: 530, height: 655 } });
await browser.close();
