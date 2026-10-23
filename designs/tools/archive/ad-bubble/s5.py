import math
from forms import *
import ad
from concepts import drift, DRIFT, offset, OFFSET
V = []
V.append(('D0 drift current', *drift()[:2]))
c, s = math.cos(math.radians(15)), math.sin(math.radians(15))
V.append(('D5 drift no nudge (reference)', *drift(dict(DRIFT, d=dict()))[:2]))
V.append(('D1 designer offset (a,a,b)', *offset()[:2]))
V.append(('D2 offset (c,a,b)', *offset(dict(OFFSET, roles=('c','a','b')))[:2]))
c3, s3 = math.cos(math.radians(30)), math.sin(math.radians(30))
v = (c3 * 9, -s3 * 9)
V.append(('D3 drift slant 30 slip 9', *drift(dict(DRIFT, slant=30.0, yl=-34.0, yr=34.0, d=dict(TL=v, TR=v)))[:2]))
v = (-c * 12, s * 12)
V.append(('D4 drift: only TL slides out (left)', *drift(dict(DRIFT, d=dict(TL=v)))[:2]))
print(ad.render(V, 's5'))
