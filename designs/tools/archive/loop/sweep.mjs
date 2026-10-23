// Sweep many viewports: clearance between DIVI glyphs / icon and the card,
// overflow, anim height. Usage: node sweep.mjs [slug] [query]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const slug = process.argv[2] || 'e-loop';
const query = process.argv[3] || 'tone=white&footer=charcoal';
const sizes = [];
for (const w of [320, 340, 360, 375, 390, 414, 430, 480, 520, 521, 560, 600, 601, 640, 700, 760, 761, 800, 820, 900, 1024, 1180, 1280, 1366, 1440, 1600, 1920, 2560])
  for (const h of [480, 548, 600, 640, 700, 760, 820, 900, 1000, 1180, 1300, 1440])
    if (h / w < 2.4 && (w >= 700 || h >= 548)) sizes.push([w, h]);
const b = await chromium.launch();
const rows = [];
for (const [w, h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
  await p.waitForTimeout(250);
  const r = await p.evaluate(() => {
    const q = k => document.querySelector(`[data-check="${k}"]`).getBoundingClientRect();
    const wm = document.querySelector('[data-check="wordmark"]');
    // glyph box of the capitals: use a range on the text, then cap-height via canvas metrics
    const cs = getComputedStyle(wm);
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = c.measureText('DIVI');
    const box = q('wordmark');
    // baseline position for line-height:1: top + (lineHeight - (asc+desc))/2 + asc
    const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent, fs = parseFloat(cs.fontSize);
    const baseline = box.top + (fs - (asc + desc)) / 2 + asc;
    const a = q('anim'), ic = q('icon'), se = document.scrollingElement;
    return { anim: Math.round(a.height), gapDivi: Math.round(a.top - baseline), gapIcon: Math.round(a.top - ic.bottom),
      iconOverlapX: a.left < ic.right && a.right > ic.left, over: se.scrollHeight - innerHeight, hscroll: se.scrollWidth - innerWidth };
  });
  rows.push({ w, h, ...r });
  await p.close();
}
await b.close();
for (const r of rows) {
  const flag = (r.gapDivi < 12 ? ' <<DIVI' : '') + (r.iconOverlapX && r.gapIcon < 8 ? ' <<ICON' : '') + (r.over > 1 ? ` scroll=${r.over}` : '') + (r.hscroll > 0 ? ' HSCROLL' : '');
  console.log(`${String(r.w).padStart(4)}x${String(r.h).padEnd(4)} anim=${String(r.anim).padStart(3)} gapDiviBaseline=${String(r.gapDivi).padStart(3)}${flag}`);
}
