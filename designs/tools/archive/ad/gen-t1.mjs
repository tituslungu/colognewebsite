// table-1 "Table for Two": a long table seen from above (sage slab) with two
// diners facing each other across it. Each diner sits at the middle of their
// own half of the table (x = +/- L/4), so the pair sits kitty-corner: a divide
// sign that has turned into two people sharing a table.
// Usage: node gen-t1.mjs [markScale] [iconScale] [lockupMarkH]
import fs from 'fs';
import path from 'path';
import { wordmark } from './wordmark.mjs';

const DIR = '/Users/titus/repos/colognewebsite/designs/logos/table-1';
const K = '#2D2D2D', S = '#6FAF8E', W = '#FAFAF8', WHITE = '#FFFFFF';
const n = v => +(+v).toFixed(2);

// Everything comes from one unit u, the diameter of a diner:
//   table: 3.5u long, 1u thick, corners u/4;  gap between diner and table: u/5;
//   each diner is centred on their own half of the table (x = +/- L/4).
const u = 52;
export const G = { L: 3.5 * u, t: u, rx: u / 4, r: u / 2, gap: u / 5 };
G.dx = G.L / 4;
G.dy = G.t / 2 + G.gap + G.r;         // diner centre from the table's centre line
const halfW = G.L / 2;                // 91
const halfH = G.dy + G.r;             // 88.4

const doc = (body, title, vb = '0 0 256 256') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}">\n<title>${title}</title>\n${body}\n</svg>\n`;
const circ = (x, y, r, f) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${f}"/>`;

function glyph({ s = 1, cx = 128, cy = 128, table, diner }) {
  const w = G.L * s, h = G.t * s;
  return [
    `<rect x="${n(cx - w / 2)}" y="${n(cy - h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(G.rx * s)}" fill="${table}"/>`,
    circ(cx - G.dx * s, cy - G.dy * s, G.r * s, diner),
    circ(cx + G.dx * s, cy + G.dy * s, G.r * s, diner),
  ].join('\n');
}

const markS = +(process.argv[2] || 112 / halfW);   // standalone: 16 units clear each side
const iconS = +(process.argv[3] || 0.88);           // tile: keep inside ~70% of the circle radius
const lockH = +(process.argv[4] || 120);             // lockup symbol height vs 100 cap height

function lockup(ink, table, diner) {
  const s = lockH / (2 * halfH);
  const pad = 8, H = Math.max(lockH, 100) + pad * 2, cy = H / 2;
  const markW = 2 * halfW * s;
  const gap = 48;
  const wm = wordmark({ capH: 100, fill: ink });
  const wx = pad + markW + gap;
  return doc(glyph({ s, cx: pad + markW / 2, cy, table, diner }) +
    `\n<g transform="translate(${n(wx)} ${n(cy - 50)})">${wm.paths}</g>`,
    'Divi', `0 0 ${n(wx + wm.width + pad)} ${n(H)}`);
}

const files = {
  'mark.svg': doc(glyph({ s: markS, table: S, diner: K }), 'Divi mark'),
  'mark-reverse.svg': doc(glyph({ s: markS, table: S, diner: WHITE }), 'Divi mark, for dark backgrounds'),
  'mark-mono.svg': doc(glyph({ s: markS, table: WHITE, diner: WHITE }), 'Divi mark, white'),
  'app-icon.svg': doc(`<rect width="256" height="256" fill="${K}"/>\n` + glyph({ s: iconS, table: S, diner: W }), 'Divi app icon'),
  'lockup.svg': lockup(K, S, K),
  'lockup-reverse.svg': lockup(WHITE, S, WHITE),
};
for (const [name, s] of Object.entries(files)) fs.writeFileSync(path.join(DIR, name), s);
const far = Math.hypot(G.dx, G.dy) + G.r;
console.log('written; furthest point from centre in tile =', n(far * iconS), '=', n(100 * far * iconS / 128) + '% of circle radius');
