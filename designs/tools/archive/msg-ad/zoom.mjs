// Pixel-true small sizes: each variant's tile rasterised at 40px (circle crop),
// 32px and 16px at 1x and 2x density, then blown up with nearest-neighbour so
// the real pixels can be judged. Also 16px mono on a dark tab.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const dir = path.dirname(new URL(import.meta.url).pathname);
const only = process.argv[2] || '';
const outName = process.argv[3] || 'zoom';
const names = [...new Set(fs.readdirSync(dir).filter(n => n.startsWith(only) && n.endsWith('.tile.svg')).map(n => n.replace('.tile.svg', '')))].sort();
const html = `<!doctype html><html><body style="margin:0;background:#f2f3f1;font:600 12px Helvetica Neue">
<div id="root"></div><script>
const names = ${JSON.stringify(names)};
const dir = ${JSON.stringify(dir)};
const specs = [[40,1,true,'#fff'],[40,2,true,'#fff'],[32,1,false,'#fff'],[16,1,false,'#dee1e6'],[16,2,false,'#dee1e6'],[16,1,false,'#35363a'],[16,2,false,'#35363a']];
const Z = 5;
(async () => {
  for (const n of names) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:14px;align-items:center;padding:8px 12px;border-bottom:1px solid #ddd';
    row.innerHTML = '<div style="width:110px">' + n + '</div>';
    const img = new Image(); img.src = 'file://' + dir + '/' + n + '.tile.svg';
    await img.decode();
    for (const [px, dpr, round, bg] of specs) {
      const s = px * dpr, small = document.createElement('canvas');
      small.width = small.height = s;
      const c = small.getContext('2d');
      c.fillStyle = bg; c.fillRect(0, 0, s, s);
      c.save();
      c.beginPath();
      if (round) c.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); else c.roundRect(0, 0, s, s, s * 0.18);
      c.clip(); c.drawImage(img, 0, 0, s, s); c.restore();
      const big = document.createElement('canvas');
      big.width = big.height = px * Z * 2 / (dpr === 1 ? 1 : 1);
      const b = big.getContext('2d'); b.imageSmoothingEnabled = false;
      b.drawImage(small, 0, 0, big.width, big.height);
      big.style.cssText = 'width:' + big.width / 2 + 'px;height:' + big.height / 2 + 'px';
      const cell = document.createElement('div');
      cell.style.cssText = 'display:grid;justify-items:center;gap:3px';
      cell.append(big); cell.append(px + 'px @' + dpr + 'x');
      row.append(cell);
    }
    document.getElementById('root').append(row);
  }
  document.title = 'done';
})();
</script></body></html>`;
fs.writeFileSync(path.join(dir, outName + '.html'), html);
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1500, height: 300 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.join(dir, outName + '.html'));
await p.waitForFunction(() => document.title === 'done');
await p.screenshot({ path: path.join(dir, outName + '.png'), fullPage: true });
await b.close();
console.log('ok', names.length);
