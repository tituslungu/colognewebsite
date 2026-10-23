import math
from sheetlib import *
from geo import *
items = []
# Loaf, pain-de-mie: rounded top corners big radius, slight crown
def loaf(idn, col, cuts, gap=12, x0=36, x1=220, yt=58, yb=200, lift=None, lcol=None):
    R = 52
    d = f'M{x0} {yb-12}V{yt+R}C{x0} {yt+R*0.25} {x0+R*0.6} {yt} {x0+R*1.1} {yt}H{x1-R*1.1}C{x1-R*0.6} {yt} {x1} {yt+R*0.25} {x1} {yt+R}V{yb-12}A12 12 0 0 1 {x1-12} {yb}H{x0+12}A12 12 0 0 1 {x0} {yb-12}Z'
    edges = [0] + list(cuts) + [256]; s = ''
    for k in range(len(edges)-1):
        a = edges[k] + (gap/2 if k else 0); b = edges[k+1] - (gap/2 if k < len(edges)-2 else 0)
        dy = (lift or {}).get(k, 0); c = (lcol or {}).get(k, col)
        s += f'<clipPath id="{idn}{k}"><rect x="{f(a)}" y="0" width="{f(b-a)}" height="256"/></clipPath><path transform="translate(0 {dy})" d="{d}" fill="{c}" clip-path="url(#{idn}{k})"/>'
    return s
items.append(('Loaf — unequal slices', svg(loaf('a', C['sage'], (76, 140, 168))), tile(loaf('b', C['sage'], (76, 140, 168)))))
items.append(('Loaf — one slice being taken', svg(loaf('c', C['sage'], (76, 140, 168), lift={2: -18}, lcol={2: C['char']})), tile(loaf('d', C['sage'], (76, 140, 168), lift={2: -18}, lcol={2: '#fff'}))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk8.html')
