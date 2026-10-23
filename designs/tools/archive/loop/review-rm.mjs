import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
for (const eng of ['chromium','webkit','firefox']) {
  const b = await pw[eng].launch();
  const ctx = await b.newContext({ viewport: { width: 530, height: 655 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg');
  await p.waitForTimeout(500);
  const s1 = await p.screenshot(); await p.waitForTimeout(2500); const s2 = await p.screenshot();
  const st = await p.evaluate(() => { const a = document.getAnimations(); return { n: a.length, states: [...new Set(a.map(x => x.playState))], t: [...new Set(a.map(x => Math.round(x.currentTime)))] }; });
  const q = await ctx.newPage(); await q.goto('file:///Users/titus/repos/colognewebsite/designs/e-loop/divi-still.svg'); await q.waitForTimeout(500); const s3 = await q.screenshot();
  console.log(eng, 'loop direct under reduce:', JSON.stringify(st), 'static:', s1.equals(s2), 'same as still file:', s1.equals(s3));
  await b.close();
}
