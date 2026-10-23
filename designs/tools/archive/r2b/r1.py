from concepts import *
import refine
V = []
for stem in (108, 114, 120):
    p = dict(FORK, stem=stem)
    V.append((f'fork stem {stem}', *fork(p)[:2]))
V.append(('step', *step()[:2]))
V.append(('drift', *drift()[:2]))
V.append(('fork J (22,-30)', *fork(dict(FORK, jx=22, jy=-30))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r1.html')
