import math
from concepts import *
from kit import unit, ray
import refine

def rot(poly, c, deg):
    a = math.radians(deg); ca, sa = math.cos(a), math.sin(a)
    return [(c[0] + (x - c[0]) * ca - (y - c[1]) * sa, c[1] + (x - c[0]) * sa + (y - c[1]) * ca) for x, y in poly]

V = []
# Fan: message-2 split + crack on the D; pieces rotated about the tail tip
def fan(p):
    g = p['g']; x0 = p['x0']; J = (x0, p['jy'])
    tri, T = tail_poly((x0, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(x0, -300), (x0, 300)], g), stroke([J, ray(J, p['crack'], 400)], g),
            stroke([(x0, -300), J, ray(J, p['crack'], 400)], g), stroke([(x0, 300), J, ray(J, p['crack'], 400)], g)]
    pcs = cut(shape, cuts)
    out, circles = [], []
    piv = p.get('pivot', T)
    for poly in pcs:
        cx, cy = centroid(poly)
        u = unit(p['crack'])
        if cx < x0: k, r = 'a', p['rL']
        elif (cx - J[0]) * u[1] - (cy - J[1]) * u[0] < 0: k, r = 'b', p['rT']
        else: k, r = 'c', p['rB']
        out.append((rot(poly, piv, r), k))
        c = rot([(0, 0)], piv, r)[0]; circles.append(Circle(c[0], c[1], 100))
    return out, circles
V.append(('fan about tail tip', *fan(dict(g=18, x0=-8, jy=10, crack=-12, tip=128, a_out=128, rL=-2, rT=5, rB=2))))
V.append(('fan about centre-bottom', *fan(dict(g=18, x0=-8, jy=10, crack=-12, tip=128, a_out=128, rL=-3, rT=6, rB=1.5, pivot=(-8, 100)))))

# Step with colour variants
V.append(('step A: dome sage, tail charcoal', *[[(poly, {'a': 'b', 'b': 'a', 'c': 'c'}[r]) for poly, r in step(dict(STEP, y1=-24, y2=24, xs=4))[0]], [O]]))
V.append(('step A: two-colour', *[[(poly, {'a': 'a', 'b': 'a', 'c': 'b'}[r]) for poly, r in step(dict(STEP, y1=-24, y2=24, xs=4))[0]], [O]]))
V.append(('step C: y1 -16, y2 20, xs 14', *step(dict(STEP, y1=-16, y2=20, xs=14))[:2]))
V.append(('step D: y1 -30, y2 14, xs -6', *step(dict(STEP, y1=-30, y2=14, xs=-6))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r3.html')
