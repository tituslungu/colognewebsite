from concepts import *
from kit import unit, ray
import refine
V = []
# Step variants (across-cut steps)
V.append(('step A: y1 -24, y2 24, xs 4', *step(dict(STEP, y1=-24, y2=24, xs=4))[:2]))
V.append(('step B: reversed y1 30, y2 -14', *step(dict(STEP, y1=30, y2=-14, xs=-4))[:2]))

# Step variant: vertical joint jogs at a cut from the right edge (K8 style)
def vstep(p):
    g = p['g']; xl, xu, yh = p['xl'], p['xu'], p['yh']
    tri, T = tail_poly((xl, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(xl, 300), (xl, yh), (300, yh)], g), stroke([(xu, -300), (xu, yh), (300, yh)], g), stroke([(xl, 300), (xl, yh), (xu, yh), (xu, -300)], g)]
    pcs = cut(shape, cuts)
    out = []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx > xu and cy < yh: out.append((poly, p['roles'][1]))
        elif cx > xl and cy > yh: out.append((poly, p['roles'][2]))
        else: out.append((poly, p['roles'][0]))
    return out, [O]
V.append(('vstep: xl -10, xu 26, yh -20 (cap c)', *vstep(dict(g=21, xl=-10, xu=26, yh=-20, tip=128, a_out=128, roles='acb'))))
V.append(('vstep: xl -14, xu 18, yh 6', *vstep(dict(g=21, xl=-14, xu=18, yh=6, tip=128, a_out=128, roles='abc'))))

# Drift with the D intact: the speaking half split, top-left piece eased away
def driftL(p):
    g = p['g']; x0 = p['x0']; J = (x0, p['jy'])
    tri, T = tail_poly((x0, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(x0, -300), (x0, 300)], g), stroke([J, ray(J, p['crack'], 400)], g),
            stroke([(x0, -300), J, ray(J, p['crack'], 400)], g), stroke([(x0, 300), J, ray(J, p['crack'], 400)], g)]
    pcs = cut(shape, cuts)
    out, circles = [], [O]
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx > x0:
            d = p['dD']; out.append((move(poly, *d), 'b')); circles.append(Circle(d[0], d[1], 100))
        elif cy < J[1] - 10:
            d = p['dT']; out.append((move(poly, *d), p['top'])); circles.append(Circle(d[0], d[1], 100))
        else:
            out.append((poly, 'a'))
    return out, circles
V.append(('driftL: D eased right, top-left up', *driftL(dict(g=21, x0=-6, jy=-6, crack=200, tip=128, a_out=128, dD=(6, -3), dT=(-5, -7), top='c'))))
V.append(('driftL 2-colour', *driftL(dict(g=21, x0=-6, jy=-6, crack=200, tip=128, a_out=128, dD=(6, -3), dT=(-5, -7), top='a'))))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r2.html')
