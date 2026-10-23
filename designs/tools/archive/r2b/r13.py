from concepts import *
import refine
V = []
V.append(('drift default', *drift()[:2]))
V.append(('drift d 5', *drift(dict(DRIFT, d=dict(TL=5.0, TR=5.0, BR=4.0)))[:2]))
V.append(('drift d 9', *drift(dict(DRIFT, d=dict(TL=9.0, TR=9.0, BR=7.0)))[:2]))
V.append(('drift slant 20, yl -20 yr 24', *drift(dict(DRIFT, slant=20.0, yl=-20.0, yr=24.0))[:2]))
V.append(('drift no nudge', *drift(dict(DRIFT, d={}))[:2]))
V.append(('drift right pair sage/light', *drift(dict(DRIFT, roles=dict(TL='a', BL='a', TR='c', BR='b')))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r13.html')
