// Critic's own check: per tone x treatment x order x viewport, effective text contrast
// (rest/hover, text vs the real pixels behind the pill), focus ring vs page, and Tab order vs visual order.
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const FILE = 'file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html';
const tones = (process.argv[2] || 'white').split(',');
const footer = process.env.FOOTER || 'charcoal';
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const parse = s => { const m = s.match(/[\d.]+/g).map(Number); return { rgb: m.slice(0, 3), a: m.length > 3 ? m[3] : 1 }; };
const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
const hx = a => '#' + a.map(c => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase();
const b = await chromium.launch();
const dec = await (await b.newContext()).newPage();
async function pixel(page, x, y) {
  const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 }, animations: 'disabled' });
  return dec.evaluate(async d => { const i = new Image(); i.src = 'data:image/png;base64,' + d; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0);
    return Array.from(x.getImageData(0, 0, 1, 1).data.slice(0, 3)); }, buf.toString('base64'));
}
const VPS = [{ n: 'desk-1440', w: 1440, h: 790 }, { n: 'ph-390', w: 390, h: 664, m: true }];
let bad = 0;
for (const tone of tones) for (const v of ['', 'solid', 'soft', 'mixed']) for (const o of ['', 'imessage-first']) for (const vp of VPS) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, isMobile: !!vp.m, hasTouch: !!vp.m });
  const p = await ctx.newPage();
  await p.goto(`${FILE}?tone=${tone}${tone === 'white' ? '&footer=' + footer : ''}${v ? '&buttons=' + v : ''}${o ? '&order=' + o : ''}&shot=1`);
  await p.waitForTimeout(400);
  // Tab order first, on the fresh page: from the top of the document vs top-to-bottom, left-to-right visual order
  const tabs = [];
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const e = document.activeElement; return (e.dataset && e.dataset.check) || e.getAttribute('aria-label') || e.tagName; })); }
  const ringShown = await p.evaluate(() => { const e = document.activeElement; return e.matches(':focus-visible') ? getComputedStyle(e).outlineStyle + ' ' + getComputedStyle(e).outlineColor : 'none'; });
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.mouse.move(1, 1); await p.waitForTimeout(350);
  const lines = [];
  for (const k of ['whatsapp', 'imessage']) {
    const sel = `[data-check="${k}"]`;
    const r = await p.locator(sel).boundingBox();
    // page pixel just outside the pill (left of it, vertically centred) = what a transparent pill sits on
    const page = await pixel(p, r.x + r.width / 2, r.y - 3);
    const get = () => p.evaluate(s => { const c = getComputedStyle(document.querySelector(s)); return [c.backgroundColor, c.color, c.borderTopColor, c.outlineColor]; }, sel);
    const [bg, ink, line] = await get();
    const eff = over(parse(bg), page);
    const rest = cr(parse(ink).rgb, eff);
    await p.hover(sel); await p.waitForTimeout(350);
    const [hbg, hink] = await get();
    const heff = over(parse(hbg), page);
    const hov = cr(parse(hink).rgb, heff);
    await p.mouse.move(1, 1); await p.waitForTimeout(350);
    const ring = await p.evaluate(s => { const e = document.querySelector(s); e.focus({ focusVisible: true }); const c = getComputedStyle(e).outlineColor; e.blur(); return c; }, sel);
    const ringC = cr(parse(ring).rgb, page);
    const pillEdge = cr(eff, page);
    const flag = (rest < 4.5 || hov < 4.5) ? '  <-- TEXT FAIL' : '';
    if (flag) bad++;
    lines.push(`  ${k.padEnd(8)} page ${hx(page)} fill ${hx(eff)} ink ${hx(parse(ink).rgb)} rest ${rest.toFixed(2)} | hover fill ${hx(heff)} ink ${hx(parse(hink).rgb)} ${hov.toFixed(2)} | ring ${hx(parse(ring).rgb)} ${ringC.toFixed(2)} | fill-vs-page ${pillEdge.toFixed(2)} line ${hx(parse(line).rgb)}${flag}`);
  }
  const visual = await p.evaluate(() => Array.from(document.querySelectorAll('.actions .btn')).sort((a, c) => { const A = a.getBoundingClientRect(), C = c.getBoundingClientRect(); return (A.top - C.top) || (A.left - C.left); }).map(e => e.dataset.check));
  const tabBtns = tabs.filter(t => t === 'whatsapp' || t === 'imessage');
  const ok = tabBtns.join() === visual.join();
  if (!ok) bad++;
  console.log(`== ${tone} ${v || 'sage'} ${o || 'wa-first'} ${vp.n}  visual ${visual.join('>')}  tab ${tabs.join('>')}  ${ok ? 'MATCH' : 'MISMATCH'}  ring-on-tab: ${ringShown}\n` + lines.join('\n'));
  await ctx.close();
}
console.log(bad ? `\n${bad} problems` : '\nall ok');
await b.close();
