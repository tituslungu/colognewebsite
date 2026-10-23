import math
from concepts import *
from kit import unit, ray
import refine
V = []
g = 20
def mk(name, cuts, tail_pt, tail_dir, roles):
    tri, T = tail_poly(tail_pt, tail_dir, g, 124, 126)
    shape = union(O.pts(), tri)
    pcs = cut(shape, [stroke(c, g) for c in cuts])
    out = []
    for poly in pcs:
        cx, cy = centroid(poly)
        best = min(roles, key=lambda rp: math.hypot(rp[0][0] - cx, rp[0][1] - cy))
        out.append((poly, best[1]))
    V.append((name, out, [O]))

# single check: vertex V, short arm up-left, long arm up-right; + vertical from top to long arm
Vx, Vy = -14, 34
mk('check + T', [[ray((Vx, Vy), -135, 300), (Vx, Vy), ray((Vx, Vy), -50, 300)], [(30, -300), (30, -10)]],
   (Vx, Vy), (0, 1), [((-40, -40), 'a'), ((60, -50), 'c'), ((0, 70), 'b')])
# check + stem from tail
mk('check + stem (Y)', [[ray((Vx, Vy), -135, 300), (Vx, Vy), ray((Vx, Vy), -50, 300)], [(Vx, Vy), (Vx, 300)]],
   (Vx, Vy), (0, 1), [((0, -40), 'a'), ((-50, 60), 'c'), ((40, 60), 'b')])
# double check
mk('double check', [[ray((-24, 22), -135, 300), (-24, 22), ray((-24, 22), -50, 300)], [ray((-4, 58), -135, 300), (-4, 58), ray((-4, 58), -50, 300)]],
   (-24, 22), (0, 1), [((0, -50), 'a'), ((0, 30), 'b'), ((0, 85), 'c')])
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r10.html')
