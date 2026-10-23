import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra_circles=(), ov=None):
    V.append((name, pieces, [C, *extra_circles], ov) if ov else (name, pieces, [C, *extra_circles]))

# 1. Fork: stem up from the tail, splits at J into two branches of different angles
def fork(J, a_up, a_side, stem_x_bottom=None, roles='abc', name='fork', tail_out=128, tip=222):
    bot = (stem_x_bottom if stem_x_bottom is not None else J[0], 300)
    cuts = [[bot, J, ray(J, a_up)], [J, ray(J, a_side)]]
    pcs = build(C, cuts, g, tail=('cut', J, bot, g, tip, tail_out),
                roles=[((60, 120), roles[0]), (along(J, unit((a_up + a_side) / 2), 30), roles[1]),
                       (along(J, unit((a_side + 90) / 2), 30), roles[2])])
    var(name, pcs)

fork((122, 132), -62, 8, roles='abc', name='F1 fork: up-right + right')
fork((122, 132), -62, 8, roles='aba', name='F1 one share')
fork((120, 150), -70, -10, roles='abc', name='F2 fork low')
fork((124, 110), -55, 22, roles='abc', name='F3 fork high')

# 2. Stepped cut: up from tail, jog right, up again (2 pieces) + a branch from the jog to the right edge
def step(x1, y_step, x2, branch=None, roles='abc', name='step'):
    cuts = [[(x1, 300), (x1, y_step), (x2, y_step), (x2, -40)]]
    if branch:
        cuts.append([branch[0], ray(branch[0], branch[1])])
    rl = [((60, 120), roles[0]), ((190, 90), roles[1])]
    if branch:
        rl.append(((185, 170), roles[2]))
    pcs = build(C, cuts, g, tail=('cut', (x1, y_step), (x1, 300), g, 222, 128), roles=rl)
    var(name, pcs)

step(112, 120, 146, name='S1 step', roles='ab')
step(112, 112, 150, branch=((150, 150), 12), name='S2 step + branch')

# 3. Two junctions joined by a short bridge (4 pieces)
def bridge(J1, J2, a1, a2, b1, b2, roles='abca', name='bridge'):
    cuts = [[ray(J1, a1), J1, ray(J1, a2)], [J1, J2], [ray(J2, b1), J2, ray(J2, b2)]]
    pcs = build(C, cuts, g, roles=None)
    var(name, pcs)

bridge((112, 100), (148, 132), -100, 200, -20, 90, name='B1 bridge')
bridge((106, 114), (150, 114), -110, 110, -70, 70, name='B2 bridge level')

# 4. Slits from the edge that stop partway
def slits(lines, name, tail=True):
    pcs = build(C, lines, g, tail=('free', 110, 150, (62, 222)) if tail else None, ends='round')
    var(name, [(p, 'b') for p, _ in pcs])

slits([[(128, -40), (128, 100)], [(300, 150), (150, 150)], [(-40, 140), (90, 140)]], 'P1 three slits')

# 5. Exploded: message-2 split plus a right-hand cut, pieces nudged apart
def exploded(name, J=(128, 128), a=20, nud=((0, 0), (5, -5), (6, 5))):
    cuts = [[(J[0], 300), (J[0], -40)], [J, ray(J, a)]]
    pcs = build(C, cuts, g, tail=('cut', (J[0], 0), (J[0], 300), g, 222, 128),
                roles=[((60, 120), 'a'), ((180, 80), 'b'), ((170, 165), "c")])
    moved = [(move(p, *nud[i]), r) for i, (p, r) in enumerate(pcs)]
    var(name, moved, [Circle(C.cx + dx, C.cy + dy, C.r) for dx, dy in nud])

exploded('E1 exploded T')

# 6. Chevron cuts
def chevrons(name):
    cuts = [[(100, -40), (118, 114), (100, 300)], [(150, -40), (168, 114), (150, 300)]]
    pcs = build(C, cuts, g, tail=('cut', (118, 114), (100, 300), g, 222, 128))
    var(name, pcs)

chevrons('C1 chevrons')

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk2.html')
