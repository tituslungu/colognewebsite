// Usage: node fmeasure.mjs <slug> [query]
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [slug, query = 'tone=white&footer=charcoal'] = process.argv.slice(2);
const VPS = [['desk-1440',1440,790],['desk-1536',1536,750],['desk-1920',1920,970],['desk-1366',1366,657],['desk-1280',1280,690],['tab-768',768,950],['ph-390',390,664],['ph-430',430,740],['ph-412',412,780],['ph-375se',375,548],['ph-360',360,640],['ph-land',844,340]];
const b = await chromium.launch();
for (const [n, w, h] of VPS) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/${slug}/index.html?${query}&shot=1`);
  await p.waitForTimeout(300);
  const g = await p.evaluate(() => {
    const r = s => document.querySelector(s).getBoundingClientRect();
    const wm = r('[data-check=wordmark]'), hero = r('[data-check=hero]'), a = r('[data-check=anim]'), pr = r('[data-check=prompt]');
    const fs = parseFloat(getComputedStyle(document.querySelector('[data-check=wordmark]')).fontSize);
    // approximate glyph bottom: line box centre + 0.36em
    const glyphBottom = (wm.top + wm.bottom) / 2 + 0.36 * fs;
    return { H: Math.round(hero.height), wmBot: Math.round(glyphBottom), cardTop: Math.round(a.top), cardL: Math.round(a.left), cardR: Math.round(a.right), cardH: Math.round(a.height), prompt: Math.round(pr.top), promptL: Math.round(pr.left), promptR: Math.round(pr.right) };
  });
  console.log(n.padEnd(9), JSON.stringify(g), ` wm/H=${(g.wmBot/g.H).toFixed(2)} card/H=${(g.cardTop/g.H).toFixed(2)} prompt-H=${g.prompt-g.H}`);
  await p.close();
}
await b.close();
