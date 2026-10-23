// Loads every design preview page and gallery and reports broken images / script errors.
// Usage (from the repo root): node designs/tools/designs-smoke.mjs
import { REPO, DESIGNS, chromium } from './lib.mjs';
const R = DESIGNS + '/';
const pages = ['index.html', 'logos/index.html', ...['a-stack', 'b-split', 'c-overlap', 'd-bleed', 'e-loop', 'f-fade'].map(s => s + '/index.html?tone=white')];
const b = await chromium.launch();
for (const pg of pages) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const failed = []; p.on('requestfailed', r => failed.push(r.url().replace('file://' + REPO + '/', '')));
  await p.goto('file://' + R + pg); await p.waitForTimeout(500);
  const broken = await p.evaluate(() => [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')));
  console.log(`${pg.padEnd(28)} broken=${broken.length} failed=${failed.length} errors=${errs.length}` + (broken.length + failed.length ? ' ' + JSON.stringify([...broken, ...failed].slice(0, 4)) : ''));
  await p.close();
}
await b.close();
