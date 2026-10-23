from forms import *
import ad
D = dict(tile={'d': SAGE_L})
V = []
V.append(('F10 current geometry, cap deep on light', *fork(roles=('a','b','d'))[:2], D))
# left branch: cap upper-left
V.append(('L1 spine J(14,-4), branch left at y-30 (cap UL)', *spine(jx=14, jy=-4, branches=[(30, 180)],
          roles=[((-40, 40), 'a'), ((-30, -75), 'd'), ((60, 0), 'b')])[:2], D))
V.append(('L2 spine J(14,-4), branch left horizontal at J', *spine(jx=14, jy=-4, branches=[(0, 180)],
          roles=[((-40, 40), 'a'), ((-30, -60), 'd'), ((60, 0), 'b')])[:2], D))
V.append(('L3 spine J(10,10), branch left down -15 from 40 up', *spine(jx=10, jy=10, branches=[(44, 195)],
          roles=[((-40, 40), 'a'), ((-30, -75), 'd'), ((60, 0), 'b')])[:2], D))
V.append(('Q1 4 pieces: branch right at J, left at 46 up', *spine(jx=22, jy=0, branches=[(0, 0), (46, 180)],
          roles=[((-40, 40), 'a'), ((-30, -75), 'd'), ((60, 40), 'b'), ((60, -40), 'c')])[:2], D))
V.append(('R1 right branch from the stem (below J)', *spine(jx=22, jy=-30, branches=[(-36, 0)],
          roles=[((-40, 40), 'a'), ((60, -20), 'b'), ((40, 80), 'd')])[:2], D))
print(ad.render(V, 's7'))
