import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

TAIL = lambda x0, y0, x1, y1: ('cut', (x0, y0), (x1, y1), g, 222, 128)

# Brick-bond: a horizontal cut stopping partway, joints from top and bottom landing on it
def brick(yh, xh0, xh1, xt, xb, roles, name, slant=0):
    # horizontal cut from xh0 to xh1 at yh; top joint at xt from the top edge; bottom joint at xb from the bottom
    cuts = [[(xh0, yh), (xh1, yh)], [(xt, -40), (xt, yh)], [(xb, 300), (xb, yh)]]
    pcs = build(C, cuts, g, tail=TAIL(xb, yh, xb, 300), roles=roles)
    var(name, pcs)

brick(112, -40, 150, 108, 150, [((70, 80), 'c'), ((70, 150), 'a'), ((190, 110), 'b')], 'K1 brick: H from left, joints offset')
brick(104, 100, 300, 100, 146, [((70, 110), 'a'), ((150, 60), 'b'), ((175, 150), 'c')], 'K2 brick mirrored')
brick(128, -40, 160, 112, 160, [((70, 80), 'b'), ((70, 160), 'a'), ((195, 110), 'c')], 'K3')

# Forks with consistent angle language
def fork(J, a_up, a_side, roles, name, stem=90, tail_out=128):
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, a_up)], [J, ray(J, a_side)]]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, tail_out),
                roles=[((60, 120), roles[0]), (along(J, unit((a_up + a_side) / 2), 30), roles[1]),
                       (along(J, unit((a_side + stem) / 2), 30), roles[2])])
    var(name, pcs)

fork((120, 128), -60, 0, 'abc', 'F4 stem 90, up -60, side 0')
fork((120, 140), -60, 0, 'acb', 'F5 small share sage')
fork((116, 124), -75, -15, 'abc', 'F6 narrow fork')
fork((124, 128), -45, 15, 'abc', 'F7 wide fork')

# Exploded: three pieces of a fork pulled away from J
def xfork(J, a_up, a_side, d, roles, name, stem=90):
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, a_up)], [J, ray(J, a_side)]]
    rl = [((60, 120), roles[0]), (along(J, unit((a_up + a_side) / 2), 30), roles[1]), (along(J, unit((a_side + stem) / 2), 30), roles[2])]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, 128), roles=rl)
    dirs = [180 - 5, (a_up + a_side) / 2, (a_side + stem) / 2]
    nud = [unit(a) for a in dirs]
    nud = [(u[0] * dd, u[1] * dd) for u, dd in zip(nud, d)]
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, nud)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

xfork((120, 128), -60, 0, (0, 7, 7), 'abc', 'X1 exploded fork')
xfork((120, 128), -60, 0, (0, 0, 9), 'aba', 'X2 one share pulled out')

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk3.html')
