import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

def tail_of(p0, p1, out=128):
    return ('cut', p0, p1, g, 222, out)

# (d) carved shares: bent cuts that carve pieces off the right side
def carve(name, A, B, roles):
    # A, B: polylines (each bent once) from edge -> inside -> edge
    pcs = build(C, [A, B], g, roles=roles, tail=('free', 112, 146, (64, 222)))
    var(name, pcs)

carve('D1 carved two shares', [(140, -40), (140, 110), (300, 110)], [(300, 132), (164, 132), (164, 300)],
      [((70, 110), 'a'), ((185, 70), 'b'), ((190, 160), 'c')])
carve('D2 carved, slanted', [(150, -40), (128, 104), (300, 92)], [(300, 124), (150, 138), (176, 300)],
      [((70, 110), 'a'), ((185, 70), 'b'), ((190, 165), 'c')])

# (a) pinwheel: three cuts each ending on the next, small central piece
def pinwheel(name, P, roles=None):
    # P: three (start_outside, end_point_on_next_cut)
    pcs = build(C, P, g, tail=('free', 112, 146, (64, 222)), roles=roles)
    var(name, pcs)

pinwheel('A1 pinwheel', [[(118, -40), (118, 130)], [(300, 100), (110, 100)], [(140, 300), (140, 92)]])

# Slanted family: everything at a 15-degree lean
def lean_fork(name, J, roles, lean=15):
    stem = 90 + lean    # down, leaning left at the bottom
    up = -90 + lean + 40
    side = lean - 5
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, up)], [J, ray(J, side)]]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, 132), roles=[((60, 110), roles[0]), (along(J, unit((up + side) / 2), 30), roles[1]), (along(J, unit((side + stem) / 2), 30), roles[2])])
    var(name, pcs)

lean_fork('L1 leaning fork', (128, 122), 'abc')
lean_fork('L2 leaning fork one share', (128, 122), 'aab')

# Exploded T and exploded +-with-offset
def x_quarters(name, J, d, roles):
    cuts = [[(J[0], -40), (J[0], 300)], [(-40, J[1]), (300, J[1])]]
    pcs = build(C, cuts, g, roles=[((80, 80), roles[0]), ((170, 80), roles[1]), ((170, 160), roles[2]), ((80, 160), roles[3])])
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, d)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in d])

x_quarters('X3 exploded quarters, unequal', (112, 132), [(0, 0), (6, -6), (10, 4), (-2, 8)], 'abcb')

# Bent single cut + slit
def bent_slit(name):
    J = (122, 120)
    cuts = [[(122, 300), J, ray(J, -65)], [(300, 150), (168, 150)]]
    pcs = build(C, cuts, g, tail=('cut', J, (122, 300), g, 222, 128), roles=[((60, 110), 'a'), ((180, 100), 'b')], ends='butt')
    var(name, pcs)

bent_slit('BS1 bent cut + partial slit')

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk4.html')
