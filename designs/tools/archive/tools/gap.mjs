import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const VPS = [[1440,790],[1536,750],[1920,970],[1366,657],[1280,690],[768,950],[390,664],[430,740],[412,780],[375,548],[360,640],[844,340]];
const b = await chromium.launch();
for (const slug of ['c-overlap', 'd-bleed']) {
  const row = [];
  for (const [w, h] of VPS) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?tone=white&footer=charcoal&shot=1`);
    await p.waitForTimeout(400);
    const g = await p.evaluate(() => {
      const hint = document.querySelector('[data-check=hint]').getBoundingClientRect();
      const card = document.querySelector('[data-check=anim]').getBoundingClientRect();
      const f = document.querySelector('[data-check=footer]').getBoundingClientRect();
      return { hint: Math.round(f.top - hint.bottom), card: Math.round(f.top - card.bottom) };
    });
    row.push(`${w}x${h}: hint→band ${g.hint}px, card→band ${g.card}px`);
    await p.close();
  }
  console.log('== ' + slug + '\n  ' + row.join('\n  '));
}
await b.close();
