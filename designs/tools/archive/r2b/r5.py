import math
from concepts import *
from kit import unit, ray
import refine
V = []
def lid(p):
    """Dome over two shares, cut with a straight across-cut and a joint from the tail;
    the pieces then drift: dome up, right share down-right."""
    g = p['g']; xs, yh = p['xs'], p['yh']
    tri, T = tail_poly((xs, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(-300, yh), (300, yh)], g), stroke([(xs, yh), (xs, 300)], g)]
    pcs = cut(shape, cuts)
    out, circles = [], []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cy < yh: k, d = p['roles'][0], p['dD']
        elif cx < xs: k, d = p['roles'][1], p['dL']
        else: k, d = p['roles'][2], p['dR']
        out.append((move(poly, *d), k)); circles.append(Circle(d[0], d[1], 100))
    return out, circles
V.append(('lid: dome up 8, right share down 8', *lid(dict(g=20, xs=-4, yh=4, tip=128, a_out=128, dD=(0, -8), dL=(0, 0), dR=(4, 8), roles='abc'))))
V.append(('lid: dome up-left, right share right', *lid(dict(g=20, xs=-4, yh=-2, tip=128, a_out=128, dD=(-4, -7), dL=(0, 0), dR=(8, 6), roles='abc'))))
V.append(('lid 2-colour', *lid(dict(g=20, xs=-4, yh=4, tip=128, a_out=128, dD=(0, -8), dL=(0, 0), dR=(4, 8), roles='aab'))))
V.append(('lid: dome sage', *lid(dict(g=20, xs=-4, yh=4, tip=128, a_out=128, dD=(0, -8), dL=(0, 0), dR=(4, 8), roles='bac'))))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r5.html')
