from concepts import *
import refine
V = []
for (h, xu, xl, roles) in [(-20, -18, 6, ('a','a','b')), (-20, -18, 6, ('c','a','b')), (-26, -22, 2, ('a','a','b')),
                           (-14, -26, 0, ('a','a','b')), (-30, -10, 10, ('a','a','b')), (-20, -24, -2, ('a','a','b'))]:
    V.append((f'offset h{h} xu{xu} xl{xl} {"".join(roles)}', *offset(dict(OFFSET, h=h, xu=xu, xl=xl, roles=roles))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r21.html')
