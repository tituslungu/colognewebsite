// Sketch sheet: many angle systems side by side at real sizes.
import fs from 'fs';
import { createRequire } from 'module';
import { C, cut, cutA, build, fit, paths, deg } from './lib.mjs';
import { hp } from './geo.mjs';

const G = 22;
const V = [];

// wedge half-planes around junction J between directions a -> b (clockwise, deg)
function wedge(J, a, b, g = G) {
  const da = [Math.cos(deg(a)), Math.sin(deg(a))], db = [Math.cos(deg(b)), Math.sin(deg(b))];
  const n1 = [-da[1], da[0]], n2 = [db[1], -db[0]];
  return [
    { n: n1, d: n1[0] * J[0] + n1[1] * J[1] + g / 2 },
    { n: n2, d: n2[0] * J[0] + n2[1] * J[1] + g / 2 },
  ];
}

// Tail hanging from a cut: its inner edge is flush with the gap edge of the
// cut (on side -1 = left of an upward cut, +1 = right), tip at distance D
// from the circle centre; outer edge leaves the circle `spread` deg away.
function hangTail(c, D = 136, side = -1, spread = 40) {
  const th = deg(c.lean - 90);
  const dir = [Math.cos(th), Math.sin(th)];
  const nL = [Math.sin(th), -Math.cos(th)]; // left-of-upward-cut normal
  const n = side < 0 ? nL : [-nL[0], -nL[1]];
  const q = [c.p[0] + n[0] * c.gap / 2, c.p[1] + n[1] * c.gap / 2]; // on the edge
  // points q + t*dir at distance R from origin, lower one (t<0)
  const at = R => { const b = q[0] * dir[0] + q[1] * dir[1], cc = q[0] ** 2 + q[1] ** 2 - R * R; const t = -b - Math.sqrt(b * b - cc); return [q[0] + t * dir[0], q[1] + t * dir[1]]; };
  const hit = at(100), tip = at(D);
  const ang = Math.atan2(hit[1], hit[0]) * 180 / Math.PI;
  return side < 0 ? { aA: ang - 2, aB: ang + spread, tip } : { aA: ang - spread, aB: ang + 2, tip };
}

const mod = await import(new URL('./' + process.argv[3] + '.mjs', import.meta.url).href);
mod.default({ V, cut, cutA, wedge, hangTail, G });
const out = [];
for (const v of V) {
  const pcs = build({ tail: v.tail, pieces: v.pieces, tailOwner: v.tailOwner });
  const tfM = fit(pcs, { mode: 'box', R: 100, blend: 0.4 });
  const tfT = fit(pcs, { mode: 'tile', R: 108, blend: 0.6 });
  const light = v.f.map(k => C[k]);
  const dark = v.f.map(k => (k === 'char' ? C.off : C[k]));
  const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${paths(pcs, tfM, light)}</svg>`;
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="${C.char}"/>${paths(pcs, tfT, dark)}</svg>`;
  const enc = s => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
  out.push(`<div class="v"><b>${v.name}</b><div class="r"><img src="${enc(mark)}" width="170"><img src="${enc(tile)}" width="64" style="border-radius:14px"><img src="${enc(tile)}" width="40" style="border-radius:50%"><img src="${enc(tile)}" width="16" style="border-radius:3px"></div></div>`);
}
const html = `<!doctype html><html><head><style>body{margin:0;background:#fff;font:12px Helvetica}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px;width:1300px}.v{border:1px solid #eee;padding:10px}.r{display:flex;gap:12px;align-items:center}</style></head><body><div class="g">${out.join('')}</div></body></html>`;
const file = process.argv[2] || 'sketch';
fs.writeFileSync(new URL(`./${file}.html`, import.meta.url), html);
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1340, height: 900 }, deviceScaleFactor: 1 });
await p.goto(new URL(`./${file}.html`, import.meta.url).href);
await p.screenshot({ path: new URL(`./${file}.png`, import.meta.url).pathname, fullPage: true });
await b.close();
console.log('ok');
