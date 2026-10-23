// Top-left corner of option E with each stylised-D concept (uppercase, Sage on charcoal) as the site icon.
// Usage (from the repo root): node designs/tools/dee-corner.mjs <concept-id> [<concept-id> ...]
// Needs designs/logos/<id>/upper-sage-dark.svg (from colorways.mjs); writes $OUT/logo-shots/<id>/dee-hero-corner.png
// (OUT: see lib.mjs), which logo-gallery.mjs (DEE=dee.json) turns into preview/dee-hero.jpg.
import fs from 'fs';
import path from 'path';
import { DESIGNS, OUT, chromium } from './lib.mjs';
const b = await chromium.launch();
for (const id of process.argv.slice(2)) {
  fs.mkdirSync(path.join(OUT, 'logo-shots', id), { recursive: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 790 }, deviceScaleFactor: 2 });
  await p.goto('file://' + DESIGNS + '/e-loop/index.html?tone=white&footer=charcoal&shot=1');
  await p.evaluate(async src => { const i = document.querySelector('[data-check="icon"]'); i.src = src; await i.decode().catch(() => {}); },
    `file://${DESIGNS}/logos/${id}/upper-sage-dark.svg`);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/logo-shots/${id}/dee-hero-corner.png`, clip: { x: 0, y: 0, width: 360, height: 200 } });
  await p.close();
}
await b.close();
console.log('ok');
