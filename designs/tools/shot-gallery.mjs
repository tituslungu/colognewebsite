// Screenshots designs/index.html (laptop, light / phone, dark) and reports horizontal overflow.
// Usage (from the repo root): node designs/tools/shot-gallery.mjs [out-dir]
// Writes <out-dir>/gallery-{desk,phone}.png; out-dir defaults to $OUT (see lib.mjs).
import { DESIGNS, OUT, chromium } from './lib.mjs';
const dir = process.argv[2] || OUT;
const b = await chromium.launch();
for (const [w, h, name, scheme] of [[1280, 900, 'desk', 'light'], [390, 844, 'phone', 'dark']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
  await p.goto('file://' + DESIGNS + '/index.html');
  await p.waitForTimeout(500);
  const sw = await p.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
  console.log(name, 'horizontal overflow', sw);
  await p.screenshot({ path: dir + '/gallery-' + name + '.png' });
}
await b.close();
