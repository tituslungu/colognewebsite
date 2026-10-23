import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const engine = process.argv[2];
const D = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/loop/probe/';
const b = await pw[engine].launch();
for (const rm of ['reduce', 'no-preference']) {
  const ctx = await b.newContext({ viewport: { width: 530, height: 655 }, reducedMotion: rm });
  for (const name of ['picture']) {
    const p = await ctx.newPage(); const t0 = Date.now();
    await p.goto('file://' + D + name + '.html');
    const shots = [];
    for (const m of [0.5, 1.4, 4.6]) { const w = m * 1000 - (Date.now() - t0); if (w > 0) await p.waitForTimeout(w); const f = `${D}${engine}-${rm}-${name}-${m}.png`; fs.writeFileSync(f, await p.screenshot()); shots.push(f); }
    const mq = await p.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    console.log(engine, rm, name, 'page mq matches:', mq, shots.map(s => s.split('/').pop()).join(' '));
    await p.close();
  }
  await ctx.close();
}
await b.close();
