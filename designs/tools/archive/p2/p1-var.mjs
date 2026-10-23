import fs from 'fs';
import { createRequire } from 'module';
import { bubble, bbox, reach } from './p1.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/p1var';
fs.mkdirSync(OUT, { recursive: true });
const base = { rCorner: 0.055, rTip: 0.04 };
const V = {
  c1: { ...base, cuts: [{ x: -0.13, a: -73 }, { x: 0.265, a: -79 }], sage: 2, tail: { fromCut: true, depth: 1.14, theta: 150 } },
  c2: { ...base, cuts: [{ x: -0.13, a: -79 }, { x: 0.265, a: -73 }], sage: 2, tail: { fromCut: true, depth: 1.14, theta: 152 } },
  c3: { ...base, cuts: [{ x: -0.13, a: -80 }, { x: 0.27, a: -71 }], sage: 2, tail: { fromCut: true, depth: 1.14, theta: 152 } },
  c4: { ...base, cuts: [{ x: -0.13, a: -79 }, { x: 0.265, a: -73 }], sage: 1, tail: { fromCut: true, depth: 1.14, theta: 152 } },
  c5: { ...base, cuts: [{ x: -0.36, a: -79 }, { x: 0.05, a: -72 }], sage: 2, tail: { fromCut: true, depth: 1.16, theta: 160 } },
  c6: { ...base, cuts: [{ x: -0.36, a: -79 }, { x: 0.05, a: -72 }], sage: 1, tail: { fromCut: true, depth: 1.16, theta: 160 } },
};
const svg = (parts, ink, sage, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<path fill="${ink}" d="${parts.filter(p => !p.sage).map(p => p.d).join('')}"/><path fill="${sage}" d="${parts.filter(p => p.sage).map(p => p.d).join('')}"/></svg>`;
import { area, disk, half } from './geo.mjs';
function areas(def) {
  // approximate shares of the circle (ignores tail), by sampling
  const N = 400; const cnt = [0, 0, 0]; let tot = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = -1 + 2 * i / N, y = -1 + 2 * j / N; if (x * x + y * y > 1) continue; tot++;
    const side = c => { const a = c.a * Math.PI / 180; return (x - c.x) * Math.sin(a) - y * Math.cos(a) > 0 ? 1 : 0; };
    const k = def.cuts.reduce((s, c) => s + ((x - (c.x + y / Math.tan(c.a * Math.PI / 180))) > 0 ? 1 : 0), 0);
    cnt[k]++;
  }
  return cnt.map(c => Math.round(100 * c / tot)).join('/');
}
let cells = '';
for (const [n, def] of Object.entries(V)) {
  let bb = bbox(0, 0, 100, def);
  const m = bubble(128 - (bb.x0 + bb.x1) / 2, 128 - (bb.y0 + bb.y1) / 2, 100, 17, def);
  bb = bbox(0, 0, 78, def);
  const ax = 128 - (bb.x0 + bb.x1) / 2, ay = 128 - (bb.y0 + bb.y1) / 2;
  const a = bubble(ax, ay, 78, 15, def);
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(m, '#2D2D2D', '#6FAF8E'));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(a, '#FAFAF8', '#6FAF8E', '#2D2D2D'));
  cells += `<div class="c"><img src="${n}.svg" width="150"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n} reach ${reach(ax, ay, 78, 128, 128, def).toFixed(0)} areas ${areas(def)}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 600 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
