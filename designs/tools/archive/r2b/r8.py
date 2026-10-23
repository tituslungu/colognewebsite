import math
from concepts import *
from kit import unit, ray
import refine

def arcpts(c, r, a0, a1, n=400):
    return [(c[0] + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)), c[1] + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

V = []
g = 20
def curved(name, cc, rr, a0, a1, extra, roles_pts, tail_line):
    tri, T = tail_poly(tail_line[0], tail_line[1], g, 124, 126)
    shape = union(O.pts(), tri)
    path = arcpts(cc, rr, a0, a1)
    cuts = [stroke(path, g)] + [stroke(e, g) for e in extra]
    pcs = cut(shape, cuts)
    out = []
    for poly in pcs:
        i = None
        cx, cy = centroid(poly)
        best = min(roles_pts, key=lambda rp: math.hypot(rp[0][0] - cx, rp[0][1] - cy))
        out.append((poly, best[1]))
    circles = [O, Circle(cc[0], cc[1], rr - g / 2), Circle(cc[0], cc[1], rr + g / 2)]
    V.append((name, out, circles))

# C1: arc rising from the tail, bowing left, to the top; branch from right edge
curved('C1 arc from tail + branch', (150, 60), 160, 160, 228, [[(300, 10), (40, 10)]],
       [((-60, 0), 'a'), ((50, -50), 'c'), ((50, 50), 'b')], ((0, 0), (0, 1)))
# C2: arc from the bottom curving up to the right edge (smile), vertical from the top to the arc
curved('C2 smile + vertical', (-10, -60), 140, 10, 100, [[(4, -300), (4, 70)]],
       [((-50, -20), 'a'), ((50, -40), 'c'), ((40, 80), 'b')], ((-16, 0), (0.0, 1)))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r8.html')
