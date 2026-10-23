import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const out = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/c-overlap/';
const b = await chromium.launch();
const sizes = [[320,568],[900,700],[1024,768],[1024,1366],[820,1180],[1100,1000],[2560,1300],[1180,820],[600,900],[540,800],[1440,900],[1680,1000]];
for (const [w,h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/c-overlap/index.html?tone=gray&shot=1');
  await p.waitForTimeout(400);
  const m = await p.evaluate(() => {
    const r = s => document.querySelector(s).getBoundingClientRect();
    const se = document.scrollingElement;
    return { sh: se.scrollHeight, sw: se.scrollWidth, hero: Math.round(r('[data-check=hero]').height), anim: Math.round(r('[data-check=anim]').height), animW: Math.round(r('[data-check=anim]').width) };
  });
  if (w === 1024 && h === 768) {
    await p.click('#replay');
    await p.waitForTimeout(300);
    m.src = await p.evaluate(() => document.getElementById('anim').src.split('/').pop());
  }
  console.log(`${w}x${h} overflowY=${m.sh-h} overflowX=${m.sw-w} hero=${m.hero} anim=${m.animW}x${m.anim}`, m.src||'', errs.join(';'));
  await p.screenshot({ path: out + `probe_${w}x${h}.png`, fullPage: true });
  await p.close();
}
await b.close();
