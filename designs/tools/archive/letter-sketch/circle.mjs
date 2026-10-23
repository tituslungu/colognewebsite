import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://' + process.cwd() + '/s1.html');
for (const f of process.argv.slice(2)) {
  const r = await p.evaluate(async src => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 512, 512);
    const d = x.getImageData(0, 0, 512, 512).data; const bg = [d[0], d[1], d[2]]; let max = 0;
    for (let y = 0; y < 512; y++) for (let i = 0; i < 512; i++) { const k = (y * 512 + i) * 4; if (Math.abs(d[k] - bg[0]) + Math.abs(d[k+1] - bg[1]) + Math.abs(d[k+2] - bg[2]) > 40) { const r = Math.hypot(i + .5 - 256, y + .5 - 256); if (r > max) max = r; } }
    return max / 2;
  }, 'data:image/svg+xml;base64,' + (await import('fs')).readFileSync(f).toString('base64'));
  console.log(f.split('/').slice(-2).join('/'), 'content radius', r.toFixed(1), 'of 128 -> margin', (128 - r).toFixed(1), '(', ((128 - r) / 256 * 40).toFixed(1), 'px at 40px )');
}
await b.close();
