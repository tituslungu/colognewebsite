import math
from concepts import *
from kit import unit, ray
import refine
V = []
def ex(name, J, rays, d, roles, g=16, tail_ray=0, pivot=None):
    us = unit(rays[tail_ray])
    tri, T = tail_poly(J, us, g, 124, 126)
    shape = union(O.pts(), tri)
    cuts = [stroke([ray(J, rays[i], 400), J, ray(J, rays[(i + 1) % 3], 400)], g) for i in range(3)]
    pcs = cut(shape, cuts)
    out, circles = [], []
    angs = sorted(rays)
    for poly in pcs:
        cx, cy = centroid(poly)
        a = math.degrees(math.atan2(cy - J[1], cx - J[0]))
        # which wedge: find bisector of the wedge containing a
        rs = sorted([r % 360 for r in rays])
        aa = a % 360
        for i in range(3):
            lo, hi = rs[i], rs[(i + 1) % 3] + (360 if i == 2 else 0)
            x = aa if aa >= lo else aa + 360
            if lo <= x < hi:
                bis = (lo + hi) / 2; key = i
        dd = d[key]
        v = (math.cos(math.radians(bis)) * dd, math.sin(math.radians(bis)) * dd)
        out.append((move(poly, *v), roles[key])); circles.append(Circle(v[0], v[1], 100))
    V.append((name, out, circles))

# rays: stem to tail 100, right -10, up-left -130
ex('ex1 tight', (14, 4), [100, -10, -130], [0, 0, 0], 'bca', g=18)
ex('ex1 exploded 8', (14, 4), [100, -10, -130], [8, 8, 0], 'bca', g=16)
ex('ex2 J high, exploded', (10, -16), [104, 0, -120], [9, 9, 0], 'bca', g=16)
ex('ex3 J low right', (24, 30), [110, -30, -150], [9, 9, 0], 'bca', g=16)
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r14.html')
