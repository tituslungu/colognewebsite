// Renders assets/img/icon.svg to assets/img/icon.png (512x512, opaque).
// Usage (from the repo root): node designs/tools/render-icon.mjs
import fs from 'fs';
import path from 'path';
import { REPO, chromium } from './lib.mjs';
const svg = fs.readFileSync(path.join(REPO, 'assets/img/icon.svg'), 'utf8').replace('width="256" height="256"', 'width="512" height="512"');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
await p.setContent(`<!doctype html><body style="margin:0">${svg}</body>`);
await p.screenshot({ path: path.join(REPO, 'assets/img/icon.png'), clip: { x: 0, y: 0, width: 512, height: 512 } });
await b.close();
console.log('ok');
