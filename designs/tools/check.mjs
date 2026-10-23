// Layout checker for the Divi design options.
// Usage (from the repo root): node designs/tools/check.mjs <slug> [tones|all] [viewport-names|all]
//   e.g. node designs/tools/check.mjs a-stack            (all tones, all viewports)
//        node designs/tools/check.mjs a-stack white ph-390,desk-1440
//        FOOTER=charcoal node designs/tools/check.mjs f-fade white
// Screenshots go to $OUT/shots/<slug>/<tone>__<viewport>.png (OUT: see lib.mjs)
import fs from 'fs';
import path from 'path';
import { DESIGNS, OUT, chromium } from './lib.mjs';

const ROOT = DESIGNS;
const SHOTS = path.join(OUT, 'shots');

// Heights are realistic *visible* viewports (browser chrome subtracted), not screen sizes.
const VIEWPORTS = [
  { name: 'desk-1440', w: 1440, h: 790, fit: true },   // MacBook Air 13", Chrome
  { name: 'desk-1536', w: 1536, h: 750, fit: true },   // common Windows laptop
  { name: 'desk-1920', w: 1920, h: 970, fit: true },   // 1080p monitor
  { name: 'desk-1366', w: 1366, h: 657, fit: true },   // small laptop
  { name: 'desk-1280', w: 1280, h: 690, fit: true },
  { name: 'tab-768', w: 768, h: 950, fit: true, mobile: true },
  { name: 'ph-390', w: 390, h: 664, fit: true, mobile: true },   // iPhone 12-15 Safari, toolbars shown
  { name: 'ph-430', w: 430, h: 740, fit: true, mobile: true },   // iPhone Pro Max Safari
  { name: 'ph-412', w: 412, h: 780, fit: true, mobile: true },   // Pixel, Chrome
  { name: 'ph-375se', w: 375, h: 548, fit: false, mobile: true }, // iPhone SE Safari: a little scroll is OK
  { name: 'ph-360', w: 360, h: 640, fit: false, mobile: true },   // small Android: a little scroll is OK
  { name: 'ph-land', w: 844, h: 340, fit: false, mobile: true },  // landscape phone: scroll OK, must not break
];

// 'replay' is optional (option E removes it); when present it is still overlap-checked via LEAVES.
const REQUIRED = ['hero', 'icon', 'wordmark', 'anim', 'prompt', 'whatsapp', 'imessage',
  'hint', 'footer', 'copyright', 'email', 'tos', 'privacy'];
// Leaf elements that must not overlap each other (replay may sit on the animation).
const LEAVES = ['icon', 'wordmark', 'anim', 'replay', 'prompt', 'whatsapp', 'imessage', 'hint',
  'copyright', 'email', 'tos', 'privacy'];
const ALLOWED_OVERLAP = new Set(['anim|replay', 'replay|anim']);

const [slug, toneArg = 'all', vpArg = 'all'] = process.argv.slice(2);
if (!slug) { console.error('usage: node designs/tools/check.mjs <slug> [tones|all] [viewports|all]'); process.exit(2); }
// FILE=/abs/path.html checks any page (screenshots still go under shots/<slug>/); MAP='{"hero":".hero",...}'
// tags elements with data-check at runtime, for pages that don't carry the attributes themselves.
const file = process.env.FILE ? path.resolve(process.env.FILE) : path.join(ROOT, slug, 'index.html');
const MAP = process.env.MAP ? JSON.parse(process.env.MAP) : null;
if (!fs.existsSync(file)) { console.error('missing ' + file); process.exit(2); }
const tones = toneArg === 'all' ? ['gray', 'white', 'sage'] : toneArg.split(',');
const vps = vpArg === 'all' ? VIEWPORTS : VIEWPORTS.filter(v => vpArg.split(',').includes(v.name));
// FOOTER=charcoal|light selects the footer variant (pages with data-footer-variants).
const FOOTER = process.env.FOOTER || '';
// QS=extra query string (e.g. "buttons=platform&order=imessage-first"); TAG names those screenshots.
const QS = process.env.QS || '';
const TAG = process.env.TAG || '';
const outDir = path.join(SHOTS, slug);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = [];
let failures = 0;

