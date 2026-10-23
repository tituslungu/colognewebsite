import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const OUT = path.dirname(new URL(import.meta.url).pathname) + '/enum';
fs.mkdirSync(OUT, { recursive: true });
const N = 3, K = +(process.argv[2] || 3);
const cells = N * N;
const res = [];
const lab = new Array(cells).fill(-1);
function connected(l, k) {
  const idx = l.map((v, i) => v === k ? i : -1).filter(i => i >= 0);
  if (!idx.length) return false;
  const seen = new Set([idx[0]]), st = [idx[0]];
  while (st.length) { const i = st.pop(); const x = i % N, y = (i / N) | 0;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x+dx, ny = y+dy; if (nx<0||ny<0||nx>=N||ny>=N) continue; const j = ny*N+nx; if (l[j]===k && !seen.has(j)) { seen.add(j); st.push(j); } } }
  return seen.size === idx.length;
}
function faultFree(l) {
  for (let c = 1; c < N; c++) { let all = true; for (let y = 0; y < N; y++) if (l[y*N+c-1] === l[y*N+c]) all = false; if (all) return false; }
  for (let r = 1; r < N; r++) { let all = true; for (let x = 0; x < N; x++) if (l[(r-1)*N+x] === l[r*N+x]) all = false; if (all) return false; }
  return true;
}
function rec(i, used) {
  if (i === cells) { if (used === K) { const l = lab.slice(); for (let k = 0; k < K; k++) if (!connected(l, k)) return; if (faultFree(l)) res.push(l); } return; }
  for (let k = 0; k <= Math.min(used, K - 1); k++) { lab[i] = k; rec(i + 1, Math.max(used, k + 1)); }
}
rec(0, 0);
// canonical under symmetry
const sym = [];
for (const f of [(x,y)=>[x,y],(x,y)=>[N-1-y,x],(x,y)=>[N-1-x,N-1-y],(x,y)=>[y,N-1-x],(x,y)=>[N-1-x,y],(x,y)=>[x,N-1-y],(x,y)=>[y,x],(x,y)=>[N-1-y,N-1-x]]) sym.push(f);
const norm = l => { const m = new Map(); let n = 0; return l.map(v => { if (!m.has(v)) m.set(v, n++); return m.get(v); }).join(''); };
const canon = l => sym.map(f => { const o = new Array(cells); for (let y=0;y<N;y++) for (let x=0;x<N;x++) { const [a,b] = f(x,y); o[b*N+a] = l[y*N+x]; } return norm(o); }).sort()[0];
const uniq = new Map();
for (const l of res) { const c = canon(l); if (!uniq.has(c)) uniq.set(c, l); }
console.log(res.length, 'partitions,', uniq.size, 'unique');
// render each: cells merged per piece with gaps, smallest piece sage
const G = 14, cell = 176 / 3, x0 = 40;
let html = '';
for (const [c, l] of uniq) {
  const sizes = [...Array(K).keys()].map(k => l.filter(v => v === k).length);
  const sage = sizes.indexOf(Math.min(...sizes));
  let rects = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const k = l[y*N+x];
    const same = (dx, dy) => { const nx = x+dx, ny = y+dy; return nx>=0&&ny>=0&&nx<N&&ny<N&&l[ny*N+nx]===k; };
    const L = x0 + x*cell + (x>0 && !same(-1,0) ? G/2 : 0) - (same(-1,0)?0.5:0);
    const R = x0 + (x+1)*cell - (x<N-1 && !same(1,0) ? G/2 : 0) + (same(1,0)?0.5:0);
    const T = x0 + y*cell + (y>0 && !same(0,-1) ? G/2 : 0) - (same(0,-1)?0.5:0);
    const B = x0 + (y+1)*cell - (y<N-1 && !same(0,1) ? G/2 : 0) + (same(0,1)?0.5:0);
    rects += `<rect x="${L}" y="${T}" width="${R-L}" height="${B-T}" fill="${k===sage?'#6FAF8E':'#2D2D2D'}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="110"><clipPath id="c${c}"><rect x="40" y="40" width="176" height="176" rx="40"/></clipPath><g clip-path="url(#c${c})">${rects}</g></svg>`;
  html += `<div>${svg}<br>${c} ${sizes.join('/')}</div>`;
}
fs.writeFileSync(`${OUT}/sheet${K}.html`, `<!doctype html><style>body{font:11px Helvetica;display:flex;flex-wrap:wrap;gap:6px;padding:10px;width:1200px}div{text-align:center;color:#888}</style>${html}`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 600 } });
await p.goto('file://' + OUT + `/sheet${K}.html`);
await p.screenshot({ path: OUT + `/sheet${K}.png`, fullPage: true });
await b.close();
