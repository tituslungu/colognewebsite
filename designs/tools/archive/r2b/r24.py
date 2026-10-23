import math
from concepts import *
import refine
V = []
c, s = math.cos(math.radians(15)), math.sin(math.radians(15))
for dd in (8, 11, 14):
    v = (c * dd, -s * dd)
    V.append((f'far cracks, top pair slips {dd}', *drift(dict(DRIFT, d=dict(TL=v, TR=v)))[:2]))
v = (c * 11, -s * 11)
V.append(('slip 11, 3-tone', *drift(dict(DRIFT, d=dict(TL=v, TR=v), roles=dict(TL='c', BL='a', TR='b', BR='c')))[:2]))
V.append(('slip 11, yl -30 yr 44', *drift(dict(DRIFT, yl=-30.0, yr=44.0, d=dict(TL=v, TR=v)))[:2]))
V.append(('slip 11, yl -46 yr 30', *drift(dict(DRIFT, yl=-46.0, yr=30.0, d=dict(TL=v, TR=v)))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r24.html')
