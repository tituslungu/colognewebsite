import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 16
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

def bridge(name, J1, J2, r1, r2, roles, tail_ray=None):
    """J1 has rays r1 (list of angles); J2 has rays r2. The bridge J1-J2.
    tail_ray: (J, angle) the tail hangs from the left edge of this ray."""
    cuts = [[J1, J2]] + [[J1, ray(J1, a)] for a in r1] + [[J2, ray(J2, a)] for a in r2]
    # mitre helpers at junctions
    cuts += [[ray(J1, r1[0]), J1, ray(J1, r1[1])], [ray(J2, r2[0]), J2, ray(J2, r2[1])]]
    cuts += [[J2, J1, ray(J1, a)] for a in r1] + [[J1, J2, ray(J2, a)] for a in r2]
    tail = None
    if tail_ray:
        J, a = tail_ray
        tail = ('cut', J, ray(J, a), g, 222, 128)
    pcs = build(C, cuts, g, tail=tail, roles=roles)
    var(name, pcs)

# bridge slanted like table-1: J1 upper-left, J2 lower-right
bridge('H1 slanted bridge', (104, 100), (152, 128), [-110, 180], [0, 95],
       [((80, 60), 'c'), ((60, 150), 'a'), ((170, 70), 'b'), ((170, 175), 'c')], tail_ray=((152, 128), 95))
bridge('H2 bridge vertical-ish', (120, 82), (134, 146), [-120, 200], [-10, 100],
       [((80, 60), 'a'), ((70, 150), 'a'), ((180, 80), 'b'), ((170, 175), 'c')], tail_ray=((134, 146), 100))
bridge('H3 bridge, tail on left ray', (112, 118), (156, 100), [195, 95], [-95, 15],
       [((90, 60), 'a'), ((70, 160), 'c'), ((185, 60), 'b'), ((170, 160), 'a')], tail_ray=((112, 118), 95))

# Y with tail piece small cap at bottom-left
def ycap(name, J, rays, roles, tail_ray):
    cuts = [[J, ray(J, a)] for a in rays] + [[ray(J, rays[i]), J, ray(J, rays[(i + 1) % 3])] for i in range(3)]
    pcs = build(C, cuts, g, tail=('cut', J, ray(J, tail_ray), g, 222, 128), roles=roles)
    var(name, pcs)

ycap('Y9 small tail cap', (106, 150), [90, 190, -40], [((70, 150), 'b'), ((90, 70), 'a'), ((180, 140), 'c')], 90)

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk9.html')
