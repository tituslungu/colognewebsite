import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

# Staggered: vertical joint jogs at a horizontal cut from the right edge
def stagger(name, yh, x_low, x_up, roles, lean=0):
    # lean rotates all cut directions about the junction region
    cuts = [[(300, yh), (x_low - 0.0, yh)], [(x_up, -40), (x_up, yh)], [(x_low, 300), (x_low, yh)]]
    pcs = build(C, cuts, g, tail=('cut', (x_low, yh), (x_low, 300), g, 222, 128),
                roles=[((60, 110), roles[0]), ((180, 70), roles[1]), ((175, 160), roles[2])])
    var(name, pcs)

stagger('K4 stagger 26', 118, 116, 142, 'abc')
stagger('K5 stagger, sage low', 104, 112, 146, 'acb')
stagger('K6 stagger reversed', 126, 140, 112, 'abc')

# Exploded variants: T split, pieces drift along their own directions
def xT(name, x0, yh, nud, roles):
    cuts = [[(x0, -40), (x0, 300)], [(x0, yh), (300, yh)]]
    pcs = build(C, cuts, g, tail=('cut', (x0, 0), (x0, 300), g, 222, 128),
                roles=[((60, 110), roles[0]), ((180, 70), roles[1]), ((175, 160), roles[2])])
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, nud)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

xT('E2 T: right pieces slide apart', 120, 120, [(0, 0), (4, -8), (4, 8)], 'abc')
xT('E3 T: top-right lifts', 120, 128, [(-3, 3), (6, -8), (0, 0)], 'abc')

# Exploded fork: each piece pushed out from J along its bisector
def xfork(name, J, angs, d, roles, tail_out=128):
    stem, up, side = angs
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, up)], [J, ray(J, side)]]
    bis = [((up + 360 + stem) / 2) % 360 if False else 180, (up + side) / 2, (side + stem) / 2]
    rl = [((60, 110), roles[0]), (along(J, unit(bis[1]), 30), roles[1]), (along(J, unit(bis[2]), 30), roles[2])]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, tail_out), roles=rl)
    nud = [(unit(b)[0] * dd, unit(b)[1] * dd) for b, dd in zip(bis, d)]
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, nud)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

xfork('E4 exploded fork, gap 12', (122, 124), (90, -58, 4), (0, 6, 6), 'abc')

# Ribbon / switchback: cuts from alternate edges that stop partway
def ribbon(name):
    cuts = [[(300, 84), (96, 84)], [(-40, 144), (160, 144)]]
    pcs = build(C, cuts, g, tail=('free', 112, 146, (64, 222)), ends='butt')
    var(name, [(p, 'b') for p, _ in pcs])

ribbon('R1 switchback')

# Bent single cut (one bend) + second straight cut from the bend's outside
def bend2(name, J, a1, a2, K, b, roles):
    cuts = [[ray(J, a1), J, ray(J, a2)], [(300, 132), (150, 150), (150, 300)]]
    pcs = build(C, cuts, g, tail=('cut', J, ray(J, a1), g, 222, 128), roles=roles)
    var(name, pcs)

bend2('BB1 two bends', (118, 120), 90, -70, (300, 150), 180,
      [((60, 110), 'a'), ((175, 90), 'b'), ((165, 175), 'c')])

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk5.html')
