// Builds the logo-concepts gallery from data/logos.json + the logo-shot.mjs renders in $OUT/logo-shots
// (OUT: see lib.mjs). Needs macOS `sips` for the JPEGs.
// Usage (from the repo root): node designs/tools/logo-gallery.mjs
//   LOGOS=logos-r3.json DEE=dee.json FORK=1 node designs/tools/logo-gallery.mjs   (LOGOS/DEE: files in data/)
// Writes designs/logos/<id>/preview/*.jpg, designs/logos/index.html (local, full document) and
// $OUT/logo-artifact/index.html (artifact page body: the publish skeleton supplies doctype/head/body).
// logos.json: { recommendation, concepts: [{ id, name, direction, idea, rationale, siteIcon, rank, score, verdict, concerns }] }
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { DESIGNS, DATA, OUT } from './lib.mjs';

const LOGOS = path.join(DESIGNS, 'logos');
const data = JSON.parse(fs.readFileSync(path.resolve(DATA, process.env.LOGOS || 'logos.json'), 'utf8'));
const concepts = [...data.concepts].sort((a, b) => a.rank - b.rank);

// Context screenshots as small JPEGs inside each concept folder.
for (const c of concepts) {
  const out = path.join(LOGOS, c.id, 'preview');
  fs.mkdirSync(out, { recursive: true });
  for (const [src, dst, max] of [['hero-crop.png', 'hero.jpg', '1200'], ['context-c-desk.png', 'c-desk.jpg', '1280'],
    ['context-e-phone.png', 'e-phone.jpg', '560']]) {
    const from = path.join(OUT, 'logo-shots', c.id, src);
    if (!fs.existsSync(from)) throw new Error('missing ' + from);
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '74', '-Z', max, from, '--out', path.join(out, dst)], { stdio: 'ignore' });
  }
}

// Optional stylised-D round (DEE=dee.json): colourway matrices built from each concept's generated SVGs.
const DEE_COLORWAYS = [['blue', 'Original blue'], ['sage', 'Sage on white'], ['sage-dark', 'Sage on charcoal'], ['charcoal', 'Charcoal'], ['white-sage', 'White on sage']];
const dee = process.env.DEE ? JSON.parse(fs.readFileSync(path.resolve(DATA, process.env.DEE), 'utf8')) : null;
for (const c of dee ? dee.concepts : []) {
  const outDir = path.join(LOGOS, c.id, 'preview');
  fs.mkdirSync(outDir, { recursive: true });
  // dee-hero-corner.png comes from tools/dee-corner.mjs (option E's top-left corner, 720x400 at 2x).
  const tmp = path.join(OUT, 'logo-shots', c.id, 'dee-hero-corner.png');
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '720', tmp, '--out', path.join(outDir, 'dee-hero.jpg')], { stdio: 'ignore' });
}

