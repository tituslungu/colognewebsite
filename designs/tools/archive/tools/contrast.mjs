const hex = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = h => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (fg, a, bg) => '#' + hex(fg).map((c, i) => Math.round(c * a + hex(bg)[i] * (1 - a)).toString(16).padStart(2, '0')).join('');
const hsl = h => { const [r, g, b] = hex(h).map(c => c / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let H = 0; if (d) H = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  const l = (mx + mn) / 2, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0; return `h${Math.round((H + 360) % 360)} s${Math.round(s * 100)} l${Math.round(l * 100)}`; };
const pairs = JSON.parse(process.argv[2]);
for (const [a, b, note = ''] of pairs) {
  const bb = b.includes('@') ? (() => { const [fg, al, bg] = b.split('@'); return mix(fg, +al, bg); })() : b;
  console.log(`${a} (${hsl(a)}) on ${bb} (${hsl(bb)}): ${cr(a, bb).toFixed(2)}  ${note}`);
}
