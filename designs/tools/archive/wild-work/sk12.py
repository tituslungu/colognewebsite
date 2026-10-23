import math
from sheetlib import *
from poly import *
from tally import *
T = dict(w=18, g=16, h=112, sw=16, ang=29.5, knock=5, over=6)
pcs, sl = tally(**T)
mr = max(math.dist(p, (128,128)) for P in pcs+[sl] for p in P)
print('tally max radius', round(mr, 1), '-> app scale for r<=100:', round(100/mr, 3), 'r<=96:', round(96/mr, 3))
def circ(cx, cy, r): return f'M{cx-r} {cy}A{r} {r} 0 1 1 {cx+r} {cy}A{r} {r} 0 1 1 {cx-r} {cy}Z'
d = ''.join(path(P) for P in pcs) + path(sl)
items = []
for name, ring in (('no rim', None), ('printed rim 4 @ R-12', (92, 4)), ('printed rim 3 @ R-10, deep sage', (94, 3))):
    s = f'<path fill="{C["sage"]}" d="{circ(128,128,104)}"/>'
    if ring:
        col = C['char'] if 'deep' not in name else C['saged']
        s += f'<circle cx="128" cy="128" r="{ring[0]}" fill="none" stroke="{col}" stroke-width="{ring[1]}"/>'
    s += f'<path fill="{C["char"]}" d="{d}"/>'
    items.append((name, svg(s), tile(s)))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk12.html')
