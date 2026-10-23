import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

def cap(name, J, stem, up, side, roles, tail_out=130):
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, up)], [J, ray(J, side)]]
    rl = [((70, 120), roles[0]), (along(J, unit((up + side) / 2), 16), roles[1]), (along(J, unit((side + stem) / 2), 30), roles[2])]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, tail_out), roles=rl)
    var(name, pcs)

cap('A1 cap: J upper-right', (152, 94), 112, -90, 0, 'acb')
cap('A2 cap smaller', (160, 86), 114, -90, 0, 'acb')
cap('A3 cap, sage cap', (152, 94), 112, -90, 0, 'abc')
cap('A4 cap tilted', (150, 92), 110, -80, 10, 'acb')
cap('A5 cap, J centre', (140, 108), 110, -90, 0, 'acb')

# two bent cuts -> central band
def band(name, c1, c2, roles):
    pcs = build(C, [c1, c2], g, tail=('cut', c1[1], c1[0], g, 222, 128), roles=roles)
    var(name, pcs)

band('B3 bent band', [(110, 300), (110, 120), (70, -40)], [(150, 300), (150, 120), (200, -40)],
     [((60, 140), 'a'), ((130, 80), 'b'), ((190, 140), 'c')])

# drift: fork with only the small piece pulled out
def drift(name, J, angs, d, which_piece, roles):
    stem, up, side = angs
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, up)], [J, ray(J, side)]]
    bis = [180, (up + side) / 2, (side + stem) / 2]
    rl = [((60, 110), roles[0]), (along(J, unit(bis[1]), 20), roles[1]), (along(J, unit(bis[2]), 30), roles[2])]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, 222, 130), roles=rl)
    nud = [(0, 0)] * 3
    for k, dd in zip(which_piece, d):
        u = unit(bis[k]); nud[k] = (u[0] * dd, u[1] * dd)
    moved = [(move(p, *n), r) for (p, r), n in zip(pcs, nud)]
    var(name, moved, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

drift('X4 cap pulled out', (152, 94), (112, -90, 0), [8], [1], 'acb')
drift('X5 both right pulled', (152, 94), (112, -90, 0), [8, 6], [1, 2], 'acb')

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk7.html')
