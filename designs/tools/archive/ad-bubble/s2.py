from forms import *
import ad
V = []
V.append(('S0 current', *step()[:2]))
V.append(('S1 roles: dome off-white, speaker sage, share light', *step(roles=('a','b','c'))[:2]))
V.append(('S2 roles: dome sage, speaker off-white, share off-white', *step(roles=('b','a','a'))[:2]))
V.append(('S3 roles: dome light, speaker off-white, share sage', *step(roles=('c','a','b'))[:2]))
V.append(('S4 smaller step y1=-22 y2=14', *step(y1=-22, y2=14)[:2]))
V.append(('S5 step up: y1=20 y2=-26 (left low)', *step(y1=20, y2=-26)[:2]))
V.append(('S6 y1=-40 y2=10 xs=6', *step(y1=-40, y2=10, xs=6)[:2]))
V.append(('S7 roles dome off-white, speaker sage, share sage-dark', *step(roles=('a','b','d'))[:2], dict(tile={'d': SAGE_L})))
print(ad.render(V, 's2'))
