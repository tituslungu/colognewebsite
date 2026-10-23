from concepts import *
import refine
V = []
for (y1, y2, xs, roles) in [(-24, 22, 2, ('b', 'a', 'c')), (-24, 22, 2, ('a', 'b', 'c')), (-30, 20, 16, ('b', 'a', 'c')),
                            (-30, 20, 16, ('a', 'b', 'c')), (-16, 30, 10, ('b', 'a', 'c')), (-36, 10, 6, ('b', 'a', 'c'))]:
    V.append((f'step y1 {y1} y2 {y2} xs {xs} {"".join(roles)}', *step(dict(STEP, y1=y1, y2=y2, xs=xs, roles=roles))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r12.html')
