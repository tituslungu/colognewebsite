import fs from 'fs';
const V = (await import(process.argv[2])).V;
const CW = [['#FFFFFF', '#FFFFFF', '#2D2D2D', '#2D2D2D'], ['#6FAF8E', '#3E7A5B', '#FFFFFF', '#FFFFFF'], ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'], ['#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD']];
let n = 0, html = `<!doctype html><body style="margin:0;background:#f2f3f1;font:600 12px Helvetica"><table style="border-spacing:8px 6px">`;
for (const [k, body] of Object.entries(V)) {
  html += `<tr><th style="text-align:left;width:110px">${k}</th>`;
  for (const [i, c] of CW.entries()) for (const s of (i < 2 ? [230, 150, 64] : [150, 64])) { n++; html += `<td><svg width="${s}" height="${s}" viewBox="0 0 256 256" style="border-radius:${s * .2}px"><defs><linearGradient id="t${n}" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="i${n}" x1="52" y1="192" x2="222" y2="62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient></defs><rect width="256" height="256" fill="url(#t${n})"/><g fill="none" stroke="url(#i${n})" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg></td>`; }
  html += `</tr>`;
}
fs.writeFileSync(process.argv[3], html + `</table></body>`);
