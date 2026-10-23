import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const vp of ['1440x790','1536x750','1920x970','1366x657','1280x690','768x950','390x664','430x740','412x780','375x548','360x640','844x340']) {
  const [w, h] = vp.split('x').map(Number);
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/e-loop/index.html?tone=white&footer=charcoal&shot=1');
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s).getBoundingClientRect();
    const wm = q('[data-check="wordmark"]'), an = q('[data-check="anim"]'), he = q('[data-check="hero"]'), pr = q('[data-check="prompt"]');
    const fs = parseFloat(getComputedStyle(document.querySelector('[data-check="wordmark"]')).fontSize);
    return { lineGap: Math.round(an.top - wm.bottom), glyphGap: Math.round(an.top - (wm.top + 0.87 * fs)), intoBand: Math.round(he.bottom - an.top), cardToPrompt: Math.round(pr.top - an.bottom), animH: Math.round(an.height), animW: Math.round(an.width) };
  });
  console.log(vp, JSON.stringify(r));
  await p.close();
}
await b.close();
