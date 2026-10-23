from sheetlib import *
from poly import *
from tally import *
def circ(cx, cy, r): return f'M{cx-r} {cy}A{r} {r} 0 1 1 {cx+r} {cy}A{r} {r} 0 1 1 {cx-r} {cy}Z'
items = []
def tab(disc, ink, R=104, r=0, overlap=False, **T):
    pcs, sl = tally(**T)
    if overlap:
        T2 = dict(T); T2['knock'] = -50
        pcs, sl = tally(**T2)
        import math
    d = ''.join(path(P, r) for P in pcs) + path(sl, r)
    return f'<path fill="{disc}" d="{circ(128,128,R)}"/><path fill="{ink}" d="{d}"/>'
V = [('T1 lighter: w16 g18 h100, slash 16 @26°, knock 6', dict(w=16, g=18, h=100, sw=16, ang=26, knock=6, over=8)),
     ('T2 = T1 with softened corners', dict(w=16, g=18, h=100, sw=16, ang=26, knock=6, over=8, r=3)),
     ('T3 classic hand tally: slash 38°, no knockout', dict(w=16, g=18, h=100, sw=16, ang=38, knock=-30, over=4)),
     ('T4 w18 g16 h96, slash 14 @22°, knock 6', dict(w=18, g=16, h=96, sw=14, ang=22, knock=6, over=10)),
     ('T5 rounded bars (pencil)', dict(w=16, g=18, h=100, sw=16, ang=26, knock=6, over=8, r=8)),
     ('T6 larger coaster margin R=108, w14 g18 h92', dict(w=14, g=18, h=92, sw=14, ang=26, knock=6, over=8, R=108)),
    ]
for name, kw in V:
    R = kw.pop('R', 104); r = kw.pop('r', 0)
    items.append((name, svg(tab(C['sage'], C['char'], R, r, **kw)), tile(tab(C['sage'], C['char'], R*0.96, r, **kw))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk11.html')
