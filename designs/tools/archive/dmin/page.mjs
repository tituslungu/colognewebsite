import fs from 'fs';
const mod = await import(process.argv[2]);
const V = mod.V;
const CW = [['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2'], ['#FFFFFF', '#FFFFFF', '#2D2D2D', '#2D2D2D'], ['#6FAF8E', '#3E7A5B', '#FFFFFF', '#FFFFFF'], ['#2D2D2D', '#2D2D2D', '#6FAF8E', '#A8DCBD']];
let n = 0;
const svg = (body, c, s) => { n++; return `<svg width="${s}" height="${s}" viewBox="0 0 256 256"><defs><linearGradient id="t${n}" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="i${n}" x1="48" y1="200" x2="214" y2="60" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient></defs><rect width="256" height="256" fill="url(#t${n})"/><g fill="none" stroke="url(#i${n})" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">${body}</g>${process.env.GUIDE ? '<circle cx="128" cy="128" r="128" fill="none" stroke="red" stroke-width="1"/><line x1="128" y1="0" x2="128" y2="256" stroke="red" stroke-width=".7"/><line y1="128" x1="0" y2="128" x2="256" stroke="red" stroke-width=".7"/>' : ''}</svg>`; };
const box = (body, c, s) => `<td><div style="width:${s}px;height:${s}px;border-radius:${s === 40 ? '50%' : s >= 64 ? s * .2 + 'px' : '3px'};overflow:hidden">${svg(body, c, s)}</div></td>`;
let html = `<!doctype html><html><body style="margin:0;background:#f2f3f1;font:600 12px Helvetica"><table style="border-spacing:10px 6px">`;
for (const [k, body] of Object.entries(V)) {
  html += `<tr><th style="text-align:left;width:130px">${k}</th>`;
  for (const c of CW.slice(0, 2)) for (const s of [150, 64, 40, 16]) html += box(body, c, s);
  for (const c of CW.slice(2)) for (const s of [64, 40, 16]) html += box(body, c, s);
  html += `</tr>`;
}
fs.writeFileSync(process.argv[3], html + `</table></body></html>`);
