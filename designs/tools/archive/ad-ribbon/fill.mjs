// node fill.mjs <dir> : fill the five colourways into <dir>/{upper,lower}-<key>.svg
import fs from 'fs'; import path from 'path';
const CW = [
  { key: 'blue', TILE_A: '#DEF8FB', TILE_B: '#A6E5F7', INK_A: '#1151FE', INK_B: '#05DFF2' },
  { key: 'sage', TILE_A: '#FAFAF8', TILE_B: '#ECEBE8', INK_A: '#3E7A5B', INK_B: '#8CC4A5' },
  { key: 'sage-dark', TILE_A: '#2D2D2D', TILE_B: '#2D2D2D', INK_A: '#6FAF8E', INK_B: '#A8DCBD' },
  { key: 'charcoal', TILE_A: '#FFFFFF', TILE_B: '#FFFFFF', INK_A: '#2D2D2D', INK_B: '#2D2D2D' },
  { key: 'white-sage', TILE_A: '#6FAF8E', TILE_B: '#3E7A5B', INK_A: '#FFFFFF', INK_B: '#FFFFFF' }];
const dir = process.argv[2];
for (const c of ['upper', 'lower']) { const t = fs.readFileSync(path.join(dir, `${c}.tmpl.svg`), 'utf8');
  for (const cw of CW) { let s = t; for (const k of ['TILE_A', 'TILE_B', 'INK_A', 'INK_B']) s = s.split(`%${k}%`).join(cw[k]); fs.writeFileSync(path.join(dir, `${c}-${cw.key}.svg`), s); } }
