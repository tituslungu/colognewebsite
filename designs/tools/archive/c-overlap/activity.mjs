import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const out = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/c-overlap/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 530, height: 655 } });
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
const frames = [];
for (let t = 0; t <= 17.4; t += 0.3) {
  await p.evaluate(t => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; } }, t);
  frames.push((await p.screenshot()).toString('base64'));
}
// Build an "ever differs from background" map in a canvas page
const q = await b.newPage({ viewport: { width: 530, height: 655 } });
await q.setContent('<canvas id=c width=530 height=655></canvas>');
await q.evaluate(async (frames) => {
  const c = document.getElementById('c'), x = c.getContext('2d');
  const acc = new Uint8ClampedArray(530 * 655);
  for (const f of frames) {
    const im = new Image(); im.src = 'data:image/png;base64,' + f; await im.decode();
    x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, 530, 655).data;
    for (let i = 0; i < acc.length; i++) {
      const r = d[i*4], g = d[i*4+1], bb = d[i*4+2];
      const diff = Math.abs(r - 45) + Math.abs(g - 45) + Math.abs(bb - 45);
      if (diff > 40) acc[i] = Math.min(255, acc[i] + 25);
    }
  }
  const outI = x.createImageData(530, 655);
  for (let i = 0; i < acc.length; i++) { outI.data[i*4] = acc[i]; outI.data[i*4+1] = acc[i]; outI.data[i*4+2] = acc[i]; outI.data[i*4+3] = 255; }
  x.putImageData(outI, 0, 0);
}, frames);
await q.locator('#c').screenshot({ path: out + 'activity.png' });
await b.close();
