import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const BASE = process.argv[2];
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/verify/404';
fs.mkdirSync(OUT, { recursive: true });
const body = fs.readFileSync('/Users/titus/repos/colognewebsite/404.html', 'utf8');
const VPS = [['desk-1440', 1440, 790], ['desk-1536', 1536, 750], ['desk-1920', 1920, 970], ['desk-1366', 1366, 657], ['desk-1280', 1280, 690],
  ['tab-768', 768, 950, 1], ['ph-390', 390, 664, 1], ['ph-430', 430, 740, 1], ['ph-412', 412, 780, 1], ['ph-375se', 375, 548, 1], ['ph-360', 360, 640, 1],
  ['ph-land', 844, 340, 1], ['land-390', 844, 390, 1], ['land-568', 568, 320, 1], ['land-740', 740, 360, 1], ['land-932', 932, 430, 1], ['land-520', 540, 300, 1], ['wide-2560', 2560, 1440]];
const b = await chromium.launch();
for (const [name, w, h, mobile] of VPS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: !!mobile && name !== 'tab-768', hasTouch: !!mobile });
  await ctx.route(BASE + '/a/b/c/missing', r => r.fulfill({ status: 404, contentType: 'text/html', body }));
  const p = await ctx.newPage();
  const bad = [];
  p.on('pageerror', e => bad.push('pageerror ' + e.message));
  p.on('requestfailed', r => bad.push('FAILED ' + r.url()));
  p.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/a/b/c/missing')) bad.push(r.status() + ' ' + r.url()); });
  await p.goto(BASE + '/a/b/c/missing'); await p.waitForTimeout(900);
  const m = await p.evaluate(() => {
    const box = s => { const r = document.querySelector(s).getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) }; };
    const k = { wm: box('.wordmark'), code: box('.notfound-code'), text: box('.notfound-text'), btn: box('.notfound .btn'), footer: box('.footer'), hero: box('.hero') };
    const ov = [];
    const names = ['wm', 'code', 'text', 'btn', 'footer'];
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const a = k[names[i]], c = k[names[j]];
      if (Math.min(a.r, c.r) - Math.max(a.l, c.l) > 1 && Math.min(a.b, c.b) - Math.max(a.t, c.t) > 1) ov.push(names[i] + '/' + names[j]); }
    return { over: document.scrollingElement.scrollHeight - innerHeight, hx: document.scrollingElement.scrollWidth - innerWidth, ov, k };
  });
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${m.over > 0 || m.hx > 0 || m.ov.length || bad.length ? 'FAIL' : 'PASS'} ${name.padEnd(10)} ${w}x${h} overY=${m.over} overX=${m.hx} overlaps=${m.ov.join(',') || '-'} wm.b=${m.k.wm.b} code=${m.k.code.l},${m.k.code.t}-${m.k.code.b} text.l=${m.k.text.l} btn=${m.k.btn.l},${m.k.btn.t}-${m.k.btn.b} footer.t=${m.k.footer.t} ${bad.join('; ')}`);
  if (name === 'desk-1440' || name === 'ph-390') {
    await p.hover('.notfound .btn'); await p.waitForTimeout(350);
    const hv = await p.evaluate(() => { const c = getComputedStyle(document.querySelector('.notfound .btn')); return c.backgroundColor + ' ' + c.color; });
    await p.mouse.move(1, 1);
    const tabs = [];
    for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const e = document.activeElement, c = getComputedStyle(e); return e.getAttribute('href') + '[' + c.outlineColor + ']'; })); }
    console.log('    hover=' + hv + ' tabs=' + tabs.join(' '));
  }
  await ctx.close();
}
await b.close();
