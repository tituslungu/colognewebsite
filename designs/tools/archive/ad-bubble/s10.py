import math
from forms import *
import ad
D = dict(tile={'d': SAGE_L})
def a_for(x):
    return math.degrees(math.acos(x / 100))
V = []
V.append(('S18 step refined (tail from cut)', *step2(y1=-14, y2=22, xs=10, g=20, roles=('b','a','d'))[:2], D))
V.append(('I4 inverted, m2 tail tip x=-14, xs=8 y1=-6 y2=26', *step_inv(y1=-6, y2=26, xs=8, tipx=-14, a1=a_for(-14), a2=126, roles=('a','b','d'))[:2], D))
V.append(('I5 inverted xs=18 y1=-8 y2=24, tail x=-20', *step_inv(y1=-8, y2=24, xs=18, tipx=-20, a1=a_for(-20), a2=128, roles=('a','b','d'))[:2], D))
V.append(('I6 inverted xs=-14 y1=24 y2=-6 (left tall), tail x=-20', *step_inv(y1=24, y2=-6, xs=-14, tipx=-20, a1=a_for(-20), a2=128, roles=('a','d','b'))[:2], D))
V.append(('I7 inverted xs=22 y1=-14 y2=18', *step_inv(y1=-14, y2=18, xs=22, tipx=-16, a1=a_for(-16), a2=126, roles=('a','b','d'))[:2], D))
V.append(('I8 I5 but share colours swapped', *step_inv(y1=-8, y2=24, xs=18, tipx=-20, a1=a_for(-20), a2=128, roles=('a','d','b'))[:2], D))
print(ad.render(V, 's10'))
