from forms import *
import ad
D = dict(tile={'d': SAGE_L})
V = []
V.append(('S14 y1=-22 y2=14 share deep', *step2(y1=-22, y2=14, roles=('b','a','d'))[:2], D))
V.append(('S15 low step y1=4 y2=40', *step2(y1=4, y2=40, roles=('b','a','d'))[:2], D))
V.append(('S16 y1=-10 y2=30', *step2(y1=-10, y2=30, roles=('b','a','d'))[:2], D))
V.append(('S17 y1=-10 y2=30 xs=4', *step2(y1=-10, y2=30, xs=4, roles=('b','a','d'))[:2], D))
V.append(('S18 y1=-14 y2=22 xs=10 g=20', *step2(y1=-14, y2=22, xs=10, g=20, roles=('b','a','d'))[:2], D))
V.append(('S19 y1=-14 y2=22 xs=10 tilt +6', *step2(y1=-14, y2=22, xs=10, tilt=6, a_out=124, roles=('b','a','d'))[:2], D))
print(ad.render(V, 's6'))
