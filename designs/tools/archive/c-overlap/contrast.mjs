import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const tone of ['gray', 'white', 'sage']) {
  const p = await b.newPage({ viewport: { width: 390, height: 664 } });
  await p.goto('file:///Users/titus/repos/colognewebsite/designs/c-overlap/index.html?shot=1&tone=' + tone);
  const r = await p.evaluate(() => {
    const parse = s => { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const bgOf = el => { const layers = []; for (let n = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c.a > 0) { layers.push(c); if (c.a >= 1) break; } } let out = { r: 255, g: 255, b: 255 }; for (const c of layers.reverse()) { out = { r: c.r * c.a + out.r * (1 - c.a), g: c.g * c.a + out.g * (1 - c.a), b: c.b * c.a + out.b * (1 - c.a) }; } return out; };
    return ['prompt', 'whatsapp', 'imessage', 'hint', 'copyright', 'email', 'tos', 'privacy', 'replay'].map(k => {
      const el = document.querySelector(`[data-check="${k}"]`);
      const fg = parse(getComputedStyle(el).color), bg = bgOf(el);
      const L1 = lum(fg), L2 = lum(bg);
      return k + ' ' + ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
    }).join('  ');
  });
  console.log(tone.padEnd(5), r);
  await p.close();
}
await b.close();
