import { createRequire } from 'module'; import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...files] = process.argv.slice(2);
const W = 110*files.length+20;
const b = await chromium.launch();
const shots=[];
fs.writeFileSync(out+'.src.html', `<body style="margin:0;display:flex;gap:10px;padding:10px;background:#fff;align-items:center">`+files.map(f=>`<img src="file://${f}" width="16" height="16" style="border-radius:3px"><div style="background:#35363a;padding:4px"><img src="file://${f}" width="16" height="16" style="border-radius:3px;display:block"></div><img src="file://${f}" width="40" height="40" style="border-radius:50%">`).join('')+`</body>`);
for (const dpr of [1,2]) {
  const p = await b.newPage({ viewport:{width:W,height:60}, deviceScaleFactor:dpr });
  await p.goto('file://'+out+'.src.html'); await p.waitForTimeout(300);
  const buf = await p.screenshot(); shots.push(buf.toString('base64')); await p.close();
}
fs.writeFileSync(out+'.html', `<body style="margin:0;background:#888">`+shots.map((s,i)=>`<img src="data:image/png;base64,${s}" style="image-rendering:pixelated;width:${W*(5)}px;display:block;margin:4px">`).join('')+`</body>`);
const p = await b.newPage({ viewport:{width:W*5+10,height:400} });
await p.goto('file://'+out+'.html'); await p.waitForTimeout(300);
await p.screenshot({path:out, fullPage:true}); await b.close();
