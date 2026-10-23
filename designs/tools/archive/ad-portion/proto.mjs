// Quick mask-based prototypes. node proto.mjs <spec.json>
// spec: [{name, cx, cy, r, tail:[[x,y]...], cuts:[{x,y,deg}] (deg from vertical, +ve = top leans right, sorted L->R), gap, colors:[...]}]
import fs from 'fs';
const P = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-portion/proto/';
const specs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const map = { mark: c => c, app: c => c === '#2D2D2D' ? '#FAFAF8' : c, mono: () => '#FFFFFF', site: c => c === '#2D2D2D' ? '#FFFFFF' : c === '#6FAF8E' ? '#8CC4A5' : c };
for (const s of specs) {
  const d = P + s.name + '/'; fs.mkdirSync(d, { recursive: true });
  const L = 600;
  const line = c => { const a = c.deg * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a); return [[c.x - dx * L, c.y - dy * L], [c.x + dx * L, c.y + dy * L]]; };
  // regions: between consecutive cuts (cuts must not cross inside the canvas region of interest)
  const lines = (s.cuts || []).map(line);
  const far = [[[-2000, -2000], [-2000, 2000]], ...lines, [[2000, -2000], [2000, 2000]]];
  // ensure each line is oriented top->bottom
  const regs = [];
  for (let i = 0; i < far.length - 1; i++) {
    const A = far[i], B = far[i + 1];
    const top = p => p[0][1] < p[1][1] ? p : [p[1], p[0]];
    const a = top(A), b = top(B);
    regs.push([a[0], b[0], b[1], a[1]]);
  }
  if (s.tailOn) { const c = s.cuts[s.tailOn.cut], a = c.deg*Math.PI/180, X = y => c.x + Math.tan(a)*(c.y - y);
    s.tail = [[X(s.tailOn.yTop), s.tailOn.yTop], [X(s.tailOn.yTip), s.tailOn.yTip], s.tailOn.b]; }
  const bubble = s.shape || `M${s.cx - s.r},${s.cy}a${s.r},${s.r} 0 1,0 ${2 * s.r},0a${s.r},${s.r} 0 1,0 ${-2 * s.r},0Z` + (s.tail ? 'M' + s.tail.map(p => p.join(',')).join('L') + 'Z' : '');
  const gapLines = (s.extraGaps || []).concat(lines.map(l => ({ p: l }))).map(g => `<line x1="${g.p[0][0]}" y1="${g.p[0][1]}" x2="${g.p[1][0]}" y2="${g.p[1][1]}" stroke="#000" stroke-width="${s.gap}"/>`).join('');
  const build = (mode, tile, scale = 1) => {
    const cols = (s.colors || []).map(map[mode]);
    const body = regs.map((r, i) => `<clipPath id="c${i}"><path d="M${r.map(p => p.join(',')).join('L')}Z"/></clipPath>`).join('');
    const parts = (s.regions || regs.map((r, i) => ({ clip: `c${i}` }))).map((r, i) => `<g transform="translate(${(s.shift||[])[i]||'0 0'})"><g mask="url(#m)"><path fill="${cols[i]}" d="${bubble}" clip-path="url(#${r.clip})"/></g></g>`).join('');
    const tr = scale !== 1 ? `transform="translate(128 128) scale(${scale}) translate(-128 -128)"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${tile ? '<rect width="256" height="256" fill="#2D2D2D"/>' : ''}<defs>${body}<mask id="m" maskUnits="userSpaceOnUse" x="-500" y="-500" width="1300" height="1300"><rect x="-500" y="-500" width="1300" height="1300" fill="#fff"/>${gapLines}</mask></defs><g ${tr}>${parts}</g></svg>`;
  };
  fs.writeFileSync(d + 'mark.svg', build('mark'));
  fs.writeFileSync(d + 'mark-mono.svg', build('mono'));
  fs.writeFileSync(d + 'app-icon.svg', build('app', true, s.appScale || 0.86));
  fs.writeFileSync(d + 'site-icon.svg', build('site', false, 1));
}
