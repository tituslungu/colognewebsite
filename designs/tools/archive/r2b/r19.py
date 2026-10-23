import math
from concepts import *
from kit import unit, ray
import refine
V = []
def drift2(name, x0, yl, al, yr, ar, slips, roles, g=19):
    """al: direction of the left crack going left (deg), ar: right crack going right.
    slips: dict piece -> distance along its own crack (positive = outward)."""
    tri, T = tail_poly((x0, 0), (0, 1), g, 124, 126)
    shape = union(O.pts(), tri)
    L, R = (x0, yl), (x0, yr)
    cuts = [stroke([(x0, -300), (x0, 300)], g), stroke([L, ray(L, al, 400)], g), stroke([R, ray(R, ar, 400)], g)]
    pcs = cut(shape, cuts)
    out, circles = [], []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < x0:
            yline = yl + (cx - x0) * math.tan(math.radians(al)) * -1 if False else L[1] + (x0 - cx) * math.tan(math.radians(180 - al)) * -1
            ul = unit(al); t = (cx - L[0]) / ul[0]; ycr = L[1] + ul[1] * t
            key = 'TL' if cy < ycr else 'BL'; u = ul
        else:
            ur = unit(ar); t = (cx - R[0]) / ur[0]; ycr = R[1] + ur[1] * t
            key = 'TR' if cy < ycr else 'BR'; u = ur
        dd = slips.get(key, 0.0)
        v = (u[0] * dd, u[1] * dd)
        out.append((move(poly, *v), roles[key])); circles.append(Circle(v[0], v[1], 100))
    V.append((name, out, circles))
R2 = dict(TL='a', BL='a', TR='b', BR='b')
# left crack rising to the left (going left = up): al = 195 ; right crack rising right: ar = -15  -> V (wings up)
drift2('wings: TL & TR slip out', -6, -10, 195, 22, -15, dict(TL=10, TR=10), R2)
# left crack falling to the left (going left = down): al=165; right crack falling right: ar=15 -> roof
drift2('roof: TL & TR slip out(up)', -6, 4, 165, 30, 15, dict(TL=-10, TR=-10), R2)
# parallel rising cracks; only TR slips
drift2('parallel, only TR slips', -6, -14, 165, 26, -15, dict(TR=12), R2)
# parallel rising, left crack lower than right (non-pinwheel), TR slips up-right, BL fixed
drift2('parallel, left low/right high, TR slips', -6, 24, 165, -16, -15, dict(TR=12), R2)
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r19.html')
