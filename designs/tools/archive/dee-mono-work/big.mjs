// Large side-by-side of variants (charcoal on white + blue), 220px each
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const W = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/dee-mono-work';
const [which, ...names] = process.argv.slice(2);
const CW = { blue: ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'], char: ['#FFFFFF','#FFFFFF','#2D2D2D','#2D2D2D'] };
let cells = '';
for (const k of Object.keys(CW)) { for (const n of names) for (const c of which.split(',')) {
  let s = fs.readFileSync(`${W}/v/${n}/${c}.tmpl.svg`, 'utf8');
  ['TILE_A','TILE_B','INK_A','INK_B'].forEach((t, i) => s = s.split(`%${t}%`).join(CW[k][i]));
  // circle guide for the inscribed circle
  s = s.replace('</svg>', '<circle cx="128" cy="128" r="127" fill="none" stroke="#f0a" stroke-width="0.6" opacity=".5"/><line x1="128" y1="0" x2="128" y2="256" stroke="#f0a" stroke-width=".4" opacity=".4"/><line y1="128" x1="0" y2="128" x2="256" stroke="#f0a" stroke-width=".4" opacity=".4"/></svg>');
  cells += `<figure style="margin:0;text-align:center"><img src="data:image/svg+xml;base64,${Buffer.from(s).toString('base64')}" width="220" height="220"><figcaption>${n} ${c}</figcaption></figure>`;
} cells += '<div style="flex-basis:100%"></div>'; }
const html = `<body style="margin:0;background:#ccc;font:12px sans-serif"><div style="display:flex;flex-wrap:wrap;gap:10px;padding:10px;width:${Math.min(names.length * which.split(',').length, 6) * 232}px">${cells}</div></body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 100 } });
await p.setContent(html); await p.waitForTimeout(200);
await p.screenshot({ path: `${W}/big.png`, fullPage: true });
await b.close(); console.log('ok');
