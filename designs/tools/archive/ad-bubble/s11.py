from forms import *
import ad
D = dict(tile={'d': SAGE_L}, k=0.84)
def I(xs, y1, y2, tx=-20, a2=128, g=21.0, roles=('a','b','d')):
    return step_inv(y1=y1, y2=y2, xs=xs, g=g, tipx=tx, a1=a_for(tx), a2=a2, roles=roles)[:2]
V = []
V.append(('I5 xs=18 y1=-8 y2=24', *I(18, -8, 24), D))
V.append(('I9 xs=26 y1=-12 y2=22', *I(26, -12, 22), D))
V.append(('I10 xs=14 y1=-16 y2=26', *I(14, -16, 26), D))
V.append(('I11 xs=22 y1=-4 y2=30', *I(22, -4, 30), D))
V.append(('I12 xs=26 y1=-16 y2=18 tail -24/130', *I(26, -16, 18, tx=-24, a2=130), D))
V.append(('I13 xs=-18 y1=26 y2=-10 mirror step (left deep)', *I(-18, 26, -10, roles=('a','d','b')), D))
print(ad.render(V, 's11'))
