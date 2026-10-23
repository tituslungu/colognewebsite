// Compare parameter sets: each row renders upper+lower in 3 colourways at 150 / 40 circle / 16 (DSF 1, then upscaled 4x nearest for inspection)
import { createRequire } from 'module';
import fs from 'fs';
import { execSync } from 'child_process';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const W = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/dee-mono-work';
const sets = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const CW = { blue: ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'], sage: ['#FAFAF8', '#ECEBE8', '#3E7A5B', '#8CC4A5'], dark: ['#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD'], char: ['#FFFFFF','#FFFFFF','#2D2D2D','#2D2D2D'] };
let rows = '';
for (const [name, P] of Object.entries(sets)) {
  const out = `${W}/v/${name}`; fs.mkdirSync(out, { recursive: true });
  execSync(`node ${W}/gen.mjs`, { env: { ...process.env, OUT: out, P: JSON.stringify(P) } });
  let cells = '';
  for (const c of ['upper', 'lower']) for (const [k, v] of Object.entries(CW)) {
    let s = fs.readFileSync(`${out}/${c}.tmpl.svg`, 'utf8');
    ['TILE_A','TILE_B','INK_A','INK_B'].forEach((t, i) => s = s.split(`%${t}%`).join(v[i]));
    const src = 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
    cells += `<img src="${src}" width="96" height="96" style="border-radius:20px"><img src="${src}" width="40" height="40" style="border-radius:50%"><img src="${src}" width="16" height="16" style="border-radius:3px">`;
  }
  rows += `<div style="display:flex;gap:8px;align-items:center;padding:6px 8px"><span style="width:70px">${name}</span>${cells}</div>`;
}
const html = `<body style="margin:0;background:#dee1e6;font:11px sans-serif">${rows}</body>`;
const b = await chromium.launch();
for (const dsf of [1, 2]) {
  const p = await b.newPage({ viewport: { width: 1520, height: 100 }, deviceScaleFactor: dsf });
  await p.setContent(html); await p.waitForTimeout(200);
  await p.screenshot({ path: `${W}/cmp-${dsf}x.png`, fullPage: true });
}
await b.close();
console.log('ok');
