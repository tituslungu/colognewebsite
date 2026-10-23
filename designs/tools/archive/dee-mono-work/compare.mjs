// Renders: original C beside given SVG files at 300px, plus 16px/24px/40px pixel renders upscaled (nearest neighbour).
// usage: node compare.mjs out.png file1.svg file2.svg ...
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...files] = process.argv.slice(2);
const C = 'file:///Users/titus/repos/colognewebsite/assets/img/icon.png';
const items = [C, ...files.map(f => 'file://' + f)];
const html = `<!doctype html><html><body style="margin:0;background:#e9eae7;font:12px sans-serif">
<div style="display:flex;gap:16px;padding:16px;flex-wrap:wrap">
${items.map(s => `<img src="${s}" width="300" height="300" style="border-radius:60px">`).join('')}
</div>
<div style="display:flex;gap:16px;padding:0 16px 16px;align-items:flex-start;flex-wrap:wrap" id="small"></div>
<script>
const items=${JSON.stringify(items)};
const small=document.getElementById('small');
async function go(){
 for (const s of items){
  for (const px of [16,24,40]){
   const img=new Image(); img.src=s; await img.decode();
   const c=document.createElement('canvas'); c.width=px;c.height=px;
   const g=c.getContext('2d');
   if(px===40){g.beginPath();g.arc(20,20,20,0,7);g.clip();}
   g.drawImage(img,0,0,px,px);
   const big=document.createElement('canvas'); const S=px===40?3:(px===24?4:6); big.width=px*S; big.height=px*S;
   const bg=big.getContext('2d'); bg.imageSmoothingEnabled=false; bg.drawImage(c,0,0,px*S,px*S);
   small.appendChild(big);
  }
 }
 document.title='done';
}
go();
</script></body></html>`;
fs.writeFileSync('/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/dee-mono-work/compare.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 600 } });
await p.goto('file:///private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/dee-mono-work/compare.html');
await p.waitForFunction(() => document.title === 'done');
await p.screenshot({ path: out, fullPage: true });
await b.close();
