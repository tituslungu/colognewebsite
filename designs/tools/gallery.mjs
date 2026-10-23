// Builds the "pick an option" gallery from data/options.json (+ data/options-r3.json, data/options-r4.json)
// and the check.mjs screenshots in $OUT/shots (OUT: see lib.mjs). Needs macOS `sips` for the JPEGs.
// Usage (from the repo root): node designs/tools/gallery.mjs
// Writes designs/shots/<slug>/*.jpg, designs/index.html (local, full document) and $OUT/artifact/index.html
// (artifact page body: the publish skeleton supplies doctype/head/body).
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { DESIGNS, DATA, OUT } from './lib.mjs';

const options = JSON.parse(fs.readFileSync(path.join(DATA, 'options.json'), 'utf8'));
const TONES = ['gray', 'white', 'sage'];

// Shrink screenshots to JPEG next to the designs so both the local gallery and the artifact use them.
for (const o of options) {
  const out = path.join(DESIGNS, 'shots', o.slug);
  fs.mkdirSync(out, { recursive: true });
  for (const t of TONES) {
    for (const [vp, kind, max] of [['desk-1440', 'desk', '1280'], ['ph-390', 'phone', '560']]) {
      const src = path.join(OUT, 'shots', o.slug, `${t}__${vp}.png`);
      if (!fs.existsSync(src)) throw new Error('missing screenshot ' + src);
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', max, src,
        '--out', path.join(out, `${t}-${kind}.jpg`)], { stdio: 'ignore' });
    }
  }
}

// Round 2: options C and D on the white tone with each footer variant ('' = original white footer).
const ROUND2 = ['c-overlap', 'd-bleed'];
const FOOTERS = [['charcoal', 'Charcoal', '#2d2d2d'], ['light', 'Light gray', '#ecebe8'], ['', 'White (before)', '#fafaf8']];
for (const slug of ROUND2) {
  for (const [f] of FOOTERS) {
    if (!f) continue; // the plain white shots were converted above
    for (const [vp, kind, max] of [['desk-1440', 'desk', '1280'], ['ph-390', 'phone', '560']]) {
      const src = path.join(OUT, 'shots', slug, `white-footer-${f}__${vp}.png`);
      if (!fs.existsSync(src)) throw new Error('missing screenshot ' + src);
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', max, src,
        '--out', path.join(DESIGNS, 'shots', slug, `white-footer-${f}-${kind}.jpg`)], { stdio: 'ignore' });
    }
  }
}

// Later rounds (options-r3.json, options-r4.json, ...): white tone with each footer variant; newest shown first.
const LATER = [4, 3].map(n => ({ n, file: path.join(DATA, `options-r${n}.json`) }))
  .filter(r => fs.existsSync(r.file)).map(r => ({ n: r.n, items: JSON.parse(fs.readFileSync(r.file, 'utf8')) }));
