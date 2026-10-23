import fs from 'fs';
const V = (await import(process.argv[2])).V;
const CW = [['#FFFFFF', '#FFFFFF', '#2D2D2D', '#2D2D2D'], ['#6FAF8E', '#3E7A5B', '#FFFFFF', '#FFFFFF'], ['#DEF8FB', '#A6E5F7', '#1151FE', '#05DFF2']];
let n = 0, html = `<!doctype html><body style="margin:0;background:#f2f3f1;font:600 12px Helvetica"><div style="display:flex;flex-wrap:wrap;gap:14px;padding:10px">`;
for (const [k, body] of Object.entries(V)) {
  html += `<div><div>${k}</div><div style="display:flex;gap:8px">`;
  for (const c of CW) { n++; html += `<svg width="230" height="230" viewBox="0 0 256 256" style="border-radius:46px"><defs><linearGradient id="t${n}" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="i${n}" x1="50" y1="196" x2="214" y2="66" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient></defs><rect width="256" height="256" fill="url(#t${n})"/><g fill="none" stroke="url(#i${n})" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">${body}</g><circle cx="128" cy="128" r="110" fill="none" stroke="#e33" stroke-width=".6" stroke-dasharray="3 3"/></svg>`; }
  html += `</div></div>`;
}
fs.writeFileSync(process.argv[3], html + `</div></body>`);