// Optional "Fork on dark backgrounds" round (FORK=1): live SVGs from designs/logos/fork-dark plus homepage-corner crops.
const FORK = process.env.FORK ? [
  ['original', 'Original', 'The light-background Fork as it was: charcoal, sage and dark sage. On dark backgrounds the charcoal piece disappears.'],
  ['thin', 'Thin outline', 'A thin white line around each of the three pieces, following their contours.'],
  ['medium', 'Medium outline', 'The same contour outline, a little heavier, so it holds up at small sizes.'],
  ['heavy', 'Heavy outline', 'A bolder contour outline; the three outlines still stay separate.'],
  ['sticker', 'Sticker', 'The outlines grow until they merge into one white backing around the whole shape.'],
  ['disc', 'White circle', 'A white circle behind the logo, laid out exactly like the original round app icon.'],
] : null;
if (FORK) {
  const outDir = path.join(LOGOS, 'fork-dark', 'preview');
  fs.mkdirSync(outDir, { recursive: true });
  for (const [v] of FORK) execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-Z', '600',
    path.join(OUT, 'logo-shots', 'fork-dark', `hero-${v}.png`), '--out', path.join(outDir, `hero-${v}.jpg`)], { stdio: 'ignore' });
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function deeSection(base, icon) {
  const tmBlock = (label, t) => t ? `
      <div class="tm">
        <p class="tm-head"><span class="risk risk-${esc(t.risk)}">${esc(t.risk)} risk</span> ${label}</p>
        <p>${esc(t.summary)}</p>
        ${t.closestMarks && t.closestMarks.length ? `<ul class="marks">${t.closestMarks.slice(0, 3).map(m => `<li>${m.url
          ? `<a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.name)}</a>` : esc(m.name)} <span class="sim">${esc(m.industry)} &middot; ${esc(m.similarity)} similarity</span></li>`).join('')}</ul>` : ''}
      </div>` : '';
  const cell = (id, kase, cw) => {
    const f = `${base}${esc(id)}/${kase}-${cw}.svg`;
    return `<td><div class="dcell">
        <img class="big" src="${f}" alt="">
        <img class="circle" src="${f}" width="40" height="40" alt="">
        <span class="tab"><img src="${f}" width="16" height="16" alt="">Divi</span>
      </div></td>`;
  };
  const concepts = dee.concepts.map(c => `
    <section class="dee" id="${esc(c.id)}" aria-labelledby="${esc(c.id)}-name">
      <div class="notes">
        <h3 id="${esc(c.id)}-name">${esc(c.name)}</h3>
        <p>${esc(c.idea)}</p>
        <p class="why">${esc(c.howItRelatesToC)}</p>
        ${tmBlock('Uppercase D, trademark screen', c.trademark && c.trademark.upper)}
        ${tmBlock('Lowercase d, trademark screen', c.trademark && c.trademark.lower)}
      </div>
      <div class="dvis">
        <div class="mtx-scroll"><table class="mtx">
          <thead><tr><th></th><th>Uppercase D</th><th>Lowercase d</th></tr></thead>
          <tbody>${DEE_COLORWAYS.map(([cw, label]) => `<tr><th scope="row">${label}</th>${cell(c.id, 'upper', cw)}${cell(c.id, 'lower', cw)}</tr>`).join('')}</tbody>
        </table></div>
        <figure class="wide"><img src="${base}${esc(c.id)}/preview/dee-hero.jpg" width="720" height="400" loading="lazy" alt="The ${esc(c.name)} uppercase D, sage on charcoal, at the top left of option E"><figcaption>Uppercase D, sage on charcoal, at the top left of option E</figcaption></figure>
      </div>
    </section>`).join('\n');
  return `
  <section class="round" aria-labelledby="dee-title">
    <div class="round-head">
      <p class="eyebrow">Round 4</p>
      <h2 id="dee-title">Stylised D</h2>
      <p class="lede">${esc(dee.lede)}</p>
      <figure class="ref"><img src="${icon}" width="72" height="70" alt="The original Cologne C icon"><figcaption>The original Cologne C, for reference</figcaption></figure>
    </div>
    ${concepts}
  </section>`;
}

function forkSection(base, photo) {
  const f = n => `${base}fork-dark/${n}`;
  const bgs = [['var(--tile-light)', 'White', true], ['#ecebe8', 'Light gray', false], ['#2d2d2d', 'Charcoal', false], ['#24382e', 'Deep sage', false],
    [`linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url('${photo}') center/cover`, 'Photo', false]];
  const rows = FORK.map(([v, name, desc]) => `
      <tr>
        <th scope="row"><span class="fname">${esc(name)}</span><span class="fdesc">${esc(desc)}</span></th>
        ${bgs.map(([bg, , border]) => `<td><div class="fbg${border ? ' bordered' : ''}" style="background:${bg}"><img src="${f(v + '-mark.svg')}" alt=""></div></td>`).join('')}
        <td><div class="fapps"><img src="${f(v + '-app.svg')}" width="64" height="64" style="border-radius:15px" alt=""><img src="${f(v + '-app.svg')}" width="40" height="40" style="border-radius:50%" alt="">
          <span class="tab light"><img src="${f(v + '-mark.svg')}" width="16" height="16" alt="">Divi</span><span class="tab dark"><img src="${f(v + '-mark.svg')}" width="16" height="16" alt="">Divi</span></div></td>
        <td><img class="fhero" src="${f('preview/hero-' + v + '.jpg')}" width="300" height="143" loading="lazy" alt="${esc(name)} at the top left of option E"></td>
      </tr>`).join('');
  return `
  <section class="round" aria-labelledby="fork-title">
    <div class="round-head">
      <p class="eyebrow">Fork, dark backgrounds</p>
      <h2 id="fork-title">Fork in charcoal and two greens, on any background</h2>
      <p class="lede">The version you liked, with a white edge so the charcoal piece still shows on dark backgrounds. The outlines follow each of the three pieces' contours. On white the edge disappears, and the app icon and chat avatar are plain white with no dark shape behind the logo.</p>
    </div>
    <div class="mtx-scroll"><table class="mtx fork">
      <thead><tr><th></th>${bgs.map(([, label]) => `<th>${label}</th>`).join('')}<th>App icon · avatar · tabs</th><th>Homepage corner</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>`;
}

