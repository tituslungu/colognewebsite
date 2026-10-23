from concepts import *
import refine
V = []
V.append(('top pair slides right 8', *drift(dict(DRIFT, d=dict(TL=(8.0, -2.0), TR=(8.0, -2.0))))[:2]))
V.append(('top pair slides right 12', *drift(dict(DRIFT, d=dict(TL=(12.0, -3.0), TR=(12.0, -3.0))))[:2]))
V.append(('top pair left, bottom right', *drift(dict(DRIFT, d=dict(TL=(-5.0, -2.0), TR=(-5.0, -2.0), BL=(5.0, 1.0), BR=(5.0, 1.0))))[:2]))
V.append(('right pair down, left pair up', *drift(dict(DRIFT, d=dict(TL=(-3.0, -6.0), BL=(-3.0, -6.0), TR=(3.0, 6.0), BR=(3.0, 6.0))))[:2]))
V.append(('TL & BR out (diagonal)', *drift(dict(DRIFT, d=dict(TL=(-8.0, -5.0), BR=(8.0, 5.0))))[:2]))
V.append(('TR & BL out', *drift(dict(DRIFT, d=dict(TR=(8.0, -5.0), BL=(-6.0, 4.0))))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r16.html')
