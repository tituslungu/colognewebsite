import fs from 'fs';
import { createRequire } from 'module';
import { itemised, shares, P2 } from './p2.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/p2/p2var';
fs.mkdirSync(OUT, { recursive: true });
const V = JSON.parse(process.argv[2]);
const svg = (parts, ink, sage, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}<path fill="${ink}" d="${parts.filter(p => !p.sage).map(p => p.d).join('')}"/><path fill="${sage}"${parts.find(p => p.sage).dx ? ` transform="translate(${parts.find(p => p.sage).dx} 0)"` : ''} d="${parts.filter(p => p.sage).map(p => p.d).join('')}"/></svg>`;
const place = (def, W, G) => { const H = def.h * W + def.tail.d * W; const sl = ((def.slide || 0) + (def.extend || 0)) * W; return itemised(128 - (W + sl) / 2, 128 - H / 2, W, G, def).parts; };
let cells = '';
for (const [n, v] of Object.entries(V)) {
  const def = { ...P2, ...v, tail: { ...P2.tail, ...(v.tail || {}) } };
  fs.writeFileSync(`${OUT}/${n}.svg`, svg(place(def, 200, 17), '#2D2D2D', '#6FAF8E'));
  fs.writeFileSync(`${OUT}/${n}-app.svg`, svg(place(def, 150, 15), '#FAFAF8', '#6FAF8E', '#2D2D2D'));
  cells += `<div class="c"><img src="${n}.svg" width="${process.env.BIG || 150}"><img src="${n}-app.svg" width="96" class="o"><img src="${n}-app.svg" width="40" class="o"><img src="${n}-app.svg" width="16" style="border-radius:3px"><span>${n} ${shares(def).join('/')}</span></div>`;
}
fs.writeFileSync(`${OUT}/sheet.html`, `<!doctype html><style>body{margin:0;background:#fff;font:12px Helvetica}.w{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1200px}.c{display:flex;align-items:center;gap:14px;border:1px solid #eee;padding:10px;position:relative}.o{border-radius:50%}span{position:absolute;left:8px;bottom:4px;color:#999}</style><div class="w">${cells}</div>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 400 } });
await p.goto('file://' + OUT + '/sheet.html');
await p.screenshot({ path: OUT + '/sheet.png', fullPage: true });
await b.close();
