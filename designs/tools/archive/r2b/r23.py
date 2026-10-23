from concepts import *
import refine
V = []
V.append(('current', *drift()[:2]))
V.append(('yl -40, yr 40', *drift(dict(DRIFT, yl=-40.0, yr=40.0, d=dict(TL=(-7.0, -4.0), TR=(7.0, -2.0), BR=(4.0, 4.0))))[:2]))
V.append(('yl -34, yr 34, slant 20', *drift(dict(DRIFT, yl=-34.0, yr=34.0, slant=20.0, d=dict(TL=(-7.0, -4.0), TR=(7.0, -2.0), BR=(4.0, 4.0))))[:2]))
V.append(('yl -40, yr 40, 3-tone', *drift(dict(DRIFT, yl=-40.0, yr=40.0, d=dict(TL=(-7.0, -4.0), TR=(7.0, -2.0), BR=(4.0, 4.0)), roles=dict(TL='c', BL='a', TR='b', BR='c')))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r23.html')
