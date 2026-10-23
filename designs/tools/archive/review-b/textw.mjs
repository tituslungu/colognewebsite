import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
await page.goto('file:///Users/titus/repos/colognewebsite/designs/b-split/index.html?tone=gray&shot=1');
const r = await page.evaluate(() => {
  const out = {};
  const font = '"Helvetica Neue", Helvetica, Inter, system-ui, -apple-system, Arial, sans-serif';
  const m = (txt, css) => { const s = document.createElement('span'); s.style.cssText = 'position:absolute;white-space:nowrap;font-family:' + font + ';' + css; s.textContent = txt; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return Math.round(w*10)/10; };
  for (const t of ['Text us', 'to split', 'your bill', 'Text us to', 'split your', 'split your bill'])
    out[t] = [20,22,24,26].map(px => m(t, `font-size:${px}px;font-weight:700;letter-spacing:-0.01em`));
  out.btnFullWA = m('Text Through WhatsApp', 'font-size:15px;font-weight:600;letter-spacing:.02em');
  out.btnFullIM = m('Text Through iMessage', 'font-size:15px;font-weight:600;letter-spacing:.02em');
  out.wa = m('WhatsApp', 'font-size:15px;font-weight:600;letter-spacing:.02em');
  out.footer = ['hello@justdivi.com','Terms of Service','Privacy Policy','© 2026 Divi. All rights reserved.'].map(t => m(t, 'font-size:12px;letter-spacing:.02em'));
  out.fontUsed = document.fonts ? [...document.fonts].length : null;
  return out;
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
