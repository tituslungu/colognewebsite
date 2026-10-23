import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

def fork(name, J, angs, roles, tail_out=128, tip=222):
    stem, a, b = angs
    bot = ray(J, stem, 300)
    cuts = [[bot, J, ray(J, a)], [J, ray(J, b)]]
    # roles: piece left of stem (tail piece), piece between a and b, piece between b and stem
    def mid(x, y):
        return along(J, unit((x + y) / 2), 28)
    rl = [(along(J, unit(stem + 90), 40), roles[0]), (mid(a, b), roles[1]), (mid(b, stem), roles[2])]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, tip, tail_out), roles=rl)
    var(name, pcs)

fork('F8 (90,-120,0) J right', (140, 120), (90, -125, 0), 'abc')
fork('F9 (90,-120,0) J left', (118, 126), (90, -120, 0), 'abc')
fork('F10 (90,-115,10)', (128, 128), (90, -115, 12), 'acb')
fork('F11 stem lean', (126, 126), (100, -118, 8), 'abc', tail_out=132)
fork('F12 up-left + down-right', (132, 112), (90, -125, 30), 'abc')

# E7 shares stepping out: right half cut into bands that step right
def steps(name, x0, ys, nud, roles):
    cuts = [[(x0, -40), (x0, 300)]] + [[(x0, y), (300, y)] for y in ys]
    pcs = build(C, cuts, g, tail=('cut', (x0, 0), (x0, 300), g, 222, 128))
    pcs = [(p, r) for p, r in pcs]
    # sort right pieces top to bottom
    left = [p for p, _ in pcs if centroid(p)[0] < x0]
    right = sorted([p for p, _ in pcs if centroid(p)[0] > x0], key=lambda p: centroid(p)[1])
    out = [(left[0], 'a')] + [(move(p, *n), r) for p, n, r in zip(right, nud, roles)]
    var(name, out, [Circle(C.cx + n[0], C.cy + n[1], C.r) for n in nud])

steps('E7 bands step out', 120, [100], [(0, 0), (8, 0)], 'bc')
steps('E8 three bands step', 120, [84, 132], [(0, 0), (7, 0), (3, 0)], 'bcb')

# Peel: right piece rotated about its bottom corner
def rot(poly, c, deg):
    a = math.radians(deg)
    ca, sa = math.cos(a), math.sin(a)
    return [(c[0] + (x - c[0]) * ca - (y - c[1]) * sa, c[1] + (x - c[0]) * sa + (y - c[1]) * ca) for x, y in poly]

def peel(name, x0, yh, deg):
    cuts = [[(x0, -40), (x0, 300)], [(x0, yh), (300, yh)]]
    pcs = build(C, cuts, g, tail=('cut', (x0, 0), (x0, 300), g, 222, 128),
                roles=[((60, 110), 'a'), ((180, 70), 'b'), ((175, 160), 'c')])
    (L, a), (T, b), (B, c) = pcs
    T2 = rot(T, (x0 + g / 2, yh - g / 2), -deg)
    # circles for arc detection: rotated centre
    cc = rot([(C.cx, C.cy)], (x0 + g / 2, yh - g / 2), -deg)[0]
    V.append((name, [(L, 'a'), (T2, 'b'), (B, 'c')], [C, Circle(cc[0], cc[1], C.r)]))

peel('E9 top share lifts (rotate)', 120, 124, 12)

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk6.html')
