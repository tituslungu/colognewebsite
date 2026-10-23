import math
from concepts import *
from kit import unit, ray
import refine
V = []
g = 18
def four(name, x0, JL, aL, JR, aR, d, roles):
    tri, T = tail_poly((x0, 0), (0, 1), g, 124, 126)
    shape = union(O.pts(), tri)
    cuts = [stroke([(x0, -300), (x0, 300)], g), stroke([(x0, JL), ray((x0, JL), aL, 400)], g), stroke([(x0, JR), ray((x0, JR), aR, 400)], g)]
    pcs = cut(shape, cuts)
    out, circles = [], []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < x0:
            key = 'TL' if cy < JL else 'BL'
        else:
            key = 'TR' if cy < JR + (cx - x0) * math.tan(math.radians(aR)) else 'BR'
        dd = d[key]
        out.append((move(poly, *dd), roles[key])); circles.append(Circle(dd[0], dd[1], 100))
    V.append((name, out, circles))

four('four: offset cracks, drift', -6, -30, 200, 20, -15, {'TL': (-6, -6), 'BL': (0, 0), 'TR': (6, -6), 'BR': (5, 5)},
     {'TL': 'c', 'BL': 'a', 'TR': 'b', 'BR': 'c'})
four('four: drift, 2-colour', -6, -30, 200, 20, -15, {'TL': (-6, -6), 'BL': (0, 0), 'TR': (6, -6), 'BR': (5, 5)},
     {'TL': 'a', 'BL': 'a', 'TR': 'b', 'BR': 'b'})
four('four: tight (no drift)', -6, -30, 200, 20, -15, {'TL': (0, 0), 'BL': (0, 0), 'TR': (0, 0), 'BR': (0, 0)},
     {'TL': 'c', 'BL': 'a', 'TR': 'b', 'BR': 'c'})
four('four: drift only TL & BR', -6, -30, 200, 20, -15, {'TL': (-8, -4), 'BL': (0, 0), 'TR': (0, 0), 'BR': (8, 4)},
     {'TL': 'c', 'BL': 'a', 'TR': 'b', 'BR': 'c'})
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r11.html')
V.clear()
four('A: L200 R-15, 2-colour', -6, -30, 200, 20, -15, {'TL': (-6, -6), 'BL': (0, 0), 'TR': (6, -6), 'BR': (5, 5)},
     {'TL': 'a', 'BL': 'a', 'TR': 'b', 'BR': 'b'})
four('B: right pair sage + light', -6, -30, 200, 20, -15, {'TL': (-6, -6), 'BL': (0, 0), 'TR': (6, -6), 'BR': (5, 5)},
     {'TL': 'a', 'BL': 'a', 'TR': 'c', 'BR': 'b'})
four('C: parallel cracks (rising right)', -6, -14, 165, 26, -15, {'TL': (-6, -5), 'BL': (0, 0), 'TR': (6, -6), 'BR': (4, 5)},
     {'TL': 'a', 'BL': 'a', 'TR': 'b', 'BR': 'b'})
four('D: L190 R-25, drift 8', -6, -26, 190, 30, -25, {'TL': (-7, -6), 'BL': (0, 0), 'TR': (7, -7), 'BR': (6, 5)},
     {'TL': 'a', 'BL': 'a', 'TR': 'b', 'BR': 'b'})
four('E: L205 R10', -6, -34, 205, 12, 10, {'TL': (-6, -6), 'BL': (0, 0), 'TR': (6, -5), 'BR': (5, 6)},
     {'TL': 'a', 'BL': 'a', 'TR': 'b', 'BR': 'b'})
four('F: smaller nudge 4', -6, -30, 200, 20, -15, {'TL': (-4, -4), 'BL': (0, 0), 'TR': (4, -4), 'BR': (3, 4)},
     {'TL': 'a', 'BL': 'a', 'TR': 'b', 'BR': 'b'})
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r11.html')
