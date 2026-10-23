import math
from concepts import *
from kit import unit, ray
import refine

def base(x0=-8, jy=-20, crack=-10, g=20, a_out=126):
    J = (x0, jy)
    tri, T = tail_poly((x0, 0), (0, 1), g, 124, a_out)
    shape = union(O.pts(), tri)
    cuts = [stroke([(x0, -300), (x0, 300)], g), stroke([J, ray(J, crack, 400)], g),
            stroke([(x0, -300), J, ray(J, crack, 400)], g), stroke([(x0, 300), J, ray(J, crack, 400)], g)]
    pcs = cut(shape, cuts)
    u = unit(crack); out = {}
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < x0: out['L'] = poly
        elif (cx - J[0]) * u[1] - (cy - J[1]) * u[0] < 0: out['T'] = poly
        else: out['B'] = poly
    return out

V = []
for (jy, crack, lift, rl) in [(-20, -10, (8, -10), 'acb'), (-20, -10, (8, -10), 'abc'), (-34, 0, (10, -10), 'acb'),
                              (-10, -20, (6, -12), 'acb'), (-20, -10, (12, -6), 'acb'), (-26, -14, (0, -12), 'acb')]:
    P = base(jy=jy, crack=crack)
    V.append((f'lift jy{jy} crack{crack} lift{lift} {rl}', [(P['L'], rl[0]), (move(P['T'], *lift), rl[1]), (P['B'], rl[2])],
              [O, Circle(lift[0], lift[1], 100)]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r9.html')
