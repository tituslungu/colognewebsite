import sys, math
from poly import *
from tally import tally
from sheetlib import svg, tile, sheet, C
items = []
def circ(cx, cy, r):
    return f'M{f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 1 {f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 1 {f(cx-r)} {f(cy)}Z'
def xf(polys, s, ox=128, oy=128): return [[((x-ox)*s+ox, (y-oy)*s+oy) for x, y in P] for P in polys]
def mk(label, T, disc=C['sage'], bar=C['char'], sl=None, tilebg=None, apps=1.22, R=104, n=4):
    sl = sl or bar
    pcs, sla = tally(n=n, **T)
    P = lambda ps: ''.join(path(p) for p in ps)
    mark = svg(f'<path fill="{disc}" d="{circ(128,128,R)}"/><path fill="{bar}" d="{P(pcs)}"/><path fill="{sl}" d="{P([sla])}"/>')
    a = xf(pcs, apps); b = xf([sla], apps)
    t = tile(f'<path fill="{bar}" d="{P(a)}"/><path fill="{sl}" d="{P(b)}"/>', tilebg or disc)
    mr = max(math.dist(p, (128,128)) for Q in a+b for p in Q)
    items.append((f'{label}  maxR {mr:.0f}', mark, t))
base = dict(w=18, g=16, h=112, sw=16, ang=29.5, knock=5, over=6)
mk('A baseline', base)
mk('B two-tone: off-white slash', base, sl=C['off'])
mk('C heavier: w22 g14 sw18 knock6', dict(w=22, g=14, h=112, sw=18, ang=29.5, knock=6, over=6))
mk('D heavier two-tone', dict(w=22, g=14, h=112, sw=18, ang=29.5, knock=6, over=6), sl=C['off'])
mk('E charcoal coaster, sage marks', dict(w=22, g=14, h=112, sw=18, ang=29.5, knock=6, over=6), disc=C['char'], bar=C['sage'], sl=C['off'])
mk('F off-white coaster: charcoal bars, sage slash', dict(w=22, g=14, h=112, sw=18, ang=29.5, knock=6, over=6), disc=C['off'], bar=C['char'], sl=C['sage'])
mk('G 3 bars + slash heavy', dict(w=26, g=16, h=112, sw=20, ang=34, knock=6, over=8), n=3)
mk('H steeper slash 40deg, heavy', dict(w=22, g=14, h=112, sw=18, ang=40, knock=6, over=4))
sheet(items, sys.argv[1])
