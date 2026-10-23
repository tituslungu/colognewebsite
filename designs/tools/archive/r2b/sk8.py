import math
from geo import *
from kit import *
import sheet

C = Circle(128, 114, 84)
g = 18
V = []

def var(name, pieces, extra=()):
    V.append((name, pieces, [C, *extra]))

# Two bent cuts (no junction, no straight through-cut)
def bends(name, c1, c2, rl, tail_seg):
    pcs = build(C, [c1, c2], g, tail=('cut', tail_seg[0], tail_seg[1], g, 222, 128), roles=rl)
    var(name, pcs)

# cut 1 rises from the tail and turns left; cut 2 drops from the top and turns right
bends('N1 L + L (point-symmetric)', [(112, 300), (112, 140), (-40, 140)], [(146, -40), (146, 90), (300, 90)],
      [((70, 90), 'a'), ((80, 170), 'c'), ((185, 60), 'b')], ((112, 140), (112, 300)))
bends('N2 tail piece big, cap', [(112, 300), (112, 150), (-40, 120)], [(150, -40), (150, 84), (300, 96)],
      [((128, 110), 'a'), ((84, 160), "c"), ((190, 60), 'b')], ((112, 150), (112, 300)))
# both cuts bend the same way
bends('N3 two right-angle bends', [(112, 300), (112, 128), (300, 128)], [(150, -40), (150, 90), (300, 90)],
      [((70, 110), 'a'), ((190, 60), 'b'), ((175, 170), 'c')], ((112, 128), (112, 300)))
# obtuse bends
bends('N4 obtuse bends', [(108, 300), (120, 136), (-40, 100)], [(140, -40), (150, 96), (300, 120)],
      [((128, 120), 'a'), ((84, 160), "c"), ((190, 70), 'b')], ((120, 136), (108, 300)))
# stagger orthogonal
def stagger(name, yh, x_low, x_up, roles):
    cuts = [[(300, yh), (x_low, yh)], [(x_up, -40), (x_up, yh)], [(x_low, 300), (x_low, yh)]]
    pcs = build(C, cuts, g, tail=('cut', (x_low, yh), (x_low, 300), g, 222, 128),
                roles=[((60, 110), roles[0]), ((180, 70), roles[1]), ((175, 160), roles[2])])
    var(name, pcs)

stagger('K7 stagger 36', 110, 108, 144, 'abc')
stagger('K8 stagger, small top', 96, 112, 150, 'acb')

sheet.write(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/sk8.html')
