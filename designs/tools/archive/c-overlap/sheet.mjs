import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
import fs from 'fs';
const SH = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/shots/c-overlap/';
const out = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/c-overlap/';
const [name, layout, ...vps] = process.argv.slice(2); // layout: rows (tones as rows) or cols
const tones = ['gray', 'white', 'sage'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 400, height: 400 } });
await p.setContent('<canvas id=c></canvas>');
const files = [];
for (const t of tones) for (const v of vps) files.push(fs.readFileSync(SH + `${t}__${v}.png`).toString('base64'));
const data = await p.evaluate(async ({ files, n, layout }) => {
  const ims = await Promise.all(files.map(async f => { const i = new Image(); i.src = 'data:image/png;base64,' + f; await i.decode(); return i; }));
  const H = 700; const gap = 12;
  const scaled = ims.map(i => ({ i, w: Math.round(i.width * H / i.height), h: H }));
  // rows = tones, cols = viewports
  const rows = 3, cols = n;
  const colW = []; for (let c = 0; c < cols; c++) colW[c] = Math.max(...[0,1,2].map(r => scaled[r*cols+c].w));
  const W = colW.reduce((a, b) => a + b, 0) + gap * (cols + 1);
  const Ht = rows * H + gap * (rows + 1);
  const c = document.getElementById('c'); c.width = W; c.height = Ht;
  const x = c.getContext('2d'); x.fillStyle = '#888'; x.fillRect(0, 0, W, Ht);
  for (let r = 0; r < rows; r++) { let px = gap; for (let k = 0; k < cols; k++) { const s = scaled[r*cols+k]; x.drawImage(s.i, px, gap + r * (H + gap), s.w, s.h); px += colW[k] + gap; } }
  return c.toDataURL('image/png').split(',')[1];
}, { files, n: vps.length, layout });
fs.writeFileSync(out + name + '.png', Buffer.from(data, 'base64'));
await b.close();
