from concepts import *
import refine
V = []
for a in (124, 131, 138, 146):
    V.append((f'fork a_out {a}', *fork(dict(FORK, a_out=a))[:2]))
for tip in (118, 130):
    V.append((f'fork tip {tip} a_out 138', *fork(dict(FORK, a_out=138, tip=tip))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r6.html')
