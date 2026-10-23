import math
from concepts import *
from kit import unit, ray
import refine
V = []
def slip(p):
    g = p['g']; x0 = p['x0']; J = (x0, p['jy'])
    tri, T = tail_poly((x0, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(x0, -300), (x0, 300)], g), stroke([J, ray(J, p['crack'], 400)], g),
            stroke([(x0, -300), J, ray(J, p['crack'], 400)], g), stroke([(x0, 300), J, ray(J, p['crack'], 400)], g)]
    pcs = cut(shape, cuts)
    u = unit(p['crack'])
    out, circles = [], [O]
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < x0: out.append((poly, p['roles'][0])); continue
        top = (cx - J[0]) * u[1] - (cy - J[1]) * u[0] < 0
        s = p['sT'] if top else p['sB']
        d = (u[0] * s, u[1] * s)
        if 'lift' in p and top: d = (d[0] + p['lift'][0], d[1] + p['lift'][1])
        out.append((move(poly, *d), p['roles'][1 if top else 2])); circles.append(Circle(d[0], d[1], 100))
    return out, circles
V.append(('slip -25, top +12', *slip(dict(g=20, x0=-8, jy=12, crack=-25, tip=128, a_out=128, sT=12, sB=0, roles='abc'))))
V.append(('slip -25, top +8 bottom -6', *slip(dict(g=20, x0=-8, jy=12, crack=-25, tip=128, a_out=128, sT=8, sB=-6, roles='abc'))))
V.append(('slip -35, top +12', *slip(dict(g=20, x0=-8, jy=20, crack=-35, tip=128, a_out=128, sT=12, sB=0, roles='abc'))))
V.append(('slip 20 (down-right), bottom +12', *slip(dict(g=20, x0=-8, jy=-14, crack=20, tip=128, a_out=128, sT=0, sB=12, roles='abc'))))
V.append(('slip -25 two-colour', *slip(dict(g=20, x0=-8, jy=12, crack=-25, tip=128, a_out=128, sT=12, sB=0, roles='aba'))))
V.append(('slip -25 sage pair', *slip(dict(g=20, x0=-8, jy=12, crack=-25, tip=128, a_out=128, sT=12, sB=0, roles='acb'))))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r4.html')
