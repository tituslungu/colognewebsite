from forms import *
import ad
D = dict(tile={'d': SAGE_L}, k=0.84)
def I(xs, y1, y2, tx=-20, a2=128, g=21.0, roles=('a','b','d')):
    return step_inv(y1=y1, y2=y2, xs=xs, g=g, tipx=tx, a1=a_for(tx), a2=a2, roles=roles)[:2]
V = []
V.append(('I12 xs=26 y1=-16 y2=18 tail -24/130', *I(26, -16, 18, tx=-24, a2=130), D))
V.append(('I14 xs=24 y1=-14 y2=20 tail -24/130', *I(24, -14, 20, tx=-24, a2=130), D))
V.append(('I15 xs=28 y1=-18 y2=20 tail -22/128', *I(28, -18, 20, tx=-22, a2=128), D))
V.append(('I16 xs=24 y1=-20 y2=16 tail -26/131', *I(24, -20, 16, tx=-26, a2=131), D))
print(ad.render(V, 's12'))
