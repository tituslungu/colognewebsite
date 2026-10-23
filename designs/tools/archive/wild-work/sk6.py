import math
from sheetlib import *
from geo import *
items = []
# Loaf silhouette: dome top
def loaf_path(x0, x1, yb, yt, r_bot=14):
    w = x1-x0; R = w/2; cx = (x0+x1)/2
    # dome: half-ellipse top from (x0, ys) to (x1, ys) where ys = yt + ry
    ry = 62; ys = yt + ry
    return f'M{x0} {ys}A{R} {ry} 0 0 1 {x1} {ys}V{yb-r_bot}A{r_bot} {r_bot} 0 0 1 {x1-r_bot} {yb}H{x0+r_bot}A{r_bot} {r_bot} 0 0 1 {x0} {yb-r_bot}Z'
def sliced_loaf(idn, col, cuts, gap, fan=0, lift=None):
    d = loaf_path(40, 216, 196, 60)
    s = ''
    edges = [0] + list(cuts) + [256]
    for k in range(len(edges)-1):
        a = edges[k] + (gap/2 if k else 0); b = edges[k+1] - (gap/2 if k < len(edges)-2 else 0)
        ang = fan*(k-(len(edges)-2)/2)
        dy = lift[k] if lift else 0
        s += f'<clipPath id="{idn}{k}"><rect x="{f(a)}" y="0" width="{f(b-a)}" height="256"/></clipPath><g transform="rotate({f(ang)} 128 300) translate(0 {dy})"><path d="{d}" fill="{col}" clip-path="url(#{idn}{k})"/></g>'
    return s
items.append(('L1 Sliced loaf — breaking bread, unequal slices', svg(sliced_loaf('a', C['sage'], (82, 150, 182), 12)), tile(sliced_loaf('b', C['sage'], (82, 150, 182), 12))))
items.append(('L2 Sliced loaf, fanned', svg(sliced_loaf('c', C['sage'], (82, 150, 182), 8, fan=5)), tile(sliced_loaf('d', C['sage'], (82, 150, 182), 8, fan=5))))
# coaster tally bold
def coaster2(disc, mark):
    s = f'<circle cx="128" cy="128" r="100" fill="{disc}"/>'
    xs = (86, 114, 142, 170)
    for x in xs:
        s += f'<rect x="{x-9}" y="72" width="18" height="112" rx="9" fill="{mark}"/>'
    s += f'<rect x="58" y="119" width="140" height="18" rx="9" fill="{mark}" transform="rotate(-24 128 128)"/>'
    return s
items.append(('Coaster tally, bold', svg(coaster2(C['sage'], C['char'])), tile(coaster2(C['sage'], C['char']))))
# QR plates unequal
def qrp(col, acc):
    def plate(cx, cy, R, col):
        w = R*0.34
        return f'<circle cx="{cx}" cy="{cy}" r="{R-w/2}" fill="none" stroke="{col}" stroke-width="{f(w)}"/><circle cx="{cx}" cy="{cy}" r="{f(R*0.36)}" fill="{acc}"/>'
    return plate(86, 86, 50, col) + plate(184, 80, 34, col) + plate(80, 184, 30, col) + f'<rect x="150" y="150" width="56" height="56" rx="12" fill="{col}"/>'
items.append(('QR plates, unequal', svg(qrp(C['char'], C['sage'])), tile(qrp('#fff', C['sage']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk6.html')
