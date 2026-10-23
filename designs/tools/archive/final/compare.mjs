import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:8765';
const PROD = BASE + '/index.html';
const REF = BASE + '/designs/f-fade/index.html?tone=white&footer=charcoal&shot=1';
const SIZES = [[1440, 790], [1366, 657], [768, 950], [390, 664], [375, 548]];

const SEL = {
  hero: '.hero', mark: '.mark img', wordmark: '.wordmark', stage: '.stage', card: '.card',
  prompt: '.prompt', btn1: '.actions .btn:nth-child(1)', btn2: '.actions .btn:nth-child(2)',
  hint: '.hint', footer: '.footer', copyright: '.copyright', email: '.footer a[href^="mailto"]',
  tos: '.footer a[href="/tos"]', privacy: '.footer a[href="/privacy"]',
};

async function grab(b, url, w, h, reduced) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('requestfailed', r => errs.push('FAILED ' + r.url()));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  const info = await p.evaluate((SEL) => {
    const out = {};
    for (const [k, s] of Object.entries(SEL)) {
      const el = document.querySelector(s);
      if (!el) { out[k] = null; continue; }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[k] = [r.x, r.y, r.width, r.height].map(v => Math.round(v * 100) / 100).join(',') +
        ' ' + cs.color + ' ' + cs.backgroundColor + ' ' + cs.borderTopColor + ' ' + cs.fontSize;
    }
    out.btnOrder = [...document.querySelectorAll('.actions .btn')].map(x => x.className + '|' + x.innerText.trim() + '|' + x.textContent.replace(/\s+/g, ' ').trim()).join(' ; ');
    out.scroll = document.documentElement.scrollHeight + 'x' + document.documentElement.scrollWidth;
    out.anim = document.querySelector('.card img')?.currentSrc.split('/').pop();
    return out;
  }, SEL);
  const buf = await p.screenshot();
  await ctx.close();
  return { info, buf, errs };
}

async function diff(b, a, c, w, h) {
  const p = await b.newPage({ viewport: { width: 200, height: 200 } });
  const r = await p.evaluate(async ([a, c, w, h]) => {
    const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; });
    const [ia, ic] = await Promise.all([load(a), load(c)]);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const x = cv.getContext('2d');
    x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, w, h).data;
    x.clearRect(0, 0, w, h); x.drawImage(ic, 0, 0); const dc = x.getImageData(0, 0, w, h).data;
    let n = 0, max = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i] - dc[i]), Math.abs(da[i + 1] - dc[i + 1]), Math.abs(da[i + 2] - dc[i + 2]));
      if (d > 0) {
        n++; max = Math.max(max, d);
        const px = (i / 4) % w, py = Math.floor(i / 4 / w);
        x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py);
      }
    }
    return { n, max, box: n ? [x0, y0, x1, y1] : null };
  }, ['data:image/png;base64,' + a.toString('base64'), 'data:image/png;base64,' + c.toString('base64'), w, h]);
  await p.close();
  return r;
}

const b = await chromium.launch();
for (const [w, h] of SIZES) {
  for (const reduced of [false, true]) {
    const prod = await grab(b, PROD, w, h, reduced);
    const ref = await grab(b, REF, w, h, reduced);
    const tag = `${w}x${h}${reduced ? '-still' : ''}`;
    fs.writeFileSync(`${OUT}/prod-${tag}.png`, prod.buf);
    fs.writeFileSync(`${OUT}/ref-${tag}.png`, ref.buf);
    const d = await diff(b, prod.buf, ref.buf, w, h);
    const mism = Object.keys(prod.info).filter(k => prod.info[k] !== ref.info[k]);
    console.log(`${tag}: pixels differing=${d.n} max=${d.max} box=${JSON.stringify(d.box)} | geometry mismatches=${mism.length ? mism.join(',') : 'none'} | anim=${prod.info.anim}/${ref.info.anim} | scroll=${prod.info.scroll}/${ref.info.scroll} | errs prod=${JSON.stringify(prod.errs)} ref=${ref.errs.length}`);
    for (const k of mism) console.log(`   ${k}\n     prod: ${prod.info[k]}\n     ref:  ${ref.info[k]}`);
    if (!reduced && w === 1440) console.log('   buttons:', prod.info.btnOrder);
    if (!reduced && w === 390) console.log('   buttons:', prod.info.btnOrder);
  }
}
await b.close();
