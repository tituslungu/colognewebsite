import math
from concepts import *
import refine
V = []
c, s = math.cos(math.radians(15)), math.sin(math.radians(15))
for dd in (8, 12, 16):
    v = (c * dd, -s * dd)
    V.append((f'top pair slips up-right {dd}', *drift(dict(DRIFT, d=dict(TL=v, TR=v)))[:2]))
for dd in (10,):
    v = (-c * dd, s * dd)
    V.append((f'bottom pair slips down-left {dd}', *drift(dict(DRIFT, d=dict(BL=v, BR=v)))[:2]))
    v2 = (c * 6, -s * 6); v3 = (-c * 6, s * 6)
    V.append((f'top up-right 6, bottom down-left 6', *drift(dict(DRIFT, d=dict(TL=v2, TR=v2, BL=v3, BR=v3)))[:2]))
    V.append((f'same, 3-tone', *drift(dict(DRIFT, d=dict(TL=v2, TR=v2, BL=v3, BR=v3), roles=dict(TL='c', BL='a', TR='b', BR='b')))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r17.html')
