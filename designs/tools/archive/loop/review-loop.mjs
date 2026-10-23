// Independent review of divi-loop.svg: timing audit, seam diff, wrap step sizes,
// second-cycle equality, story-vs-original spot checks, and contact sheets.
// Usage: node review-loop.mjs <engine>
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');

const engine = process.argv[2] || 'chromium';
const LOOP = '/Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg';
const ORIG = '/Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg';
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/loop/review';
fs.mkdirSync(OUT, { recursive: true });
const W = 530, H = 655;

const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H } });

async function openSvg(p) {
  const page = await ctx.newPage();
  await page.goto('file://' + p);
  await page.waitForTimeout(200);
  await page.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  return page;
}
async function at(page, t) {
  await page.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), t * 1000);
  await page.waitForTimeout(30);
  return await page.screenshot();
}

// Diff helper page: decodes two PNGs on a canvas and compares.
const dp = await ctx.newPage();
await dp.setContent('<canvas id=a></canvas><canvas id=b></canvas>');
async function diff(b1, b2) {
  return await dp.evaluate(async ([s1, s2]) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [i1, i2] = await Promise.all([load(s1), load(s2)]);
    const get = (img, id) => { const c = document.getElementById(id); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0); return x.getImageData(0, 0, img.width, img.height).data; };
    const d1 = get(i1, 'a'), d2 = get(i2, 'b');
    let n = 0, max = 0, sum = 0;
    for (let i = 0; i < d1.length; i += 4) {
      const d = Math.max(Math.abs(d1[i] - d2[i]), Math.abs(d1[i + 1] - d2[i + 1]), Math.abs(d1[i + 2] - d2[i + 2]));
      if (d > 0) n++; if (d > max) max = d; sum += d;
    }
    return { n, max, mean: +(sum / (d1.length / 4)).toFixed(3) };
  }, [b1.toString('base64'), b2.toString('base64')]);
}

const loop = await openSvg(LOOP);
const audit = await loop.evaluate(() => {
  const a = document.getAnimations();
  const t = a.map(x => x.effect.getComputedTiming());
  const uniq = k => [...new Set(t.map(z => String(z[k])))];
  return { count: a.length, iterations: uniq('iterations'), duration: uniq('duration'), delay: uniq('delay'),
    endDelay: uniq('endDelay'), direction: uniq('direction'), fill: uniq('fill'), iterationStart: uniq('iterationStart'),
    playbackRate: [...new Set(a.map(x => x.playbackRate))], names: a.map(x => x.animationName) };
});
const log = [];
const P = (...s) => { const l = s.join(' '); log.push(l); console.log(l); };
P(engine, 'animations', audit.count, 'iterations', audit.iterations, 'duration', audit.duration, 'delay', audit.delay,
  'endDelay', audit.endDelay, 'direction', audit.direction, 'fill', audit.fill, 'iterStart', audit.iterationStart, 'rate', audit.playbackRate);

// Seam
const f0 = await at(loop, 0), f20 = await at(loop, 20), f19999 = await at(loop, 19.999), f40 = await at(loop, 40);
P('seam 19.999 vs 0', JSON.stringify(await diff(f19999, f0)));
P('seam 20.000 vs 0', JSON.stringify(await diff(f20, f0)));
P('seam 40.000 vs 0', JSON.stringify(await diff(f40, f0)));

// Step sizes across the whole cycle at 50ms (a pop shows up as an outlier step).
let prev = await at(loop, 0), steps = [];
for (let t = 0.05; t <= 20.0001; t += 0.05) {
  const cur = await at(loop, +t.toFixed(3));
  const d = await diff(prev, cur);
  steps.push({ t: +t.toFixed(2), ...d });
  prev = cur;
}
const top = [...steps].sort((a, b) => b.mean - a.mean).slice(0, 12);
P('largest 50ms steps (whole cycle):', top.map(s => `${s.t}s mean=${s.mean} max=${s.max}`).join(' | '));
P('steps 18.6-20.0:', steps.filter(s => s.t >= 18.6).map(s => `${s.t}:${s.mean}`).join(' '));
P('steps 0-0.5 (cycle 2 start after wrap is same as 20.x):', steps.filter(s => s.t <= 0.5).map(s => `${s.t}:${s.mean}`).join(' '));

// Second cycle equality
let worst = { n: 0 };
for (let t = 0; t < 20; t += 0.7) {
  const a = await at(loop, t), b = await at(loop, t + 20);
  const d = await diff(a, b); if (d.n > worst.n) worst = { t: +t.toFixed(2), ...d };
}
P('cycle1 vs cycle2 worst', JSON.stringify(worst));

// Story vs original (0-17.4s) and hold vs original final frame
const orig = await openSvg(ORIG);
let worstS = { n: 0 };
for (let t = 0; t <= 17.4; t += 0.6) {
  const d = await diff(await at(loop, t), await at(orig, t));
  if (d.n > worstS.n) worstS = { t: +t.toFixed(2), ...d };
}
P('story vs original worst (0-17.4 every 0.6s)', JSON.stringify(worstS));
const origEnd = await at(orig, 17.4);
for (const t of [17.4, 18.0, 18.9]) P(`hold ${t}s vs original end`, JSON.stringify(await diff(await at(loop, t), origEnd)));

// Contact sheets
async function sheet(name, times, page, scale = 0.32, cols = 8) {
  const shots = [];
  for (const t of times) shots.push({ t, s: (await at(page, t)).toString('base64') });
  const sp = await ctx.newPage();
  const cw = Math.round(W * scale), ch = Math.round(H * scale);
  await sp.setViewportSize({ width: cols * (cw + 6) + 6, height: Math.ceil(shots.length / cols) * (ch + 24) + 6 });
  await sp.setContent(`<body style="margin:0;padding:3px;background:#888;font:bold 13px system-ui;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:6px">` +
    shots.map(s => `<div><div style="height:18px;color:#fff">${s.t.toFixed(2)}s</div><img src="data:image/png;base64,${s.s}" style="width:${cw}px;height:${ch}px;display:block"></div>`).join('') + '</body>');
  await sp.waitForTimeout(150);
  await sp.screenshot({ path: `${OUT}/${engine}-${name}.png` });
  await sp.close();
}
if (engine === 'chromium') {
  await sheet('wrap', [18.6, 18.8, 19.0, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.999, 20.0, 20.3, 20.6], loop, 0.36, 8);
  await sheet('cycle2', [20, 21.5, 23, 24.5, 26, 27.5, 29, 30.55, 32, 33.5, 35, 36.5, 37.4, 38.5, 39.3, 40], loop, 0.3, 8);
  await sheet('hold', [16.0, 16.6, 17.0, 17.4, 17.8, 18.2, 18.6, 19.0], loop, 0.36, 8);
}
fs.writeFileSync(`${OUT}/${engine}-log.txt`, log.join('\n') + '\n' + JSON.stringify(steps));
await browser.close();
