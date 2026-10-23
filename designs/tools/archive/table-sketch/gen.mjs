// Generates the table-1 and table-2 logo files from computed geometry.
// Usage: node gen.mjs
import fs from 'fs';
import path from 'path';
import { wordmark } from './wordmark.mjs';

const ROOT = '/Users/titus/repos/colognewebsite/designs/logos';
const K = '#2D2D2D', S = '#6FAF8E', W = '#FAFAF8', WHITE = '#FFFFFF';
const n = v => +(+v).toFixed(2);
const rad = d => d * Math.PI / 180;
const doc = (body, title, vb = '0 0 256 256') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}">\n<title>${title}</title>\n${body}\n</svg>\n`;
const circ = (x, y, r, f) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${f}"/>`;
const tile = `<rect width="256" height="256" fill="${K}"/>\n`;

function write(id, files) {
  const dir = path.join(ROOT, id);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, s] of Object.entries(files)) {
    const p = path.join(dir, name);
    if (s === null) { if (fs.existsSync(p)) fs.unlinkSync(p); }
    else fs.writeFileSync(p, s);
  }
}

// Horizontal lockup: symbol, then the DIVI wordmark (cap height 100).
// `draw(s, cx, cy, ink)` draws the symbol at scale s centred on cx, cy.
function lockup(draw, halfW, halfH, ink, markH = 132, gap = 52) {
  const s = markH / (2 * halfH);
  const pad = 8, H = markH + pad * 2, cy = H / 2;
  const markW = 2 * halfW * s;
  const wm = wordmark({ capH: 100, fill: ink });
  const wx = pad + markW + gap;
  return doc(draw(s, pad + markW / 2, cy, ink) +
    `\n<g transform="translate(${n(wx)} ${n(cy - 50)})">${wm.paths}</g>`,
    'Divi', `0 0 ${n(wx + wm.width + pad)} ${n(H)}`);
}

// ---------------------------------------------------------------- table-1
// "Table for Two": the divide sign read as a table for two seen from above,
// a long table (rounded bar) with a diner on each side.
const T1 = { barW: 164, barH: 38, r: 26, gap: 12 };
function tableForTwo({ s = 1, cx = 128, cy = 128, bar, top, bot = top }) {
  const { barW, barH, r, gap } = T1;
  const w = barW * s, h = barH * s, d = (barH / 2 + gap + r) * s;
  return [
    `<rect x="${n(cx - w / 2)}" y="${n(cy - h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(h / 2)}" fill="${bar}"/>`,
    circ(cx, cy - d, r * s, top),
    circ(cx, cy + d, r * s, bot),
  ].join('\n');
}
{
  const halfH = T1.barH / 2 + T1.gap + 2 * T1.r, halfW = T1.barW / 2;
  const ms = 112 / halfH; // standalone marks fill the 256 box with ~16 padding
  const draw = (s, cx, cy, ink) => tableForTwo({ s, cx, cy, bar: S, top: ink });
  write('table-1', {
    'mark.svg': doc(tableForTwo({ s: ms, bar: S, top: K }), 'Divi mark'),
    'mark-reverse.svg': doc(tableForTwo({ s: ms, bar: S, top: WHITE }), 'Divi mark, for dark backgrounds'),
    'mark-mono.svg': doc(tableForTwo({ s: ms, bar: WHITE, top: WHITE }), 'Divi mark, white'),
    'app-icon.svg': doc(tile + tableForTwo({ s: 1, bar: S, top: W }), 'Divi app icon'),
    'lockup.svg': lockup(draw, halfW, halfH, K),
    'lockup-reverse.svg': lockup(draw, halfW, halfH, WHITE),
    'site-icon.svg': null, // the app icon tile sits top-left on the photo
  });
}

// ---------------------------------------------------------------- table-2
// "Gather Round": a round table seen from above with four diners pulled up
// to it. A thin cut separates each diner from the table, like the overlapping
// avatars on the receipt screen. Seats sit 22.5 degrees off the axes, halfway
// between square and diagonal, so the group reads as gathered (not as corner
// handles or a dice face).
const T2 = { tableR: 52, dinerR: 21, R: 69, cut: 6, start: -67.5, seats: 4 };
const seatAngles = () => Array.from({ length: T2.seats }, (_, i) => T2.start + i * 360 / T2.seats);
function tableOfFour({ s = 1, cx = 128, cy = 128, table, diner }) {
  const { tableR, dinerR, R, cut } = T2;
  const T = tableR * s, Rs = R * s, Nr = (dinerR + cut) * s;
  // Where each notch circle meets the table edge, as an angle either side of the seat.
  const phi = Math.acos((T * T + Rs * Rs - Nr * Nr) / (2 * T * Rs)) * 180 / Math.PI;
  const at = (r, deg, ox = cx, oy = cy) => `${n(ox + r * Math.cos(rad(deg)))} ${n(oy + r * Math.sin(rad(deg)))}`;
  const angs = seatAngles();
  let d = `M${at(T, angs[0] + phi)}`;
  angs.forEach((a, i) => {
    const next = angs[(i + 1) % angs.length];
    d += `A${n(T)} ${n(T)} 0 0 1 ${at(T, next - phi)}`;  // table edge to the next seat
    d += `A${n(Nr)} ${n(Nr)} 0 0 0 ${at(T, next + phi)}`; // concave cut around that seat
  });
  d += 'Z';
  const seats = angs.map(a => circ(cx + Rs * Math.cos(rad(a)), cy + Rs * Math.sin(rad(a)), dinerR * s, diner));
  return [`<path fill="${table}" d="${d}"/>`, ...seats].join('\n');
}
{
  const angs = seatAngles();
  const halfW = Math.max(T2.tableR, ...angs.map(a => Math.abs(T2.R * Math.cos(rad(a))) + T2.dinerR));
  const halfH = Math.max(T2.tableR, ...angs.map(a => Math.abs(T2.R * Math.sin(rad(a))) + T2.dinerR));
  const ms = 112 / Math.max(halfW, halfH);
  const draw = (s, cx, cy, ink) => tableOfFour({ s, cx, cy, table: S, diner: ink });
  write('table-2', {
    'mark.svg': doc(tableOfFour({ s: ms, table: S, diner: K }), 'Divi mark'),
    'mark-reverse.svg': doc(tableOfFour({ s: ms, table: S, diner: WHITE }), 'Divi mark, for dark backgrounds'),
    'mark-mono.svg': doc(tableOfFour({ s: ms, table: WHITE, diner: WHITE }), 'Divi mark, white'),
    'app-icon.svg': doc(tile + tableOfFour({ s: 0.95, table: S, diner: W }), 'Divi app icon'),
    'lockup.svg': lockup(draw, halfW, halfH, K, 128),
    'lockup-reverse.svg': lockup(draw, halfW, halfH, WHITE, 128),
    'site-icon.svg': null,
  });
}
console.log('written');
