from sheetlib import *
from poly import *
from check import *
items = []
def build(W, short, long_, term, apex, cuts, gap, ang=90, vx=104, vy=176, r=0):
    poly, info = check_poly(vx, vy, W, short, long_, term, apex)
    # recentre by bbox
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    dx = 128 - (min(xs)+max(xs))/2; dy = 128 - (min(ys)+max(ys))/2
    poly = [(x+dx, y+dy) for x, y in poly]
    pieces = []
    edges = [-1e4] + [c+dx for c in cuts] + [1e4]
    for k in range(len(edges)-1):
        a = edges[k] + (gap/2 if k else 0); b = edges[k+1] - (gap/2 if k < len(edges)-2 else 0)
        if ang == 90: pieces.append(strip_x(poly, a, b))
        else: pieces.append(strip_dir(poly, ang, a-128, b-128))
    return pieces, (min(xs)+dx, min(ys)+dy, max(xs)+dx, max(ys)+dy)
def show(pieces, col, r=0):
    return ''.join(f'<path d="{path(p, r)}" fill="{col}"/>' for p in pieces)
V = [('A vertical system: vertical terminals + vertical cuts', dict(W=46, short=64, long_=150, term='vert', apex='point', cuts=(80, 128), gap=16)),
     ('B Helvetica-V system: flat apex + horizontal terminals, vertical cuts', dict(W=46, short=64, long_=150, term='horiz', apex=18, cuts=(78, 132), gap=16)),
     ('C perpendicular terminals + vertical cuts (V2)', dict(W=46, short=62, long_=146, term='perp', apex='point', cuts=(80, 130), gap=16)),
     ('D flat apex + perpendicular terminals', dict(W=46, short=62, long_=146, term='perp', apex=16, cuts=(80, 130), gap=16)),
     ('E vertical system, rounded corners r=5', dict(W=46, short=64, long_=150, term='vert', apex='point', cuts=(80, 128), gap=16, r=5)),
     ('F horizontal terminals, flat apex, cuts at 75°', dict(W=46, short=64, long_=150, term='horiz', apex=18, cuts=(78, 132), gap=16, ang=-15)),
    ]
for name, kw in V:
    r = kw.pop('r', 0)
    pcs, bb = build(**kw)
    print(name, [round(area(p)) for p in pcs], [round(v) for v in bb])
    items.append((name, svg(show(pcs, C['sage'], r)), tile(show(pcs, C['sage'], r))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk9.html')
