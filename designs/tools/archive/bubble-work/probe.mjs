import { concepts } from './concepts.mjs';
import { build, stats } from './lib.mjs';
const [id, list] = [process.argv[2], JSON.parse(process.argv[3])];
for (const p of list) {
  const pcs = build(concepts[id](p));
  const s = stats(pcs);
  const chords = pcs.map(pc => pc.segs.filter(x => x.t === 'A').map(x => (2 * x.r * Math.sin(Math.abs(x.a1 - x.a0) / 2)).toFixed(0)).join('+'));
  console.log(JSON.stringify(p), '| shares', s.areas.map(a => (a / s.area * 100).toFixed(0)).join('/'), '| chords', chords.join(' | '));
}
