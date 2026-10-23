// Independent parity check: production index.html vs designs/f-fade (white, charcoal footer, defaults).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');

const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/verify';
fs.mkdirSync(OUT, { recursive: true });
const F = 'file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=white&footer=charcoal&shot=1';
const P = 'file:///Users/titus/repos/colognewebsite/index.html';
const VPS = [
  ['desk-1440', 1440, 790], ['desk-1536', 1536, 750], ['desk-1920', 1920, 970], ['desk-1366', 1366, 657],
  ['desk-1280', 1280, 690], ['tab-768', 768, 950, 1], ['ph-390', 390, 664, 1], ['ph-430', 430, 740, 1],
  ['ph-412', 412, 780, 1], ['ph-375se', 375, 548, 1], ['ph-360', 360, 640, 1], ['ph-land', 844, 340, 1],
];
const SEL = {
  backdrop: '.backdrop', photo: '.photo-sharp > div', tint: '.tint', scrim: '.scrim',
  hero: '.hero', mark: '.mark', icon: '.mark img', wordmark: '.wordmark', stage: '.stage', card: '.card', anim: '.card img',
  cta: '.cta', prompt: '.prompt', actions: '.actions', btn1: '.actions .btn:nth-child(1)', btn2: '.actions .btn:nth-of-type(2)',
  imessage: '.btn-imessage', whatsapp: '.btn-whatsapp', hint: '.hint',
  footer: '.footer', copyright: '.copyright', email: '.footer a[href^="mailto:"]', tos: '.footer a[href="/tos"]', privacy: '.footer a[href="/privacy"]',
};
const PROPS = ['color', 'backgroundColor', 'backgroundImage', 'borderTopColor', 'borderTopWidth', 'borderTopLeftRadius', 'fontSize', 'fontWeight',
  'letterSpacing', 'lineHeight', 'boxShadow', 'fontFamily', 'opacity', 'textTransform', 'textShadow', 'filter', 'maskImage', 'transform', 'display', 'paddingLeft', 'gap'];

async function measure(page) {
  return page.evaluate(({ SEL, PROPS }) => {
    const o = {};
    for (const [k, s] of Object.entries(SEL)) {
      const e = document.querySelector(s);
      if (!e) { o[k] = null; continue; }
      const r = e.getBoundingClientRect(), c = getComputedStyle(e);
      o[k] = { box: [r.left, r.top, r.width, r.height].map(v => Math.round(v * 100) / 100), st: Object.fromEntries(PROPS.map(p => [p, c[p]])),
        text: e.innerText?.replace(/\s+/g, ' ').trim().slice(0, 80) };
    }
    o._order = [...document.querySelectorAll('.actions .btn')].map(b => b.className);
    o._visual = [...document.querySelectorAll('.actions .btn')].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left || a.getBoundingClientRect().top - b.getBoundingClientRect().top).map(b => b.className);
    o._scroll = [document.scrollingElement.scrollWidth, document.scrollingElement.scrollHeight, innerWidth, innerHeight];
    o._names = [...document.querySelectorAll('.actions .btn')].map(b => b.textContent.replace(/\s+/g, ' ').trim());
    o._visibleText = [...document.querySelectorAll('.actions .btn')].map(b => b.innerText.replace(/\s+/g, ' ').trim());
    return o;
  }, { SEL, PROPS });
}

async function states(page) {
  const st = sel => page.evaluate(s => { const e = document.querySelector(s), c = getComputedStyle(e);
    return { bg: c.backgroundColor, line: c.borderTopColor, ink: c.color, outline: `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor} off=${c.outlineOffset}` }; }, sel);
  const r = {};
  for (const k of ['imessage', 'whatsapp']) {
    await page.hover(SEL[k]); await page.waitForTimeout(400);
    r[k + ':hover'] = await st(SEL[k]);
    await page.mouse.move(1, 1); await page.waitForTimeout(400);
  }
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  const tabs = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab'); await page.waitForTimeout(250);
    const d = await page.evaluate(() => { const e = document.activeElement, c = getComputedStyle(e);
      return { el: e.tagName + '.' + e.className + ' ' + (e.getAttribute('href') || ''), fv: e.matches(':focus-visible'),
        outline: `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor} off=${c.outlineOffset}`, bg: c.backgroundColor, ink: c.color }; });
    tabs.push(d);
  }
  r.tabs = tabs;
  return r;
}

