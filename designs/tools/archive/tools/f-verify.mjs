import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const URL = 'file:///Users/titus/repos/colognewebsite/designs/f-fade/index.html?tone=white&footer=charcoal';
const b = await chromium.launch();
for (const [w, h] of [[1440, 790], [390, 664]]) {
  for (const q of ['', '&order=whatsapp-first', '&buttons=sage', '&buttons=sage&order=whatsapp-first', '&buttons=solid', '&buttons=mixed']) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL + q);
    const r = await p.evaluate(() => {
      const btns = [...document.querySelectorAll('.actions .btn')];
      const bar = [...document.querySelectorAll('.preview-bar a[aria-current]')].map(a => a.textContent);
      return { attrs: document.documentElement.dataset.buttons + '/' + document.documentElement.dataset.order,
        order: btns.map(x => x.classList.contains('btn-imessage') ? 'iM' : 'WA'),
        visible: btns.map(x => x.innerText.trim()), names: btns.map(x => x.textContent.replace(/\s+/g, ' ').trim()),
        bg: btns.map(x => getComputedStyle(x).backgroundColor), current: bar,
        hint: document.querySelector('[data-check="hint"]').textContent };
    });
    const tabs = [];
    for (let i = 0; i < 4; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => document.activeElement.className || document.activeElement.tagName)); }
    console.log(`${w} ${q || '(default)'} -> ${r.attrs} order=${r.order} visible=${JSON.stringify(r.visible)} bg=${r.bg.join(' | ')} bar=${JSON.stringify(r.current)} tab=${tabs.filter(t => /btn/.test(t)).map(t => /imessage/.test(t) ? 'iM' : 'WA')} errs=${errs.length}`);
    if (w === 1440 && !q) console.log('   names:', JSON.stringify(r.names), '| hint:', r.hint);
    await p.close();
  }
}
await b.close();
