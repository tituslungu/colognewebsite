// node variants.mjs out.png p1.json p2.json ...  -> one row per params file
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs'); const cp = require('child_process'); const path = require('path');
const out = process.argv[2]; const files = process.argv.slice(3);
const CW = { blue: ['#DEF8FB','#A6E5F7','#1151FE','#05DFF2'], dark: ['#2D2D2D','#2D2D2D','#6FAF8E','#A8DCBD'], char: ['#FFFFFF','#FFFFFF','#2D2D2D','#2D2D2D'] };
let rows = '';
for (const f of files) {
  const dir = path.join(path.dirname(out), 'var-' + path.basename(f, '.json')); fs.mkdirSync(dir, { recursive: true });
  cp.execSync(`python3 ${path.join(path.dirname(new URL(import.meta.url).pathname), 'gen.py')} ${f} ${dir}`);
  const cells = [];
  for (const c of ['upper', 'lower']) {
    const t = fs.readFileSync(path.join(dir, c + '.tmpl.svg'), 'utf8');
    for (const [k, v] of Object.entries(CW)) {
      let s = t; ['TILE_A','TILE_B','INK_A','INK_B'].forEach((n, i) => s = s.split('%' + n + '%').join(v[i]));
      fs.writeFileSync(path.join(dir, `${c}-${k}.svg`), s);
    }
  }
  const u = n => 'file://' + path.join(dir, n);
  rows += `<div class=row><b>${path.basename(f)}</b>` + ['upper','lower'].map(c => `<img src="${u(c+'-blue.svg')}" width=220 style="border-radius:44px"><img src="${u(c+'-dark.svg')}" width=64 style="border-radius:14px"><img src="${u(c+'-blue.svg')}" width=40 style="border-radius:50%"><img src="${u(c+'-dark.svg')}" width=40 style="border-radius:50%"><img src="${u(c+'-char.svg')}" width=16><img src="${u(c+'-blue.svg')}" width=16 style="border-radius:3px">`).join('<i></i>') + '</div>';
}
fs.writeFileSync(out + '.html', `<style>body{margin:0;background:#eee;font:12px sans-serif}.row{display:flex;align-items:center;gap:12px;padding:8px}.row b{width:60px}i{width:20px}</style>${rows}`);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 100 }, deviceScaleFactor: 1 });
await p.goto('file://' + out + '.html'); await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true }); await b.close();
