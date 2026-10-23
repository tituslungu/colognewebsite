import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const BASE = process.argv[2];
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/verify';
const page404 = fs.readFileSync('/Users/titus/repos/colognewebsite/404.html', 'utf8');
const b = await chromium.launch();
async function run(path, opts = {}, fn) {
  const ctx = await b.newContext({ viewport: opts.vp || { width: 1440, height: 790 }, reducedMotion: opts.rm || 'no-preference',
    deviceScaleFactor: opts.mobile ? 2 : 1, isMobile: !!opts.mobile, hasTouch: !!opts.mobile });
  if (opts.deep) await ctx.route(BASE + path, r => r.fulfill({ status: 404, contentType: 'text/html', body: page404 }));
  const p = await ctx.newPage();
  const log = { errs: [], reqs: [], bad: [] };
  p.on('pageerror', e => log.errs.push('pageerror ' + e.message));
  p.on('console', m => { if (m.type() === 'error') log.errs.push('console ' + m.text()); });
  p.on('requestfailed', r => log.bad.push('FAILED ' + r.url() + ' ' + r.failure()?.errorText));
  p.on('response', r => { log.reqs.push(r.status() + ' ' + r.url().replace(BASE, '')); if (r.status() >= 400 && !(opts.deep && r.url() === BASE + path)) log.bad.push(r.status() + ' ' + r.url()); });
  let resp;
  try { resp = await p.goto(BASE + path, { waitUntil: 'load' }); } catch (e) { log.errs.push('goto ' + e.message.split('\n')[0]); }
  await p.waitForTimeout(1500);
  const extra = fn ? await fn(p) : null;
  console.log(`== ${path} ${JSON.stringify(opts.vp || '')} rm=${opts.rm || '-'} final=${p.url().replace(BASE, '')}`);
  console.log('   requests: ' + [...new Set(log.reqs)].join(', '));
  console.log('   errors: ' + (log.errs.join('; ') || 'none') + ' | bad: ' + (log.bad.join('; ') || 'none'));
  if (extra) console.log('   ' + JSON.stringify(extra));
  await ctx.close();
}
const fav = p => p.evaluate(async () => {
  const out = {};
  for (const l of document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="preload"], link[rel="stylesheet"]')) {
    const r = await fetch(l.href); out[l.getAttribute('href')] = r.status + ' ' + r.headers.get('content-type');
  }
  return out;
});
await run('/', {}, async p => ({ fav: await fav(p), img: await p.evaluate(() => document.querySelector('.card img').currentSrc),
  links: await p.evaluate(() => [...document.querySelectorAll('a')].map(a => `${a.getAttribute('href')} target=${a.getAttribute('target')} rel=${a.getAttribute('rel')} aria=${a.getAttribute('aria-label')}`)),
  footer: await p.evaluate(() => document.querySelector('.footer').innerText.replace(/\s+/g, ' ')),
  scroll: await p.evaluate(() => [document.scrollingElement.scrollHeight, innerHeight]) }));
await run('/', { rm: 'reduce' }, async p => ({ img: await p.evaluate(() => document.querySelector('.card img').currentSrc) }));
await run('/', { rm: 'reduce', vp: { width: 390, height: 664 }, mobile: true }, async p => ({ img: await p.evaluate(() => document.querySelector('.card img').currentSrc) }));
// Icon link goes home
await run('/', {}, async p => { await p.click('.mark'); await p.waitForLoadState('load'); return { afterIconClick: p.url() }; });
await run('/tos/', {}, async p => ({ landed: p.url() }));
await run('/privacy/', {}, async p => ({ landed: p.url() }));
await run('/tos', {}, async p => ({ landed: p.url() }));
await run('/privacy', {}, async p => ({ landed: p.url() }));
for (const [vp, mobile, tag] of [[{ width: 1440, height: 790 }, false, 'desk'], [{ width: 390, height: 664 }, true, 'phone'], [{ width: 375, height: 548 }, true, 'se'], [{ width: 844, height: 340 }, true, 'land'], [{ width: 768, height: 950 }, false, 'tab'], [{ width: 1920, height: 970 }, false, '1920'], [{ width: 1366, height: 657 }, false, '1366']]) {
  for (const path of ['/404.html', '/some/deep/path/missing']) {
    await run(path, { vp, mobile, deep: path !== '/404.html' }, async p => {
      const shot = `${OUT}/404-${tag}${path === '/404.html' ? '' : '-deep'}.png`;
      await p.screenshot({ path: shot });
      return await p.evaluate(() => {
        const box = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
        return { scroll: [document.scrollingElement.scrollWidth, document.scrollingElement.scrollHeight, innerWidth, innerHeight],
          code: box('.notfound-code'), text: box('.notfound-text'), btn: box('.notfound .btn'), footer: box('.footer'), wm: box('.wordmark'), icon: box('.mark img'),
          footerBg: getComputedStyle(document.querySelector('.footer')).backgroundColor,
          photo: getComputedStyle(document.querySelector('.photo-sharp > div')).backgroundImage,
          iconLoaded: document.querySelector('.mark img').naturalWidth };
      });
    });
  }
}
await b.close();
