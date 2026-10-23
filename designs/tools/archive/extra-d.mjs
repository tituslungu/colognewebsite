import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/crops';
const vps = (process.argv[2]||'320x568,540x900,600x960,1024x768,2560x1300,1280x600').split(',');
const tone = process.argv[3]||'gray';
const b = await chromium.launch();
for (const vp of vps) {
  const [w,h]=vp.split('x').map(Number);
  const ctx = await b.newContext({viewport:{width:w,height:h}, isMobile:w<700, hasTouch:w<700});
  const p = await ctx.newPage();
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/d-bleed/index.html?tone=${tone}&shot=1`);
  await p.waitForTimeout(500);
  const m = await p.evaluate(()=>{const se=document.scrollingElement; const a=document.getElementById('anim').getBoundingClientRect(); const r=document.querySelector('.replay').getBoundingClientRect(); return {sw:se.scrollWidth, sh:se.scrollHeight, iw:innerWidth, ih:innerHeight, animH:Math.round(a.height), replayRight:Math.round(r.right)}});
  console.log(vp, JSON.stringify(m));
  await p.screenshot({path:`${OUT}/extra-${tone}-${vp}.png`, fullPage:true});
  await ctx.close();
}
await b.close();