const ORDERS = [['im', 'iMessage first'], ['wa', 'WhatsApp first']];
for (const o of LATER.flatMap(r => r.items).filter(o => o.buttons)) {
  fs.mkdirSync(path.join(DESIGNS, 'shots', o.slug), { recursive: true });
  for (const [b] of o.buttons) for (const [ord] of ORDERS) {
    for (const [vp, kind, max] of [['desk-1440', 'desk', '1280'], ['ph-390', 'phone', '560']]) {
      const src = path.join(OUT, 'shots', o.slug, `white-footer-charcoal-btn-${b}-${ord}__${vp}.png`);
      if (!fs.existsSync(src)) throw new Error('missing screenshot ' + src);
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '74', '-Z', max, src,
        '--out', path.join(DESIGNS, 'shots', o.slug, `btn-${b}-${ord}-${kind}.jpg`)], { stdio: 'ignore' });
    }
  }
}
for (const o of LATER.flatMap(r => r.items).filter(o => !o.buttons)) {
  fs.mkdirSync(path.join(DESIGNS, 'shots', o.slug), { recursive: true });
  for (const [f] of FOOTERS) {
    for (const [vp, kind, max] of [['desk-1440', 'desk', '1280'], ['ph-390', 'phone', '560']]) {
      const tag = f ? `white-footer-${f}` : 'white';
      const src = path.join(OUT, 'shots', o.slug, `${tag}__${vp}.png`);
      if (!fs.existsSync(src)) throw new Error('missing screenshot ' + src);
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', max, src,
        '--out', path.join(DESIGNS, 'shots', o.slug, `${tag}-${kind}.jpg`)], { stdio: 'ignore' });
    }
  }
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function body(prefix) {
  const cards = options.map((o, i) => `
    <section class="opt" id="${esc(o.slug)}" aria-labelledby="${esc(o.slug)}-name">
      <div class="opt-text">
        <p class="opt-letter">Option ${String.fromCharCode(65 + i)}</p>
        <h3 id="${esc(o.slug)}-name">${esc(o.title)}</h3>
        <p class="opt-summary">${esc(o.summary)}</p>
        <a class="open" data-slug="${esc(o.slug)}" href="${prefix}${esc(o.slug)}/index.html?tone=gray">Open live page <span aria-hidden="true">&rarr;</span></a>
      </div>
      <div class="shots">
        <figure class="desk">
          <img data-slug="${esc(o.slug)}" data-kind="desk" src="${prefix}shots/${esc(o.slug)}/gray-desk.jpg"
               alt="${esc(o.title)} on a 1440px-wide laptop window" width="1280" height="702" loading="lazy">
          <figcaption>Laptop &middot; 1440 &times; 790</figcaption>
        </figure>
        <figure class="phone">
          <img data-slug="${esc(o.slug)}" data-kind="phone" src="${prefix}shots/${esc(o.slug)}/gray-phone.jpg"
               alt="${esc(o.title)} on an iPhone in Safari" width="329" height="560" loading="lazy">
          <figcaption>iPhone &middot; 390 &times; 664</figcaption>
        </figure>
      </div>
    </section>`).join('\n');

  // Cards whose screenshots follow their section's footer switch (white tone).
  const footerCards = (list, key) => list.map(o => `
    <section class="opt" id="${key}-${esc(o.slug)}" aria-labelledby="${key}-${esc(o.slug)}-name">
      <div class="opt-text">
        <p class="opt-letter">Option ${esc(o.letter)}</p>
        <h3 id="${key}-${esc(o.slug)}-name">${esc(o.title)}</h3>
        <p class="opt-summary">${esc(o.summary)}</p>
        <a class="open" data-fslug="${esc(o.slug)}" href="${prefix}${esc(o.slug)}/index.html?tone=white&amp;footer=charcoal">Open live page <span aria-hidden="true">&rarr;</span></a>
      </div>
      <div class="shots">
        <figure class="desk">
          <img data-fslug="${esc(o.slug)}" data-kind="desk" src="${prefix}shots/${esc(o.slug)}/white-footer-charcoal-desk.jpg"
               alt="${esc(o.title)} on white, on a 1440px-wide laptop window" width="1280" height="702">
          <figcaption>Laptop &middot; 1440 &times; 790</figcaption>
        </figure>
        <figure class="phone">
          <img data-fslug="${esc(o.slug)}" data-kind="phone" src="${prefix}shots/${esc(o.slug)}/white-footer-charcoal-phone.jpg"
               alt="${esc(o.title)} on white, on an iPhone in Safari" width="329" height="560">
          <figcaption>iPhone &middot; 390 &times; 664</figcaption>
        </figure>
      </div>
    </section>`).join('\n');
  const letterOf = slug => String.fromCharCode(65 + options.findIndex(o => o.slug === slug));
  const r2cards = footerCards(ROUND2.map(slug => ({ ...options.find(o => o.slug === slug), letter: letterOf(slug) })), 'r2');

  const footerButtons = FOOTERS.map(([f, label, sw], k) =>
    `<button type="button" data-footer="${f}" aria-pressed="${k === 0}"><span class="swatch" style="background:${sw}"></span>${label}</button>`).join('\n        ');
  // The first listed style and the first order are the page's defaults, so they need no parameter.
  const btnQuery = (o, b, ord) => `tone=white&amp;footer=charcoal${b !== o.buttons[0][0] ? '&amp;buttons=' + b : ''}${ord !== ORDERS[0][0] ? '&amp;order=whatsapp-first' : ''}`;
  const buttonCard = o => `
    <section class="opt" id="bv-${esc(o.slug)}" aria-labelledby="bv-${esc(o.slug)}-name">
      <div class="opt-text">
        <p class="opt-letter">Option ${esc(o.letter)}</p>
        <h3 id="bv-${esc(o.slug)}-name">${esc(o.title)}</h3>
        <p class="opt-summary">${esc(o.summary)}</p>
        ${o.verdict ? `<p class="opt-summary"><strong>Critic:</strong> ${esc(o.verdict)}</p>` : ''}
        <a class="open" data-bslug="${esc(o.slug)}" href="${prefix}${esc(o.slug)}/index.html?${btnQuery(o, o.buttons[0][0], ORDERS[0][0])}">Open live page <span aria-hidden="true">&rarr;</span></a>
      </div>
      <div class="shots">
        <figure class="desk">
          <img data-bslug="${esc(o.slug)}" data-kind="desk" src="${prefix}shots/${esc(o.slug)}/btn-${o.buttons[0][0]}-${ORDERS[0][0]}-desk.jpg"
               alt="${esc(o.title)} on a 1440px-wide laptop window" width="1280" height="702">
          <figcaption>Laptop &middot; 1440 &times; 790</figcaption>
        </figure>
        <figure class="phone">
          <img data-bslug="${esc(o.slug)}" data-kind="phone" src="${prefix}shots/${esc(o.slug)}/btn-${o.buttons[0][0]}-${ORDERS[0][0]}-phone.jpg"
               alt="${esc(o.title)} on an iPhone in Safari" width="329" height="560">
          <figcaption>iPhone &middot; 390 &times; 664</figcaption>
        </figure>
      </div>
    </section>`;
  const buttonControls = o => `
      <div class="tone" role="group" aria-label="Button colours">
        <span class="tone-label">Buttons</span>
        <div class="seg btn-seg" data-default="${o.buttons[0][0]}">${o.buttons.map(([b, label], k) => `<button type="button" data-btn="${b}" aria-pressed="${k === 0}">${esc(label)}</button>`).join('')}</div>
      </div>
      <div class="tone" role="group" aria-label="Button order">
        <span class="tone-label">Order</span>
        <div class="seg ord-seg">${ORDERS.map(([ord, label], k) => `<button type="button" data-ord="${ord}" aria-pressed="${k === 0}">${esc(label)}</button>`).join('')}</div>
      </div>`;
  const laterSections = LATER.map(r => r.items[0].buttons ? `  <section class="round" aria-labelledby="r${r.n}-title">
    <div class="round-head">
      <p class="eyebrow">Round ${r.n}</p>
      <h2 id="r${r.n}-title">${esc(r.items.map(o => 'Option ' + o.letter).join(' and '))}: ${esc(r.items[0].headline || '')}</h2>
      ${r.items[0].lede ? `<p class="lede">${esc(r.items[0].lede)}</p>` : ''}
      ${buttonControls(r.items[0])}
    </div>
    ${r.items.map(buttonCard).join('')}
  </section>

` : `  <section class="round" aria-labelledby="r${r.n}-title">
    <div class="round-head">
      <p class="eyebrow">Round ${r.n}</p>
      <h2 id="r${r.n}-title">${esc(r.items.map(o => 'Option ' + o.letter).join(' and '))}: ${esc(r.items[0].headline || '')}</h2>
      ${r.items[0].lede ? `<p class="lede">${esc(r.items[0].lede)}</p>` : ''}
      <div class="tone" role="group" aria-label="Footer color">
        <span class="tone-label">Footer</span>
        <div class="seg footer-seg">
        ${footerButtons}
        </div>
      </div>
    </div>
    ${footerCards(r.items, 'r' + r.n)}
  </section>

`).join('');

  return `<title>Divi Homepage Options</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
  /* Layout: one column of option rows; each row = notes on the left, laptop + phone shots on the right. */
  :root {
    --bg: #f2f3f1; --surface: #ffffff; --fg: #2d2d2d; --muted: #63665f; --line: #d9dcd7;
    --accent: #3e7a5b; --accent-fill: #6faf8e; --on-accent: #1f2a24;
    --font: "Helvetica Neue", Helvetica, Inter, system-ui, -apple-system, Arial, sans-serif;
  }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
    --bg: #1d1f1e; --surface: #272a28; --fg: #eeeeeb; --muted: #a4a8a2; --line: #3a3d3b;
    --accent: #8cc4a5; --accent-fill: #6faf8e; --on-accent: #1f2a24; color-scheme: dark } }
  :root[data-theme="dark"] {
    --bg: #1d1f1e; --surface: #272a28; --fg: #eeeeeb; --muted: #a4a8a2; --line: #3a3d3b;
    --accent: #8cc4a5; --accent-fill: #6faf8e; --on-accent: #1f2a24; color-scheme: dark }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.55 var(--font); -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1240px; margin: 0 auto; padding-block: 40px 64px;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  header { display: grid; gap: 14px; margin-bottom: 36px; }
  .eyebrow { margin: 0; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; font-size: 12px; color: var(--accent); }
  h1 { margin: 0; font-size: clamp(28px, 4vw, 40px); line-height: 1.1; letter-spacing: -.01em; text-wrap: balance; }
  .lede { margin: 0; max-width: 64ch; color: var(--muted); }
  .tone { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 6px; }
  .tone-label { font-size: 13px; color: var(--muted); }
  .seg { display: inline-flex; padding: 3px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); }
  .seg button { font: 600 13px/1 var(--font); letter-spacing: .02em; color: var(--fg); background: none; border: 0;
    padding: 9px 16px; border-radius: 999px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
  .seg button[aria-pressed="true"] { background: var(--fg); color: var(--bg); }
  .swatch { width: 12px; height: 12px; border-radius: 50%; border: 1px solid var(--line); }
  .opt { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 32px; align-items: start;
    padding-block: 32px; border-top: 1px solid var(--line); }
  .opt-letter { margin: 0 0 4px; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  .round + .round { margin-top: 56px; }
  .round-head { display: grid; gap: 10px; margin-bottom: 20px; }
  .round-head h2 { margin: 0; font-size: clamp(22px, 3vw, 30px); line-height: 1.15; text-wrap: balance; }
  h3 { margin: 0 0 10px; font-size: 24px; line-height: 1.2; }
  .opt-summary { margin: 0 0 18px; }
  .open { display: inline-flex; gap: 6px; align-items: center; padding: 10px 18px; border-radius: 999px;
    background: var(--accent-fill); color: var(--on-accent); font-weight: 700; font-size: 14px; text-decoration: none; }
  .open:hover { filter: brightness(1.06); }
  .shots { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 200px); gap: 20px; align-items: end; }
  figure { margin: 0; display: grid; gap: 8px; }
  figure img { display: block; width: 100%; height: auto; max-width: 100%; background: #2d2d2d;
    border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08); }
  .desk img { border-radius: 10px; }
  .phone img { border-radius: 22px; }
  figcaption { font-size: 12px; color: var(--muted); letter-spacing: .02em; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  @media (max-width: 880px) {
    .opt { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  }
  @media (max-width: 520px) {
    .shots { grid-template-columns: minmax(0, 1fr); }
    .phone { max-width: 240px; justify-self: center; }
  }
</style>
@@SPLIT@@
<div class="wrap">
  <header>
    <p class="eyebrow">justdivi.com</p>
    <h1>Divi homepage options</h1>
    <p class="lede">Layouts that put the table photo and DIVI back on top, with the animation, buttons and footer below it.
      The newest round is at the top; earlier rounds are below it for comparison.
      Use &ldquo;Open live page&rdquo; to see the animation running; it works on your phone too.</p>
  </header>

${laterSections}  <section class="round" aria-labelledby="r2-title">
    <div class="round-head">
      <p class="eyebrow">Round 2</p>
      <h2 id="r2-title">C and D on white, with a gray footer</h2>
      <p class="lede">Charcoal matches the animation card. Light gray is one step darker than the white. Both still fit on one screen.</p>
      <div class="tone" role="group" aria-label="Footer color">
        <span class="tone-label">Footer</span>
        <div class="seg footer-seg">
        ${footerButtons}
        </div>
      </div>
    </div>
    ${r2cards}
  </section>

  <section class="round" aria-labelledby="r1-title">
    <div class="round-head">
      <p class="eyebrow">Round 1</p>
      <h2 id="r1-title">All four layouts</h2>
      <p class="lede">With gray, the animation blends into the background. With white or sage, it sits on a rounded charcoal card.</p>
      <div class="tone" role="group" aria-label="Background under the photo">
        <span class="tone-label">Background under the photo</span>
        <div class="seg" id="tone-seg">
          <button type="button" data-tone="gray" aria-pressed="true"><span class="swatch" style="background:#2d2d2d"></span>Gray</button>
          <button type="button" data-tone="white" aria-pressed="false"><span class="swatch" style="background:#ffffff"></span>White</button>
          <button type="button" data-tone="sage" aria-pressed="false"><span class="swatch" style="background:#24382e"></span>Sage</button>
        </div>
      </div>
    </div>
    ${cards}
  </section>
</div>
<script>
  (function () {
    var PREFIX = ${JSON.stringify(prefix)};
    var TONES = ['gray', 'white', 'sage'];
    function setTone(t) {
      if (TONES.indexOf(t) < 0) t = 'gray';
      document.querySelectorAll('#tone-seg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tone === t)); });
      document.querySelectorAll('img[data-slug]').forEach(function (img) {
        img.src = PREFIX + 'shots/' + img.dataset.slug + '/' + t + '-' + img.dataset.kind + '.jpg';
      });
      document.querySelectorAll('a.open[data-slug]').forEach(function (a) {
        a.href = PREFIX + a.dataset.slug + '/index.html?tone=' + t;
      });
      try { localStorage.setItem('divi-gallery-tone', t); } catch (e) {}
    }
    document.querySelectorAll('#tone-seg button').forEach(function (b) {
      b.addEventListener('click', function () { setTone(b.dataset.tone); });
    });
    function setFooter(section, f) {
      section.querySelectorAll('.footer-seg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.footer === f)); });
      section.querySelectorAll('img[data-fslug]').forEach(function (img) {
        img.src = PREFIX + 'shots/' + img.dataset.fslug + '/white' + (f ? '-footer-' + f : '') + '-' + img.dataset.kind + '.jpg';
      });
      section.querySelectorAll('a.open[data-fslug]').forEach(function (a) {
        a.href = PREFIX + a.dataset.fslug + '/index.html?tone=white' + (f ? '&footer=' + f : '');
      });
    }
    function setButtons(section) {
      var b = section.querySelector('.btn-seg [aria-pressed="true"]').dataset.btn;
      var ord = section.querySelector('.ord-seg [aria-pressed="true"]').dataset.ord;
      section.querySelectorAll('img[data-bslug]').forEach(function (img) {
        img.src = PREFIX + 'shots/' + img.dataset.bslug + '/btn-' + b + '-' + ord + '-' + img.dataset.kind + '.jpg';
      });
      section.querySelectorAll('a.open[data-bslug]').forEach(function (a) {
        var def = section.querySelector('.btn-seg').dataset.default;
        a.href = PREFIX + a.dataset.bslug + '/index.html?tone=white&footer=charcoal' + (b !== def ? '&buttons=' + b : '') + (ord !== 'im' ? '&order=whatsapp-first' : '');
      });
    }
    document.querySelectorAll('.btn-seg button, .ord-seg button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === btn)); });
        setButtons(btn.closest('.round'));
      });
    });
    document.querySelectorAll('.footer-seg button').forEach(function (b) {
      b.addEventListener('click', function () { setFooter(b.closest('.round'), b.dataset.footer); });
    });
    var start = location.hash.slice(1);
    if (TONES.indexOf(start) < 0) { try { start = localStorage.getItem('divi-gallery-tone'); } catch (e) {} }
    if (start) setTone(start);
  })();
</script>`;
}

const local = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${body('').replace('@@SPLIT@@', '</head>\n<body>')}
</body>
</html>
`;
fs.writeFileSync(path.join(DESIGNS, 'index.html'), local);
fs.mkdirSync(path.join(OUT, 'artifact'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'artifact', 'index.html'), body('designs/').replace('@@SPLIT@@\n', ''));
console.log('wrote', path.join(DESIGNS, 'index.html'), 'and', path.join(OUT, 'artifact', 'index.html'));
