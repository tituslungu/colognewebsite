// Usage: node frames.mjs <svgPath> <outPng> <cols> <scale> <t1,t2,...(seconds)> [engine] [reduced]
// Opens the SVG directly as a page, pauses every animation, seeks to each time,
// screenshots, and composes a labelled contact sheet.
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');

const [svgPath, outPng, colsArg, scaleArg, timesArg, engineArg = 'chromium', reducedArg = ''] = process.argv.slice(2);
const cols = +colsArg, scale = +scaleArg;
const times = timesArg.split(',').map(Number);
const W = 530, H = 655;

const browser = await pw[engineArg].launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: reducedArg ? 'reduce' : 'no-preference' });
const page = await ctx.newPage();
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(150);
const info = await page.evaluate(() => {
  const a = document.getAnimations();
  a.forEach(x => x.pause());
  return { n: a.length, iters: [...new Set(a.map(x => x.effect.getComputedTiming().iterations))], durs: [...new Set(a.map(x => x.effect.getComputedTiming().duration))] };
});
console.error(engineArg, 'animations:', info.n, 'iterations:', info.iters, 'durations:', info.durs);
const shots = [];
for (const t of times) {
  if (!reducedArg) {
    await page.evaluate(ms => document.getAnimations().forEach(x => { x.currentTime = ms; }), t * 1000);
  }
  await page.waitForTimeout(40);
  const buf = await page.screenshot();
  shots.push({ t, src: 'data:image/png;base64,' + buf.toString('base64') });
}
const sheet = await ctx.newPage();
const cw = Math.round(W * scale), ch = Math.round(H * scale);
const rows = Math.ceil(shots.length / cols);
await sheet.setViewportSize({ width: cols * (cw + 6) + 6, height: rows * (ch + 26) + 6 });
await sheet.setContent(`<body style="margin:0;padding:3px;background:#888;font:bold 15px system-ui;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px">` +
  shots.map(s => `<div><div style="height:20px;color:#fff">${s.t.toFixed(2)}s</div><img src="${s.src}" style="width:${cw}px;height:${ch}px;display:block"></div>`).join('') + '</body>');
await sheet.waitForTimeout(100);
await sheet.screenshot({ path: outPng });
await browser.close();
