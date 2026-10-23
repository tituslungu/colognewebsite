from forms import *
import ad
D = dict(tile={'d': SAGE_L})
V = []
V.append(('P1 current geometry, cap deep on light', *fork(roles=('a','b','d'))[:2], D))
V.append(('P2 stem 115 J(26,-20) tip 120', *fork(jx=26, jy=-20, stem=115, tip=120, roles=('a','b','d'))[:2], D))
V.append(('P3 stem 116 J(24,-14) tip 118 a_out 128', *fork(jx=24, jy=-14, stem=116, tip=118, a_out=128, roles=('a','b','d'))[:2], D))
V.append(('P4 stem 114 J(22,-22) tip 120 g 20', *fork(jx=22, jy=-22, stem=114, tip=120, g=20, roles=('a','b','d'))[:2], D))
V.append(('P5 stem 112 J(20,-20) tip 122', *fork(jx=20, jy=-20, stem=112, tip=122, roles=('a','b','d'))[:2], D))
V.append(('P6 P2 with cap light on light too', *fork(jx=26, jy=-20, stem=115, tip=120, roles=('a','b','c'))[:2]))
print(ad.render(V, 's8'))
