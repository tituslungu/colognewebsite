from forms import *
import ad
D = dict(tile={'d': SAGE_L})
V = []
V.append(('S0 designer', *step2()[:2]))
V.append(('S20 high left tread y1=-44 y2=-6 xs=16 (speaker big)', *step2(y1=-44, y2=-6, xs=16, roles=('b','a','d'))[:2], D))
V.append(('I1 inverted: tail piece below, y1=20 y2=-10 xs=-6', *step_inv(y1=20, y2=-10, xs=-6, roles=('a','d','b'))[:2], D))
V.append(('I2 inverted: y1=-6 y2=26 xs=8', *step_inv(y1=-6, y2=26, xs=8, roles=('a','b','d'))[:2], D))
V.append(('I3 inverted, tail piece sage: y1=-6 y2=26 xs=8', *step_inv(y1=-6, y2=26, xs=8, roles=('b','a','d'))[:2], D))
V.append(('S21 dome off-white, both lower sage: y1=-14 y2=22 xs=10', *step2(y1=-14, y2=22, xs=10, g=20, roles=('a','b','d'))[:2], D))
print(ad.render(V, 's9'))
