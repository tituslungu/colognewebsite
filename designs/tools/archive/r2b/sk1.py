import math
from geo import *
import sheet

def unit(a):
    r = math.radians(a)
    return (math.cos(r), math.sin(r))

def along(p, u, t):
    return (p[0] + u[0] * t, p[1] + u[1] * t)

def side_line(J, a, g, side):
    """Offset of the ray from J at angle a by g/2 to one side (side=-1 left of screen-down)."""
    u = unit(a)
    n = (-u[1], u[0])  # rotate +90 (screen: to the left of travel when going down? check sign)
    if n[0] * side < 0:
        n = (-n[0], -n[1])
    # side=-1 -> the normal with negative x
    if side == -1 and n[0] > 0:
        n = (-n[0], -n[1])
    return (J[0] + n[0] * g / 2, J[1] + n[1] * g / 2), u

def tail_on_line(C, P, u, tip_y, a_out):
    """Tail whose inner edge runs along line (P,u) to tip at tip_y, outer edge from circle angle a_out."""
    t = (tip_y - P[1]) / u[1]
    T = along(P, u, t)
    Q = along(P, u, (C.cy - P[1]) / u[1])
    return [C.at(a_out), T, Q], T

def Y(J, angles, g=18, C=None, tail=None, roles=None, name=''):
    C = C or Circle(128, 116, 84)
    shape = [C.pts()]
    if tail:
        ti, tip_y, a_out = tail
        P, u = side_line(J, angles[ti], g, -1)
        tri, T = tail_on_line(C, P, u, tip_y, a_out)
        shape = union(C.pts(), tri)
    cuts = [stroke([J, along(J, unit(a), 260)], g, 'butt') for a in angles]
    # join at J: add a small disc-free mitre by also stroking pairs as polylines
    cuts += [stroke([along(J, unit(angles[i]), 260), J, along(J, unit(angles[(i + 1) % len(angles)]), 260)], g) for i in range(len(angles))]
    pieces = cut(shape, cuts)
    pieces.sort(key=lambda p: -abs(area(p)))
    roles = roles or 'abcd'
    return (name, [(p, roles[i] if i < len(roles) else 'a') for i, p in enumerate(pieces)], [C])

V = []
C = Circle(128, 114, 84)
V.append(Y((120, 140), [90, -82, 12], C=C, tail=(0, 222, 128), roles='abc', name='Y1 J low-left; down/up/right'))
V.append(Y((120, 140), [90, -82, 12], C=C, tail=(0, 222, 128), roles='aba', name='Y1 one sage share'))
V.append(Y((138, 100), [100, -105, -8], C=C, tail=(0, 222, 128), roles='abc', name='Y2 J high-right'))
V.append(Y((112, 108), [95, -60, 160+10], C=C, tail=(0, 222, 120), roles='abc', name='Y3'))
V.append(Y((150, 130), [100, -120, 20], C=C, tail=(0, 222, 128), roles='abc', name='Y4 J right'))
V.append(Y((116, 122), [84, -70, 200], C=C, tail=(0, 222, 125), roles='abc', name='Y5 slant'))
V.append(Y((140, 140), [96, -96, 30], C=C, tail=(0, 222, 128), roles='abc', name='Y6'))
V.append(Y((110, 150), [95, -85, -20], C=C, tail=(0, 222, 128), roles='acb', name='Y7'))
V.append(Y((126, 96), [80, -120, -30], C=C, tail=(0, 222, 125), roles='abc', name='Y8 junction high'))

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk1.html')
