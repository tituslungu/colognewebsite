import math
from concepts import *
from kit import unit, ray
import refine
V = []
def offL(name, h, xu, xl, roles, g=21):
    # horizontal cut from the left edge at y=h to the joint; upper joint x=xu (top edge to h); lower joint x=xl (h to bottom)
    tri, T = tail_poly((xl, 0), (0, 1), g, 124, 126)
    shape = union(O.pts(), tri)
    cuts = [stroke([(-300, h), (xu, h), (xu, -300)], g), stroke([(-300, h), (xl, h), (xl, 300)], g),
            stroke([(xu, -300), (xu, h), (xl, h), (xl, 300)], g)]
    pcs = cut(shape, cuts)
    out = []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < min(xu, xl) and cy < h: k = roles[0]
        elif cx < max(xu, xl) and cy > h: k = roles[1]
        else: k = roles[2]
        out.append((poly, k))
    V.append((name, out, [O]))

offL('offL h-20 xu-18 xl6 (D wider top)', -20, -18, 6, 'cab')
offL('offL h-10 xu8 xl-14 (D wider bottom)', -10, 8, -14, 'cab')
offL('offL h-26 xu-24 xl0', -26, -24, 0, 'cab')
offL('offL h 0 xu 10 xl -12', 0, 10, -12, 'cab')
offL('offL h-20 xu-18 xl6 2-colour', -20, -18, 6, 'aab')
offL('offL h-10 xu8 xl-14 2-colour', -10, 8, -14, 'aab')
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r15.html')
