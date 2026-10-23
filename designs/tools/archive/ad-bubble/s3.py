from forms import *
import ad
V = []
V.append(('F0 current', *fork()[:2]))
V.append(('F8 J(12,-34) wide flat cap', *fork(jx=12, jy=-34)[:2]))
V.append(('F9 J(28,-8) tall narrow cap', *fork(jx=28, jy=-8)[:2]))
V.append(('F10 J(20,-24) cap deep sage on light', *fork(jx=20, jy=-24, roles=('a','b','d'))[:2], dict(tile={'d': SAGE_L})))
V.append(('F11 J(22,-18) side +12 down', *fork(side=12)[:2]))
V.append(('F12 J(22,-18) stem 104', *fork(stem=104, a_out=124)[:2]))
V.append(('F13 g=18', *fork(g=18)[:2]))
V.append(('F14 J(16,-26) stem 112', *fork(jx=16, jy=-26, stem=112)[:2]))
print(ad.render(V, 's3'))