async function diff(page, a, b) {
  return page.evaluate(async ({ a, b }) => {
    const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { sizeMismatch: [ia.width, ia.height, ib.width, ib.height] };
    const cv = n => { const c = document.createElement('canvas'); c.width = n.width; c.height = n.height; const x = c.getContext('2d'); x.drawImage(n, 0, 0); return x.getImageData(0, 0, n.width, n.height).data; };
    const da = cv(ia), db = cv(ib);
    let n = 0, max = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
      if (d > 2) { n++; max = Math.max(max, d); const p = i / 4, x = p % ia.width, y = (p / ia.width) | 0; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
    return { n, max, bbox: n ? [x0, y0, x1, y1] : null, w: ia.width, h: ia.height };
  }, { a: a.toString('base64'), b: b.toString('base64') });
}

const browser = await chromium.launch();
const scratch = await browser.newPage();
let problems = 0;
for (const [name, w, h, mobile] of VPS) {
  const res = {};
  const shots = {};
  for (const [tag, url] of [['F', F], ['P', P]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1,
      isMobile: !!mobile && name !== 'tab-768', hasTouch: !!mobile, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
    page.on('requestfailed', r => errs.push('reqfail ' + r.url()));
    await page.goto(url); await page.waitForLoadState('load'); await page.waitForTimeout(1200);
    res[tag] = await measure(page);
    shots[tag] = await page.screenshot();
    if (!mobile || name === 'ph-390') res[tag].states = await states(page);
    res[tag].errs = errs;
    await ctx.close();
  }
  const issues = [];
  for (const k of Object.keys(SEL)) {
    const a = res.F[k], b = res.P[k];
    if (!a || !b) { if (a || b) issues.push(`${k}: present F=${!!a} P=${!!b}`); continue; }
    const bd = a.box.map((v, i) => Math.abs(v - b.box[i]));
    if (Math.max(...bd) > 1) issues.push(`${k}: box F=${a.box} P=${b.box}`);
    for (const p of PROPS) if (a.st[p] !== b.st[p]) {
      let av = a.st[p], bv = b.st[p];
      if (p === 'backgroundImage') { av = av.replace(/url\("[^"]*\/([^/"]+)"\)/g, 'url($1)'); bv = bv.replace(/url\("[^"]*\/([^/"]+)"\)/g, 'url($1)'); }
      if (av !== bv) issues.push(`${k}.${p}: F=${a.st[p].slice(0, 120)} P=${b.st[p].slice(0, 120)}`);
    }
    if (a.text !== b.text) issues.push(`${k}.text: F="${a.text}" P="${b.text}"`);
  }
  for (const k of ['_order', '_visual', '_scroll', '_names', '_visibleText']) if (JSON.stringify(res.F[k]) !== JSON.stringify(res.P[k])) issues.push(`${k}: F=${JSON.stringify(res.F[k])} P=${JSON.stringify(res.P[k])}`);
  if (res.F.states) {
    const a = res.F.states, b = res.P.states;
    for (const k of ['imessage:hover', 'whatsapp:hover']) if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) issues.push(`${k}: F=${JSON.stringify(a[k])} P=${JSON.stringify(b[k])}`);
    for (let i = 0; i < 6; i++) {
      const x = a.tabs[i], y = b.tabs[i];
      if (x.outline !== y.outline || x.bg !== y.bg || x.ink !== y.ink || x.fv !== y.fv) issues.push(`tab${i}: F=${JSON.stringify(x)} P=${JSON.stringify(y)}`);
    }
  }
  const d = await diff(scratch, shots.F, shots.P);
  fs.writeFileSync(`${OUT}/F__${name}.png`, shots.F); fs.writeFileSync(`${OUT}/P__${name}.png`, shots.P);
  const errs = [...res.F.errs.map(e => 'F ' + e), ...res.P.errs.map(e => 'P ' + e)];
  if (issues.length) problems++;
  console.log(`${issues.length ? 'DIFF' : 'SAME'} ${name.padEnd(9)} ${w}x${h} pixdiff=${JSON.stringify(d)} order=${res.P._visual.join('|')} labels=${JSON.stringify(res.P._visibleText)}`
    + (errs.length ? '\n   errors: ' + errs.join('; ') : '')
    + (issues.length ? '\n   ' + issues.join('\n   ') : ''));
  if (name === 'desk-1440' || name === 'ph-390') console.log('   P states:', JSON.stringify(res.P.states, null, 0));
}
await browser.close();
console.log(`\n${problems} viewports with differences`);
