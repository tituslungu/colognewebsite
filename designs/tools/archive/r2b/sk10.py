import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

# K9: stepped horizontal (dome on top) + vertical from the step down to the tail
def kdome(name, y1, y2, xs, xv, roles):
    # horizontal from left edge at y1 to xs, step down to y2, right edge at y2; vertical from (xv,y2) down
    cuts = [[(-40, y1), (xs, y1), (xs, y2), (300, y2)], [(xv, y2), (xv, 300)]]
    if xv == xs:
        cuts = [[(-40, y1), (xs, y1), (xs, 300)], [(xs, y2), (300, y2)]]
    pcs = build(C, cuts, g, tail=('cut', (xv, y2), (xv, 300), g, 222, 128),
                roles=[((128, 60), roles[0]), ((70, 160), roles[1]), ((180, 160), roles[2])])
    var(name, pcs)

kdome('K9 dome, step at joint', 112, 140, 128, 128, 'abc')
kdome('K10 dome, step left of joint', 104, 136, 100, 140, 'abc')
kdome('K11 dome b/c swap', 112, 140, 128, 128, 'cab')

# Drift on message-2 composition: right half split by a slanted cut, pieces drift right by different amounts
def drift2(name, x0, J, a, nud, roles, cut_left=False):
    cuts = [[(x0, -40), (x0, 300)], [J, ray(J, a)]]
    pcs = build(C, cuts, g, tail=('cut', (x0, 0), (x0, 300), g, 222, 128),
                roles=[((60, 110), roles[0]), ((185, 70), roles[1]), ((175, 165), roles[2])])
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, nud)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

drift2('D3 drift: top share out', 122, (122, 120), -15, [(0, 0), (8, -6), (2, 2)], 'abc')
drift2('D4 drift: both out', 122, (122, 120), -15, [(-3, 2), (9, -5), (5, 6)], 'abc')

# Drift on the cap fork composition
def capdrift(name, J, stem, up, side, nud, roles):
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, up)], [J, ray(J, side)]]
    rl = [((70, 120), roles[0]), (along(J, unit((up + side) / 2), 16), roles[1]), (along(J, unit((side + stem) / 2), 30), roles[2])]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, 130), roles=rl)
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, nud)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

capdrift('D5 cap fork drift', (150, 92), 110, -80, 10, [(-3, 2), (7, -7), (6, 4)], 'acb')

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk10.html')
