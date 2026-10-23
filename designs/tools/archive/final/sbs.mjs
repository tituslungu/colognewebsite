import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const D = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 400, height: 300 } });
for (const t of process.argv.slice(3)) {
  const [w, h] = t.split('-')[0].split('x').map(Number);
  const a = fs.readFileSync(`${D}/prod-${t}.png`).toString('base64');
  const c = fs.readFileSync(`${D}/ref-${t}.png`).toString('base64');
  await p.setViewportSize({ width: w * 2 + 30, height: h + 30 });
  await p.setContent(`<body style="margin:0;background:#c00;display:flex;gap:30px;font:14px sans-serif;color:#fff"><div><div style="height:30px">production</div><img src="data:image/png;base64,${a}"></div><div><div style="height:30px">F reference</div><img src="data:image/png;base64,${c}"></div></body>`);
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${D}/sbs-${t}.png` });
}
await b.close();
