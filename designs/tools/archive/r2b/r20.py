from concepts import *
import refine
V = []
for (tl, tr, yl, yr, sl, nm) in [((-8, 0), (8, 0), -14, 26, 15, 'spread 8, parallel 15'),
                                 ((-6, -3), (6, -3), -14, 26, 15, 'spread 6 up 3'),
                                 ((-8, 0), (8, 0), -30, 10, 15, 'spread 8, cracks higher'),
                                 ((-8, 0), (8, 0), -20, 20, 0, 'spread 8, level cracks'),
                                 ((-10, 0), (10, 0), -14, 26, 15, 'spread 10'),
                                 ((-8, 0), (8, 0), -14, 26, 15, '3-tone')]:
    roles = dict(TL='a', BL='a', TR='b', BR='b') if nm != '3-tone' else dict(TL='c', BL='a', TR='b', BR='c')
    V.append((nm, *drift(dict(DRIFT, yl=yl, yr=yr, slant=sl, d=dict(TL=tl, TR=tr), roles=roles))[:2]))
refine.render(V, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/r20.html')
