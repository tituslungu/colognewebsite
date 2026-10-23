import { createRequire } from 'module';
import { wordmark, M } from './wordmark.mjs';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const cap = 300, s = cap / M.H, fs = cap / 0.714;
const d = wordmark({ capH: cap }).paths.match(/d="([^"]+)"/)[1];
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 440 } });
await p.setContent('<canvas id=c width=1100 height=440></canvas>');
await p.evaluate(({ d, fs, s }) => {
  const x = document.getElementById('c').getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, 1100, 440);
  x.font = `bold ${fs}px "Helvetica Neue"`; x.letterSpacing = (0.12 * fs) + 'px';
  x.fillStyle = '#000'; x.fillText('DIVI', 40 - 69 * s * 0 - 69 * (fs / 1000), 400);
  x.translate(40, 100); x.fillStyle = 'rgba(220,40,40,.55)'; x.fill(new Path2D(d), 'evenodd');
}, { d, fs, s });
await p.screenshot({ path: 'overlay.png' });
await b.close();