for (const tone of tones) {
  for (const vp of vps) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.mobile ? 2 : 1,
      isMobile: !!vp.mobile && vp.name !== 'tab-768',
      hasTouch: !!vp.mobile,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push('JS error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto('file://' + file + '?tone=' + tone + (FOOTER ? '&footer=' + FOOTER : '') + (QS ? '&' + QS : '') + '&shot=1');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1200);
    if (MAP) await page.evaluate(map => {
      for (const [k, sel] of Object.entries(map)) { const el = document.querySelector(sel); if (el) el.setAttribute('data-check', k); }
    }, MAP);

    const m = await page.evaluate(({ REQUIRED, LEAVES }) => {
      const vis = el => {
        let o = 1;
        for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
          o *= parseFloat(cs.opacity);
        }
        return o;
      };
      const els = {};
      for (const k of REQUIRED) {
        const el = document.querySelector(`[data-check="${k}"]`);
        if (!el) { els[k] = null; continue; }
        const r = el.getBoundingClientRect();
        els[k] = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, w: r.width, h: r.height,
          opacity: vis(el), fontSize: parseFloat(getComputedStyle(el).fontSize) };
      }
      const se = document.scrollingElement;
      return {
        innerW: innerWidth, innerH: innerHeight,
        scrollH: se.scrollHeight, scrollW: se.scrollWidth,
        htmlOverflow: getComputedStyle(document.documentElement).overflowY,
        bodyOverflow: getComputedStyle(document.body).overflowY,
        tone: document.documentElement.dataset.tone,
        els,
      };
    }, { REQUIRED, LEAVES });

    const fails = [...errors], warns = [];
    if (!process.env.FILE && m.tone !== tone) fails.push(`data-tone is "${m.tone}", expected "${tone}"`);
    if (['hidden', 'clip'].includes(m.htmlOverflow) || ['hidden', 'clip'].includes(m.bodyOverflow))
      fails.push('html/body overflow is hidden/clip — fit must be real, not clipped');
    const overflowY = Math.max(0, m.scrollH - m.innerH);
    if (m.scrollW > m.innerW + 1) fails.push(`horizontal overflow ${m.scrollW - m.innerW}px`);
    if (vp.fit && overflowY > 1) fails.push(`vertical overflow ${overflowY}px (must fit)`);
    if (!vp.fit && overflowY > 0) warns.push(`scrolls ${overflowY}px (allowed here)`);

    for (const k of REQUIRED) {
      const e = m.els[k];
      if (!e) { fails.push(`missing [data-check="${k}"]`); continue; }
      if (e.w < 1 || e.h < 1) fails.push(`${k} has zero size`);
      if (e.opacity < 0.9) fails.push(`${k} not fully visible on load (opacity ${e.opacity.toFixed(2)})`);
      if (e.left < -1 || e.right > m.innerW + 1) fails.push(`${k} off-screen horizontally`);
      if (vp.fit && (e.top < -1 || e.bottom > m.innerH + 1)) fails.push(`${k} below the fold`);
    }
    for (let i = 0; i < LEAVES.length; i++) for (let j = i + 1; j < LEAVES.length; j++) {
      const a = m.els[LEAVES[i]], b = m.els[LEAVES[j]];
      if (!a || !b || ALLOWED_OVERLAP.has(LEAVES[i] + '|' + LEAVES[j])) continue;
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 2 && iy > 2) fails.push(`${LEAVES[i]} overlaps ${LEAVES[j]}`);
    }
    const hero = m.els.hero, anim = m.els.anim;
    const heroPct = hero ? Math.round(hero.h / m.innerH * 100) : null;
    if (heroPct !== null && (heroPct < 22 || heroPct > 48) && vp.fit) warns.push(`hero is ${heroPct}% of viewport`);
    if (anim && anim.h < m.innerH * 0.26 && vp.fit) warns.push(`animation only ${Math.round(anim.h)}px tall`);
    for (const k of ['prompt', 'hint', 'copyright', 'email', 'tos', 'privacy'])
      if (m.els[k] && m.els[k].fontSize < 11) warns.push(`${k} font ${m.els[k].fontSize}px`);
    if (vp.mobile) for (const k of ['whatsapp', 'imessage'])
      if (m.els[k] && m.els[k].h < 40) warns.push(`${k} tap target ${Math.round(m.els[k].h)}px tall`);

    const shot = path.join(outDir, `${tone}${FOOTER ? '-footer-' + FOOTER : ''}${TAG ? '-' + TAG : ''}__${vp.name}.png`);
    await page.screenshot({ path: shot, fullPage: overflowY > 0 });
    await ctx.close();

    const status = fails.length ? 'FAIL' : warns.length ? 'WARN' : 'PASS';
    if (fails.length) failures++;
    report.push({ tone, viewport: vp.name, w: vp.w, h: vp.h, status, overflowY, heroPct,
      animH: anim ? Math.round(anim.h) : null, fails, warns, shot });
    console.log(`${status.padEnd(4)} ${tone.padEnd(5)} ${vp.name.padEnd(9)} ${vp.w}x${vp.h}` +
      `  hero=${heroPct}% anim=${anim ? Math.round(anim.h) : '-'}px overflowY=${overflowY}` +
      (fails.length ? `\n      FAIL: ${fails.join('; ')}` : '') +
      (warns.length ? `\n      warn: ${warns.join('; ')}` : ''));
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir, `report${FOOTER ? '-footer-' + FOOTER : ''}${TAG ? '-' + TAG : ''}.json`), JSON.stringify(report, null, 2));
console.log(`\n${failures} failing combos of ${report.length}. Screenshots: ${outDir}/<tone>__<viewport>.png`);
