// Reduced-motion + real-time loop checks. node rm.mjs <engine>
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const engine = process.argv[2];
const DIR = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/loop/';
const SVG = pathToFileURL('/Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg').href;
const EMBED = pathToFileURL(DIR + 'embed.html').href;
const browser = await pw[engine].launch();
async function pix(page) { return (await page.screenshot({ clip: { x: 0, y: 0, width: 530, height: 655 } })); }
function same(a, b) { return Buffer.compare(a, b) === 0; }
const fs = await import('fs');

// 1) reduced motion: direct and embedded, must be static and on the chosen frame
for (const [label, url] of [['direct', SVG], ['img', EMBED]]) {
  const ctx = await browser.newContext({ viewport: { width: 530, height: 655 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(url); await p.waitForTimeout(400);
  const a = await pix(p); await p.waitForTimeout(2500); const b = await pix(p);
  fs.writeFileSync(`${DIR}rm-${engine}-${label}.png`, a);
  console.log(`${engine} reduced-motion ${label}: static over 2.5s = ${same(a, b)}`);
  await ctx.close();
}
// 2) normal motion, embedded via <img>, real time: it must keep looping
{
  const ctx = await browser.newContext({ viewport: { width: 530, height: 655 }, reducedMotion: 'no-preference' });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto(EMBED);
  const marks = [1.0, 2.0, 16.6, 18.5, 21.0, 22.0];
  for (const m of marks) {
    const wait = m * 1000 - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
    const actual = ((Date.now() - t0) / 1000).toFixed(2);
    fs.writeFileSync(`${DIR}rt-${engine}-${m}.png`, await pix(p));
    console.log(`${engine} realtime shot target ${m}s actual ${actual}s`);
  }
  await ctx.close();
}
await browser.close();
