// compare concept parameter sets: node sketch.mjs <out> cmp  (reads CMP env JSON)
import { concepts } from './concepts.mjs';
export default ({ V }) => {
  const sets = JSON.parse(process.env.CMP);
  for (const [id, p, label] of sets) {
    const d = concepts[id](p);
    V.push({ name: label || id + ' ' + JSON.stringify(p), tail: d.tail, pieces: d.pieces, f: d.pieces.map(x => (x.role === 'sage' ? 'sage' : 'char')), tailOwner: d.tailOwner });
  }
};
