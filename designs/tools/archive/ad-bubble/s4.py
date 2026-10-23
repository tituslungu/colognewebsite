from forms import *
import ad
V = []
V.append(('S0 current', *step2()[:2]))
V.append(('S8 tilt -10 (treads rise right)', *step2(tilt=-10, a_out=128)[:2]))
V.append(('S9 tilt +10', *step2(tilt=10, a_out=122)[:2]))
V.append(('S10 tilt -10, y1=-24 y2=16', *step2(tilt=-10, y1=-24, y2=16, a_out=128)[:2]))
V.append(('S11 tilt -10, roles dome off-white / tail sage / share deep', *step2(tilt=-10, a_out=128, roles=('a','b','d'))[:2], dict(tile={'d': SAGE_L})))
V.append(('S12 tilt -10, share = deep sage light', *step2(tilt=-10, a_out=128, roles=('b','a','d'))[:2], dict(tile={'d': SAGE_L})))
V.append(('S13 tilt -18', *step2(tilt=-18, a_out=130)[:2]))
V.append(('S14 S4 + share deep on light', *step2(y1=-22, y2=14, roles=('b','a','d'))[:2], dict(tile={'d': SAGE_L})))
print(ad.render(V, 's4'))
