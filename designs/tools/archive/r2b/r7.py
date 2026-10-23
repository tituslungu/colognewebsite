import math
from concepts import *
from kit import unit, ray
import refine

def rot(poly, c, deg):
    a = math.radians(deg); ca, sa = math.cos(a), math.sin(a)
    return [(c[0] + (x - c[0]) * ca - (y - c[1]) * sa, c[1] + (x - c[0]) * sa + (y - c[1]) * ca) for x, y in poly]

def base(x0=-8, jy=8, crack=-20, g=20, a_out=126):
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
    return out, J

V = []
P, J = base()
d = 8
for name, (aT, aB) in [('explode from J d8', (-55, 35))]:
    nT = (math.cos(math.radians(aT)) * d, math.sin(math.radians(aT)) * d)
    nB = (math.cos(math.radians(aB)) * d, math.sin(math.radians(aB)) * d)
    V.append((name, [(move(P['L'], -d, 0), 'a'), (move(P['T'], *nT), 'c'), (move(P['B'], *nB), 'b')],
              [Circle(-d, 0, 100), Circle(nT[0], nT[1], 100), Circle(nB[0], nB[1], 100)]))
# twist: right shares rotated about the bubble centre
for tT, tB in [(10, 0), (8, -5), (-10, 0)]:
    V.append((f'twist T{tT} B{tB}', [(P['L'], 'a'), (rot(P['T'], (0, 0), tT), 'c'), (rot(P['B'], (0, 0), tB), 'b')], [O]))
# twist the speaking half instead
V.append(('twist L -8', [(rot(P['L'], (0, 0), -8), 'a'), (P['T'], 'c'), (P['B'], 'b')], [O]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r7.html')
