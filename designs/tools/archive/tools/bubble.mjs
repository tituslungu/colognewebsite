// Renders candidate bubble glyphs next to the WhatsApp glyph, big and at button size.
// Usage: node bubble.mjs <out.png> 'path1' 'path2' ...
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const [out, ...paths] = process.argv.slice(2);
const WA = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
const svg = (d, s, grid) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" style="${grid ? 'background:repeating-linear-gradient(0deg,#0001 0 1px,transparent 1px 10px),repeating-linear-gradient(90deg,#0001 0 1px,transparent 1px 10px)' : ''}"><path d="${d}"/></svg>`;
const rows = paths.map((d, i) => `
  <div class="row"><b>${i + 1}</b>
    ${svg(WA, 240, true)} ${svg(d, 240, true)}
    <div class="small">
      <span class="pill a">${svg(WA, 18)} WhatsApp</span> <span class="pill b">${svg(d, 18)} iMessage</span><br>
      <span class="pill c">${svg(WA, 18)} WhatsApp</span> <span class="pill d">${svg(d, 18)} iMessage</span><br>
      <span class="pill a">${svg(WA, 20)} WhatsApp</span> <span class="pill b">${svg(d, 20)} iMessage</span>
    </div>
  </div>`).join('');
const html = `<!doctype html><style>body{margin:0;padding:16px;font:600 15px "Helvetica Neue",Helvetica,Arial;background:#FAFAF8;color:#2D2D2D}
.row{display:flex;gap:16px;align-items:center;margin-bottom:16px}.small{display:flex;flex-direction:column;gap:10px}
.pill{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 20px;border-radius:999px;border:2px solid #3E7A5B}
.a{background:#6FAF8E;border-color:#6FAF8E}.c{background:#15803D;border-color:#15803D;color:#fff}.d{background:#0A68D8;border-color:#0A68D8;color:#fff}
svg{flex-shrink:0}</style>${rows}`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 280 * paths.length + 20 }, deviceScaleFactor: 2 });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log(out);
