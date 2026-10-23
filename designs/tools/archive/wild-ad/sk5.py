import sys, math
from poly import *
from tally import tally
from sheetlib import svg, tile, sheet, C
from wordmark import wordmark_d
items = []
def circ(cx, cy, r):
    return f'M{f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 1 {f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 1 {f(cx-r)} {f(cy)}Z'
def xf(polys, s, tx=128, ty=128, ox=128, oy=128): return [[((x-ox)*s+tx, (y-oy)*s+ty) for x, y in P] for P in polys]
lk = '<body style="margin:0;background:#eee;display:grid;gap:14px;padding:14px">'
def mk(label, T, apps=1.22, R=104):
    pcs, sla = tally(**T)
    P = lambda ps: ''.join(path(p) for p in ps)
    mark = svg(f'<path fill="{C["sage"]}" d="{circ(128,128,R)}"/><path fill="{C["char"]}" d="{P(pcs+[sla])}"/>')
    a = xf(pcs+[sla], apps)
    t = tile(f'<path fill="{C["char"]}" d="{P(a)}"/>', C['sage'])
    mr = max(math.dist(p, (128,128)) for Q in a for p in Q)
    stub = sorted(round(area(p)) for p in pcs)
    items.append((f'{label} maxR {mr:.0f} pieces {stub}', mark, t))
    global lk
    CAP=100; D=CAP*1.36; s=D/(2*R); cx=14+D/2; cy=14+D/2
    wd, ww = wordmark_d(cx+D/2+42, cy+CAP/2, CAP)
    body = f'<path fill="{C["sage"]}" d="{circ(cx,cy,R*s)}"/><path fill="{C["char"]}" d="{P(xf(pcs+[sla], s, cx, cy))}"/>'
    lk += f'<div style="background:#fafaf8;padding:10px">{label}<br><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cx+D/2+42+ww+14} {D+28}" height="110">{body}<path fill="#2D2D2D" d="{wd}"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cx+D/2+42+ww+14} {D+28}" height="36">{body}<path fill="#2D2D2D" d="{wd}"/></svg></div>'
mk('A base w18 g16 sw16', dict(w=18, g=16, h=112, sw=16, ang=29.5, knock=5, over=6))
mk('B w20 g15 sw17 k5.5', dict(w=20, g=15, h=112, sw=17, ang=29.5, knock=5.5, over=6), apps=1.2)
mk('C w20 g15 sw20 k5.5 (slash = stroke)', dict(w=20, g=15, h=112, sw=20, ang=29.5, knock=5.5, over=6), apps=1.2)
mk('D w21 g14 h108 sw19 k6 ang28', dict(w=21, g=14, h=108, sw=19, ang=28, knock=6, over=6), apps=1.2)
sheet(items, sys.argv[1])
open(sys.argv[2], 'w').write(lk)
