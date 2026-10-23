from sheetlib import *
from poly import *
from check2 import *
items = []
def show(pcs, cols):
    if isinstance(cols, str): cols = [cols]*len(pcs)
    return ''.join(f'<path d="{path(p)}" fill="{c}"/>' for p, c in zip(pcs, cols))
V = [('P1 45/45, short 84 long 160, cuts 30/34', dict(W=46, short=84, long_=160, d1=30, d2=34, gap=16)),
     ('P2 45/45, short 92 long 164, cuts 26/40', dict(W=46, short=92, long_=164, d1=26, d2=40, gap=16)),
     ('P3 short 40°, long 52°, cuts 30/36', dict(W=46, short=86, long_=164, d1=30, d2=36, gap=16, a_short=40, a_long=52)),
     ('P4 short 40°, long 55°, heavier W52', dict(W=52, short=86, long_=166, d1=32, d2=38, gap=17, a_short=40, a_long=55)),
     ('P5 = P3 with the V highlighted', dict(W=46, short=86, long_=164, d1=30, d2=36, gap=16, a_short=40, a_long=52)),
     ('P6 = P3 cut leaning 80°', dict(W=46, short=86, long_=164, d1=30, d2=36, gap=16, a_short=40, a_long=52, cut_ang=80)),
    ]
for i, (name, kw) in enumerate(V):
    poly, pcs = split_check(**kw)
    P = place(pcs, 128, 128, 1.0, 0.3)
    print(name, 'areas', [round(area(p)) for p in P], 'bbox', [round(v) for v in bbox(P)], 'maxR', round(max_radius(P)))
    if i == 4:
        items.append((name, svg(show(P, [C['char'], C['sage'], C['char']])), tile(show(P, ['#fff', C['sage'], '#fff']))))
    else:
        items.append((name, svg(show(P, C['sage'])), tile(show(P, C['sage']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk10.html')
