// Simulate 1x favicon (16px) and 32px renders, upscaled 6x nearest-neighbour, for each variant dir under v/
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const W = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/dee-mono-work';
const names = process.argv.slice(2);
const CW = { blue: ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'], sage: ['#FAFAF8', '#ECEBE8', '#3E7A5B', '#8CC4A5'], dark: ['#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD'], char: ['#FFFFFF','#FFFFFF','#2D2D2D','#2D2D2D'] };
const items = [];
for (const n of names) for (const c of ['upper', 'lower']) for (const [k, v] of Object.entries(CW)) {
  let s = fs.readFileSync(`${W}/v/${n}/${c}.tmpl.svg`, 'utf8');
  ['TILE_A','TILE_B','INK_A','INK_B'].forEach((t, i) => s = s.split(`%${t}%`).join(v[i]));
  items.push({ n, c, k, src: 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64') });
}
const html = `<body style="margin:0;background:#dee1e6;font:11px sans-serif"><div id=g style="display:grid;grid-template-columns:repeat(8,auto);gap:6px;padding:6px;width:max-content"></div>
<script>
const items = ${JSON.stringify(items)};
const g = document.getElementById('g');
let lastN = null;
Promise.all(items.map(async it => { const im = new Image(); im.src = it.src; await im.decode(); it.im = im; })).then(() => {
  for (const it of items) {
    const c = document.createElement('canvas'); c.width = 16*6; c.height = 16*6;
    const s = document.createElement('canvas'); s.width = 16; s.height = 16; s.getContext('2d').drawImage(it.im, 0, 0, 16, 16);
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(s, 0, 0, 96, 96);
    c.title = it.n; g.appendChild(c);
  }
  document.body.dataset.done = 1;
});
</script></body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 100 }, deviceScaleFactor: 1 });
await p.setContent(html); await p.waitForSelector('body[data-done]');
await p.screenshot({ path: `${W}/px.png`, fullPage: true });
await b.close(); console.log('ok');
