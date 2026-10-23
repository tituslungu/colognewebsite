import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from w1lib import *
from sheetlib import svg, tile, sheet, C
from poly import area
items = []
def mk(label, rounded, **kw):
    pcs, info = build(**kw)
    P, I, A = place(pcs, info, rounded, 128, 128, fit=208)
    Pa, Ia, Aa = place(pcs, info, rounded, 128, 128, R=96)
    items.append((label + ' areas ' + str([round(area(Q)) for Q in A]), svg(f'<path fill="{C["sage"]}" d="{d_of(P, I, rounded)}"/>'), tile(f'<path fill="{C["sage"]}" d="{d_of(Pa, Ia, rounded)}"/>')))
mk('flat gap12', False)
mk('round gap12', True)
mk('round gap13 cut1 -34', True, gap=13, cuts=((-34, 0), (34, 0)))
mk('round gap13 cut1 -34 cut2 40', True, gap=13, cuts=((-34, 0), (40, 0)))
mk('flat gap13 cut1 -24 cut2 38', False, gap=13, cuts=((-24, 0), (38, 0)))
mk('round W54 gap14', True, W=54, gap=14, cuts=((-34, 0), (38, 0)))
sheet(items, sys.argv[1])
