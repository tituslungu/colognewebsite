import math
from concepts import *
from kit import unit, ray
import refine
V = []
# (b) exploded fork: cap lifted along 45 deg
pcs, cs, _ = fork()
for d in (10, 16):
    v = (d / math.sqrt(2), -d / math.sqrt(2))
    out = [(move(p, *v), r) if r == 'c' else (p, r) for p, r in pcs]
    V.append((f'fork, cap taken {d}', out, [O, Circle(v[0], v[1], 100)]))
# (c) exploded step: dome lifted, share slides right
pcs, cs, _ = step()
out = []
for p, r in pcs:
    if r == 'b': out.append((move(p, 0, -10), r))
    elif r == 'c': out.append((move(p, 8, 0), r))
    else: out.append((p, r))
V.append(('step, dome lifted 10, share out 8', out, [O, Circle(0, -10, 100), Circle(8, 0, 100)]))
# (e) fork with two right arms (stacked shares)
def fork2(J1, J2, stem, g=21):
    us = unit(stem)
    tri, T = tail_poly(J1, us, g, 124, 126)
    shape = union(O.pts(), tri)
    cuts = [stroke([ray(J1, stem, 400), J1, J2, ray(J2, -90, 400)], g), stroke([J1, ray(J1, 0, 400)], g),
            stroke([J2, ray(J2, 0, 400)], g), stroke([ray(J1, stem, 400), J1, ray(J1, 0, 400)], g),
            stroke([J1, J2, ray(J2, 0, 400)], g)]
    pcs = cut(shape, cuts)
    out = []
    for p in pcs:
        cx, cy = centroid(p)
        if cx < J1[0] - 10 and cx < J2[0]: out.append((p, 'a'))
        elif cy < J2[1]: out.append((p, 'c'))
        elif cy < J1[1]: out.append((p, 'b'))
        else: out.append((p, 'c'))
    return out
V.append(('fork, two arms', fork2((10, 20), (26, -26), 110), [O]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r22.html')