function body(base, photo, icon) {
  const cards = concepts.map(c => {
    const f = n => `${base}${esc(c.id)}/${n}`;
    const has = n => fs.existsSync(path.join(LOGOS, c.id, n));
    const word = has('logotype.svg') ? 'logotype' : 'lockup';
    const wordRev = has(`${word}-reverse.svg`) ? `${word}-reverse.svg` : null;
    const concerns = (c.concerns || []).map(x => `<li>${esc(x)}</li>`).join('');
    const tm = c.trademark;
    const tmBlock = tm ? `
        <div class="tm">
          <p class="tm-head"><span class="risk risk-${esc(tm.risk)}">${esc(tm.risk)} risk</span> Trademark screen</p>
          <p>${esc(tm.summary)}</p>
          ${tm.closestMarks && tm.closestMarks.length ? `<ul class="marks">${tm.closestMarks.slice(0, 3).map(m => `<li>${m.url
            ? `<a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.name)}</a>` : esc(m.name)} <span class="sim">${esc(m.industry)} &middot; ${esc(m.similarity)} similarity</span></li>`).join('')}</ul>` : ''}
        </div>` : '';
    return `
    <section class="concept" id="${esc(c.id)}" aria-labelledby="${esc(c.id)}-name">
      <div class="notes">
        <p class="meta">${c.score != null ? `<span class="rank">#${c.rank}</span> ` : ''}${esc(c.direction)}${c.score != null ? ` &middot; panel score ${esc(c.score)}/10` : ''}</p>
        <h2 id="${esc(c.id)}-name">${esc(c.name)}</h2>
        <p>${esc(c.idea)}</p>
        <p class="why">${esc(c.rationale)}</p>
        ${c.verdict ? `<p class="verdict"><strong>${esc(c.verdictLabel || 'Panel')}:</strong> ${esc(c.verdict)}</p>` : ''}
        ${concerns ? `<ul class="concerns">${concerns}</ul>` : ''}
        ${tmBlock}
      </div>
      <div class="visuals">
        <div class="tiles">
          <figure><div class="tile light"><img src="${f('mark.svg')}" alt="${esc(c.name)} mark on white"></div><figcaption>On white</figcaption></figure>
          <figure><div class="tile icon"><img src="${f('app-icon.svg')}" alt="${esc(c.name)} app icon"></div><figcaption>App icon</figcaption></figure>
          <figure><div class="tile photo" style="background-image:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url('${photo}')"><img src="${f('mark-mono.svg')}" alt="${esc(c.name)} one-colour mark on the photo"></div><figcaption>One colour</figcaption></figure>
          <figure><div class="tile sizes">
              <img class="circle" src="${f('app-icon.svg')}" width="72" height="72" alt="${esc(c.name)} as a round chat avatar">
              <img class="circle" src="${f('app-icon.svg')}" width="40" height="40" alt="">
              <span class="tab"><img src="${f('app-icon.svg')}" width="16" height="16" alt="">Divi</span>
            </div><figcaption>Avatar &middot; 40px &middot; tab</figcaption></figure>
        </div>
        <div class="words">
          <figure><div class="word light"><img src="${f(word + '.svg')}" alt="${esc(c.name)} with the DIVI wordmark on white"></div></figure>
          ${wordRev ? `<figure><div class="word dark"><img src="${f(wordRev)}" alt="${esc(c.name)} with the DIVI wordmark on charcoal"></div></figure>` : ''}
        </div>
        <div class="context">
          <figure class="wide"><img src="${f('preview/hero.jpg')}" width="1200" height="480" loading="lazy" alt="Top-left of the homepage with the ${esc(c.name)} icon"><figcaption>Homepage corner</figcaption></figure>
          <figure class="ph"><img src="${f('preview/e-phone.jpg')}" width="329" height="560" loading="lazy" alt="Option E on a phone with the ${esc(c.name)} icon"><figcaption>Option E, phone</figcaption></figure>
        </div>
      </div>
    </section>`;
  }).join('\n');

  return `<title>Divi Logo Concepts</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
  /* Layout: ranked concept rows; notes on the left, the live SVG tiles and homepage context on the right. */
  :root {
    --bg: #f2f3f1; --surface: #ffffff; --fg: #2d2d2d; --muted: #63665f; --line: #d9dcd7;
    --accent: #3e7a5b; --tile-light: #fafaf8; --tile-dark: #2d2d2d;
    --ok-bg: #dcefe4; --ok-fg: #24573c; --warn-bg: #f6e7c8; --warn-fg: #6b4a0e; --bad-bg: #f5d5d0; --bad-fg: #7a2318;
    --font: "Helvetica Neue", Helvetica, Inter, system-ui, -apple-system, Arial, sans-serif;
  }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
    --bg: #1d1f1e; --surface: #272a28; --fg: #eeeeeb; --muted: #a4a8a2; --line: #3a3d3b; --accent: #8cc4a5;
    --ok-bg: #23402f; --ok-fg: #a8dcbd; --warn-bg: #4a3a17; --warn-fg: #f0d394; --bad-bg: #4d2420; --bad-fg: #f3b3a9; color-scheme: dark } }
  :root[data-theme="dark"] {
    --bg: #1d1f1e; --surface: #272a28; --fg: #eeeeeb; --muted: #a4a8a2; --line: #3a3d3b; --accent: #8cc4a5;
    --ok-bg: #23402f; --ok-fg: #a8dcbd; --warn-bg: #4a3a17; --warn-fg: #f0d394; --bad-bg: #4d2420; --bad-fg: #f3b3a9; color-scheme: dark }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.55 var(--font); -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1240px; margin: 0 auto; padding-block: 40px 64px;
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
  header { display: grid; gap: 14px; margin-bottom: 28px; }
  .eyebrow { margin: 0; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; font-size: 12px; color: var(--accent); }
  h1 { margin: 0; font-size: clamp(28px, 4vw, 40px); line-height: 1.1; letter-spacing: -.01em; text-wrap: balance; }
  .lede { margin: 0; max-width: 66ch; color: var(--muted); }
  .rec { margin: 0; max-width: 78ch; padding: 14px 18px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }
  .concept { display: grid; grid-template-columns: minmax(0, 320px) minmax(0, 1fr); gap: 32px; padding-block: 32px; border-top: 1px solid var(--line); }
  .notes p { margin: 0 0 10px; }
  .meta { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .rank { display: inline-block; min-width: 2.2em; padding: 2px 7px; margin-right: 4px; border-radius: 999px; background: var(--fg); color: var(--bg); text-align: center; letter-spacing: .02em; }
  h2 { margin: 0 0 10px; font-size: 24px; line-height: 1.2; text-wrap: balance; }
  .why { color: var(--muted); }
  .verdict { padding-top: 6px; }
  .concerns { margin: 0; padding-left: 18px; color: var(--muted); font-size: 13.5px; }
  .concerns li + li { margin-top: 4px; }
  .tm { margin-top: 16px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); font-size: 13.5px; }
  .tm p { margin: 0 0 8px; }
  .tm-head { font-weight: 700; display: flex; gap: 8px; align-items: center; }
  .risk { padding: 2px 8px; border-radius: 999px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
  .risk-low { background: var(--ok-bg); color: var(--ok-fg); }
  .risk-medium { background: var(--warn-bg); color: var(--warn-fg); }
  .risk-high { background: var(--bad-bg); color: var(--bad-fg); }
  .marks { margin: 0; padding-left: 18px; }
  .marks li + li { margin-top: 4px; }
  .marks a { color: var(--accent); }
  .sim { color: var(--muted); }
  .visuals { display: grid; gap: 16px; min-width: 0; align-content: start; }
  .round + .round { margin-top: 48px; }
  .round-head { display: grid; gap: 10px; margin-bottom: 16px; }
  .round-head h2 { margin: 0; font-size: clamp(22px, 3vw, 30px); line-height: 1.15; }
  .ref { display: flex; align-items: center; gap: 12px; }
  .ref img { border-radius: 14px; }
  .dee { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 28px; padding-block: 28px; border-top: 1px solid var(--line); }
  .dee h3 { margin: 0 0 10px; font-size: 24px; line-height: 1.2; }
  .dee .notes p { margin: 0 0 10px; }
  .dvis { display: grid; gap: 14px; min-width: 0; align-content: start; }
  .mtx-scroll { overflow-x: auto; }
  .mtx { border-collapse: separate; border-spacing: 8px 8px; margin: -8px; }
  .mtx th { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); text-align: left; white-space: nowrap; padding-right: 6px; }
  .mtx thead th { text-align: center; }
  .dcell { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; }
  .dcell .big { width: 88px; height: 88px; border-radius: 20px; }
  .dvis .wide { max-width: 360px; }
  .dvis .wide img { display: block; width: 100%; max-width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--line); }
  .mtx.fork th[scope="row"] { white-space: normal; min-width: 150px; max-width: 190px; text-transform: none; letter-spacing: 0; vertical-align: middle; }
  .fname { display: block; font-size: 15px; color: var(--fg); margin-bottom: 4px; }
  .fdesc { display: block; font-size: 12.5px; font-weight: 400; color: var(--muted); line-height: 1.4; }
  .fbg { width: 104px; height: 104px; border-radius: 14px; display: grid; place-items: center; }
  .fbg.bordered { border: 1px solid var(--line); }
  .fbg img { width: 82px; height: 82px; }
  .fapps { display: flex; gap: 10px; align-items: center; padding: 10px 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; }
  .tab.light { background: #dee1e6; color: #222; }
  .tab.dark { background: #35363a; color: #e8eaed; }
  .fhero { display: block; width: 220px; height: auto; border-radius: 10px; }
  .tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  figure { margin: 0; display: grid; gap: 6px; min-width: 0; align-content: start; }
  figcaption { font-size: 12px; color: var(--muted); letter-spacing: .02em; }
  .tile { aspect-ratio: 1; max-width: 100%; border-radius: 12px; display: grid; place-items: center; overflow: hidden; }
  .tile > img:only-child { width: 62%; height: 62%; }
  .tile.light { background: var(--tile-light); border: 1px solid var(--line); }
  .tile.icon > img { width: 100%; height: 100%; }
  .words { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .word { height: 96px; border-radius: 12px; display: grid; place-items: center; padding: 16px 20px; }
  .word img { max-width: 100%; max-height: 52px; }
  .word.light { background: var(--tile-light); border: 1px solid var(--line); }
  .word.dark { background: var(--tile-dark); }
  .tile.photo { background-size: cover; background-position: center; }
  .tile.sizes { background: var(--surface); border: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center; align-content: center; padding: 8px; }
  .circle { border-radius: 50%; }
  .tab { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 6px; background: var(--bg); font-size: 12px; font-weight: 500; }
  .tab img { border-radius: 3px; }
  .context { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 150px); gap: 12px; align-items: end; }
  .context img { display: block; width: 100%; height: auto; max-width: 100%; border: 1px solid var(--line); background: #2d2d2d; }
  .wide img { border-radius: 10px; }
  .ph img { border-radius: 18px; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  @media (max-width: 900px) { .concept, .dee { grid-template-columns: minmax(0, 1fr); gap: 18px; } }
  @media (max-width: 560px) {
    .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dcell .big { width: 64px; height: 64px; border-radius: 15px; }
    .words { grid-template-columns: minmax(0, 1fr); }
    .context { grid-template-columns: minmax(0, 1fr); }
    .ph { max-width: 200px; }
  }
</style>
@@SPLIT@@
<div class="wrap">
  <header>
    <p class="eyebrow">justdivi.com</p>
    <h1>Divi logo concepts</h1>
    <p class="lede">${data.lede ? esc(data.lede) : `${concepts.length} concepts for a Divi mark to replace the old Cologne &ldquo;C&rdquo;, ranked by the review panel.`}
      Each shows the mark on white, as an app icon, on the table photo, as a round chat avatar (how most people will see it in WhatsApp and iMessage),
      and in the corner of the homepage. Nothing on the site has changed.</p>
    ${data.recommendation ? `<p class="rec"><strong>${esc(data.recLabel || 'Panel recommendation')}:</strong> ${esc(data.recommendation)}</p>` : ''}
  </header>
  ${dee ? deeSection(base, icon) : ''}
  ${FORK ? forkSection(base, photo) : ''}
  ${dee || FORK ? `<section class="round" aria-labelledby="older-title"><div class="round-head"><p class="eyebrow">${esc(data.olderEyebrow || 'Earlier')}</p><h2 id="older-title">${esc(data.olderTitle || 'Earlier concepts')}</h2></div>${cards}</section>` : cards}
</div>`;
}

const local = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${body('', '../../assets/img/table.jpg', 'cologne-c.png').replace('@@SPLIT@@', '</head>\n<body>')}
</body>
</html>
`;
fs.writeFileSync(path.join(LOGOS, 'index.html'), local);
fs.mkdirSync(path.join(OUT, 'logo-artifact'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'logo-artifact', 'index.html'), body('logos/', 'img/table.jpg', 'logos/cologne-c.png').replace('@@SPLIT@@\n', ''));
console.log('wrote', path.join(LOGOS, 'index.html'), 'and', path.join(OUT, 'logo-artifact', 'index.html'));
