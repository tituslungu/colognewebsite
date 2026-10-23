import sys
from ck import *
from sheetlib import svg, tile, sheet, C
items = []
def mk(label, W=46, short=98, long_=166, a_short=40, a_long=52, cap='flat', cuts=((-28, 0), (34, 0)), gap=16, bg=C['char'], fg=C['sage'], R=96, opt=0.35, shift=None):
    poly = check_outline(W, short, long_, a_short, a_long, cap)
    pcs = cut_pieces(poly, list(cuts), gap)
    if shift:
        pcs = [[(x+shift[i][0], y+shift[i][1]) for x, y in P] for i, P in enumerate(pcs)]
    m = place(pcs, 128, 128, 1.0, opt); x0, y0, x1, y1 = bbox(m)
    sc = min(208/(x1-x0), 208/(y1-y0)); m = place(pcs, 128, 128, sc, opt)
    a = place(pcs, 128, 128, 1.0, opt); r = max_radius(a); a = place(pcs, 128, 128, R/r, opt)
    body = lambda ps, col: f'<path fill="{col}" d="' + ''.join(path(P) for P in ps) + '"/>'
    items.append((label + '  areas ' + str([round(area(P)) for P in pcs]), svg(body(m, C['sage'])), tile(body(a, fg), bg)))

mk('A baseline (46w, gap16, vertical cuts)')
mk('B gap 11, W 50', W=50, gap=11)
mk('C gap 11, W 50, fan cuts -14/+14', W=50, gap=11, cuts=((-28, -14), (34, 14)))
mk('D gap 11, W 50, fan cuts +14/-14', W=50, gap=11, cuts=((-28, 14), (34, -14)))
mk('E gap 11, W 50, cuts 0 / 20', W=50, gap=11, cuts=((-28, 0), (34, 20)))
mk('F round caps, gap 11, W 50', W=50, gap=11, cap='round')
mk('G round caps, fan -14/+14', W=50, gap=11, cap='round', cuts=((-28, -14), (34, 14)))
mk('H vertical terminals, gap 11', W=50, gap=11, cap='vert')
mk('I three cuts (4 shares) gap 10', W=50, gap=10, cuts=((-30, 0), (24, 0), (72, 0)))
mk('J three cuts mixed angles', W=50, gap=10, cuts=((-30, -12), (22, 10), (74, -6)))
mk('K sliced + shifted (middle drops 6)', W=50, gap=11, shift=((0, 0), (0, 7), (0, 0)))
mk('L gap 11 W 50 cuts closer to vertex', W=50, gap=11, cuts=((-18, 0), (26, 0)))
sheet(items, sys.argv[1])
