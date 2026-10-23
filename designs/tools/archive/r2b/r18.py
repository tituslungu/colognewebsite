import math
from concepts import *
from kit import unit, ray
import refine
V = []
def nest(name, ci, ri, a, off, g=18, roles='abc'):
    tri, T = tail_poly((-30, 0), (0, 1), g, 124, 126)
    tri = [O.at(118), (-52, 124), O.at(140)]
    shape = union(O.pts(), tri)
    inner = Circle(ci[0], ci[1], ri)
    ring = Circle(ci[0], ci[1], ri + g)
    # cut ring: annulus between ri and ri+g
    ann = diff([ring.pts()], [inner.pts()])
    pieces = diff(shape, ann)
    # split inner disc with a straight cut
    J = (ci[0] + off[0], ci[1] + off[1])
    knife = stroke([ray(J, a + 180, 300), ray(J, a, 300)], g)
    pcs = diff(pieces, knife)
    out = []
    for p in pcs:
        cx, cy = centroid(p)
        if math.hypot(cx - ci[0], cy - ci[1]) > ri * 0.8 and cx < ci[0]: out.append((p, roles[0]))
        else:
            u = unit(a)
            side = (cx - J[0]) * u[1] - (cy - J[1]) * u[0]
            out.append((p, roles[1] if side < 0 else roles[2]))
    V.append((name, out, [O, inner, ring]))
nest('nest: disc right, cut 60', (22, -4), 62, -60, (0, 0))
nest('nest: disc right, cut 100', (24, -6), 60, -100, (6, 0))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r18.html')
