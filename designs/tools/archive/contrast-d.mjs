// Samples the real rendered background behind each small-text element (text hidden)
// and reports the worst-case contrast ratio against the element's text colour.
// Usage: node contrast-d.mjs <slug> [tones] [WxH,...]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');

const [slug, toneArg = 'gray,white,sage', vpArg = '1440x790,1366x657,768x950,390x664,375x548,360x640'] = process.argv.slice(2);
const file = `/Users/titus/repos/colognewebsite/designs/${slug}/index.html`;
const KEYS = ['prompt', 'hint', 'copyright', 'email', 'tos', 'privacy', 'replay', 'imessage'];

const browser = await chromium.launch();
for (const tone of toneArg.split(',')) {
  for (const vp of vpArg.split(',')) {
    const [w, h] = vp.split('x').map(Number);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(`file://${file}?tone=${tone}&shot=1`);
    await page.waitForLoadState('load');
    await page.waitForTimeout(600);
    const info = await page.evaluate((KEYS) => {
      const out = {};
      for (const k of KEYS) {
        const el = document.querySelector(`[data-check="${k}"]`);
        if (!el) continue;
        // for buttons/links measure the visible text node box
        const r = el.getBoundingClientRect();
        out[k] = { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, color: getComputedStyle(el).color };
      }
      return out;
    }, KEYS);
    await page.addStyleTag({ content: '*{color:transparent!important;text-shadow:none!important} svg{opacity:0!important} .cta-imessage{border-color:transparent!important}' });
    await page.waitForTimeout(100);
    const full = await page.screenshot({ fullPage: true });
    const res = await page.evaluate(async ({ b64, info }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      const L = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);
      const out = {};
      for (const [k, e] of Object.entries(info)) {
        const m = e.color.match(/\d+(\.\d+)?/g).map(Number);
        const Lt = L(m[0], m[1], m[2]);
        const x = Math.max(0, Math.round(e.x)), y = Math.max(0, Math.round(e.y));
        const ww = Math.min(c.width - x, Math.round(e.w)), hh = Math.min(c.height - y, Math.round(e.h));
        if (ww < 1 || hh < 1) continue;
        const d = g.getImageData(x, y, ww, hh).data;
        let worst = Infinity, minL = 1, maxL = 0;
        for (let i = 0; i < d.length; i += 4) {
          const Lb = L(d[i], d[i + 1], d[i + 2]);
          minL = Math.min(minL, Lb); maxL = Math.max(maxL, Lb);
          const cr = (Math.max(Lt, Lb) + 0.05) / (Math.min(Lt, Lb) + 0.05);
          worst = Math.min(worst, cr);
        }
        out[k] = { worst: worst.toFixed(2), color: e.color };
      }
      return out;
    }, { b64: full.toString('base64'), info });
    const line = Object.entries(res).map(([k, v]) => `${k}=${v.worst}${Number(v.worst) < 4.5 ? '(!)' : ''}`).join(' ');
    console.log(`${tone.padEnd(5)} ${vp.padEnd(9)} ${line}`);
    await ctx.close();
  }
}
await browser.close();
