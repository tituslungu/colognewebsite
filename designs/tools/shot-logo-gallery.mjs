// Screenshots designs/logos/index.html (laptop, light / phone, dark); reports horizontal overflow and broken images.
// Usage (from the repo root): node designs/tools/shot-logo-gallery.mjs [out-dir]
// Writes <out-dir>/logo-gallery-{desk,phone}.png; out-dir defaults to $OUT (see lib.mjs).
import { DESIGNS, OUT, chromium } from './lib.mjs';
const dir = process.argv[2] || OUT;
const b = await chromium.launch();
for (const [w, h, name, scheme] of [[1280, 1400, 'desk', 'light'], [390, 1500, 'phone', 'dark']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
  await p.goto('file://' + DESIGNS + '/logos/index.html');
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({ sw: document.scrollingElement.scrollWidth - innerWidth,
    broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')) }));
  console.log(name, 'horizontal overflow', r.sw, 'broken images', JSON.stringify(r.broken));
  await p.screenshot({ path: dir + '/logo-gallery-' + name + '.png' });
}
await b.close();
