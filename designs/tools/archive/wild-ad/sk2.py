import sys
from ck import *
from sheetlib import svg, tile, sheet, C
items = []
def mk(label, W=50, short=98, long_=166, a_short=40, a_long=52, cap='flat', cuts=((-28, 0), (34, 0)), gap=12, R=96, opt=0.35):
    poly = check_outline(W, short, long_, a_short, a_long, cap)
    pcs = cut_pieces(poly, list(cuts), gap)
    m = place(pcs, 128, 128, 1.0, opt); x0, y0, x1, y1 = bbox(m)
    sc = min(208/(x1-x0), 208/(y1-y0)); m = place(pcs, 128, 128, sc, opt)
    a = place(pcs, 128, 128, 1.0, opt); r = max_radius(a); a = place(pcs, 128, 128, R/r, opt)
    body = lambda ps, col: f'<path fill="{col}" d="' + ''.join(path(P) for P in ps) + '"/>'
    items.append((label + '  areas ' + str([round(area(P)) for P in pcs]), svg(body(m, C['sage'])), tile(body(a, C['sage']), C['char'])))
mk('B vertical cuts gap12')
mk('C2 fan -8/+8')
mk('C fan -14/+14', cuts=((-28, -14), (34, 14)))
mk('P parallel lean -12 (both /)', cuts=((-28, -12), (34, -12)))
mk('Q parallel lean +12 (both \\)', cuts=((-28, 12), (34, 12)))
mk('F round caps vertical', cap='round')
mk('G2 round caps fan -8/+8', cap='round', cuts=((-28, -8), (34, 8)))
mk('R round caps, cuts -26 / +40, fan -10/+10, gap 12', cap='round', cuts=((-26, -10), (40, 10)))
sheet(items, sys.argv[1])
