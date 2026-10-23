// Real-time check of the option E page in one engine: which file <picture>
// picks, that it animates and loops (no-preference), and that it is still
// under reduced motion. Usage: node review-page.mjs <engine>
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const engine = process.argv[2] || 'chromium';
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/loop/review';
const URL = 'file:///Users/titus/repos/colognewebsite/designs/e-loop/index.html?tone=white&footer=charcoal&shot=1';
const b = await pw[engine].launch();
const shots = [];
const dctx = await b.newContext(); const dp = await dctx.newPage();
async function diff(b1, b2) {
  return dp.evaluate(async ([s1, s2]) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [i1, i2] = await Promise.all([load(s1), load(s2)]);
    const g = i => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height).data; };
    const a = g(i1), c = g(i2); let n = 0, s = 0;
    for (let k = 0; k < a.length; k += 4) { const d = Math.max(Math.abs(a[k] - c[k]), Math.abs(a[k + 1] - c[k + 1]), Math.abs(a[k + 2] - c[k + 2])); if (d > 8) n++; s += d; }
    return { changed: n, mean: +(s / (a.length / 4)).toFixed(2) };
  }, [b1.toString('base64'), b2.toString('base64')]);
}
for (const rm of ['no-preference', 'reduce']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 790 }, reducedMotion: rm });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto(URL);
  await p.waitForLoadState('load');
  const src = await p.evaluate(() => document.querySelector('[data-check="anim"]').currentSrc.split('/').pop());
  const el = p.locator('[data-check="anim"]');
  const times = rm === 'reduce' ? [1, 4, 8] : [1, 6, 10.5, 17, 21, 26];
  const got = {};
  for (const t of times) {
    const wait = t * 1000 - (Date.now() - t0);
    if (wait > 0) await p.waitForTimeout(wait);
    got[t] = await el.screenshot();
    shots.push({ label: `${rm} ~${t}s`, s: got[t].toString('base64') });
  }
  if (rm === 'reduce') {
    console.log(engine, rm, 'currentSrc', src, '1s vs 4s', JSON.stringify(await diff(got[1], got[4])), '1s vs 8s', JSON.stringify(await diff(got[1], got[8])));
  } else {
    console.log(engine, rm, 'currentSrc', src, '1s vs 6s', JSON.stringify(await diff(got[1], got[6])), '1s vs 21s (one cycle later)', JSON.stringify(await diff(got[1], got[21])), '6s vs 26s', JSON.stringify(await diff(got[6], got[26])));
  }
  await ctx.close();
}
const sp = await dctx.newPage();
const cw = 200, ch = 247;
await sp.setViewportSize({ width: 9 * (cw + 6) + 6, height: ch + 30 });
await sp.setContent(`<body style="margin:0;padding:3px;background:#888;font:bold 11px system-ui;display:grid;grid-template-columns:repeat(9,${cw}px);gap:6px">` +
  shots.map(s => `<div><div style="height:18px;color:#fff;white-space:nowrap">${s.label}</div><img src="data:image/png;base64,${s.s}" style="width:${cw}px;height:${ch}px;display:block;object-fit:contain"></div>`).join('') + '</body>');
await sp.waitForTimeout(150);
await sp.screenshot({ path: `${OUT}/page-${engine}.png` });
await b.close();
