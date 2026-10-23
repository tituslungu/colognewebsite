// Computed colours of both buttons (rest / hover / focus-visible), sizes, and Tab order, per treatment x order.
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const tone = process.argv[2] || 'white';
const b = await chromium.launch();
for (const v of ['', 'sage', 'solid', 'soft', 'mixed']) for (const o of ['', 'imessage-first']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 790 } });
  await p.goto(`file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=${tone}&footer=charcoal${v ? '&buttons=' + v : ''}${o ? '&order=' + o : ''}&shot=1`);
  await p.waitForTimeout(300);
  const st = async sel => p.evaluate(s => { const e = document.querySelector(s), c = getComputedStyle(e), r = e.getBoundingClientRect();
    return `bg=${c.backgroundColor} line=${c.borderTopColor} ink=${c.color} ring=${c.outlineStyle === 'none' ? '-' : c.outlineColor} ${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.left)}`; }, sel);
  const out = [];
  for (const k of ['whatsapp', 'imessage']) {
    const sel = `[data-check="${k}"]`;
    const rest = await st(sel);
    await p.hover(sel); await p.waitForTimeout(350); const hov = await st(sel);
    await p.mouse.move(0, 0); await p.waitForTimeout(350);
    out.push(`  ${k.padEnd(8)} rest  ${rest}\n  ${''.padEnd(8)} hover ${hov}`);
  }
  // Tab order: mark is first, then the two buttons
  const tabs = [];
  await p.focus('body');
  for (let i = 0; i < 3; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => document.activeElement.dataset.check || document.activeElement.className)); }
  const ring = await st('[data-check="' + tabs[2] + '"]');
  const visual = await p.evaluate(() => Array.from(document.querySelectorAll('.actions .btn')).sort((a, c) => a.getBoundingClientRect().left - c.getBoundingClientRect().left).map(e => e.dataset.check).join(','));
  console.log('== ' + (v || '(none)') + ' ' + (o || 'wa-first') + '  visual: ' + visual + '  tab: ' + tabs.join(',') + '\n' + out.join('\n') + '\n  focused ' + tabs[2] + ': ' + ring);
  await p.close();
}
await b.close();
