from gen import *
spec=importlib.util.spec_from_file_location('c3','/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/slant-work/c3.py')
c3=importlib.util.module_from_spec(spec); spec.loader.exec_module(c3)
V=[('current',c3.geom())]
# italic, BL/TC/TR: big(L, below) \ medium(above) / small(above)
p,s=ital(W=204,cuts=[(96,-18),(152,18)],diners=[(0,1,0),(1,-1,0),(2,-1,0)]); V.append(('ital V-cuts',p))
p,s=ital(W=204,cuts=[(100,-10),(154,18)],diners=[(0,1,0),(1,-1,0),(2,-1,0)]); V.append(('ital -10/18',p))
p,s=ital(W=204,cuts=[(100,0),(154,18)],diners=[(0,1,0),(1,-1,0),(2,-1,0)]); V.append(('ital 0/18',p))
# rotated slab rising, BL/TC/TR
p,s=ital(W=212,ends=0,cuts=[(100,-14),(156,14)],diners=[(0,1,0),(1,-1,0),(2,-1,0)],RO=18,rot_deg=-16); V.append(('rot BL/TC/TR',p))
p,s=ital(W=212,ends=0,cuts=[(100,-14),(156,14)],diners=[(0,1,0),(1,-1,0),(2,-1,0)],RO=18,rot_deg=14); V.append(('rot+ BL/TC/TR',p))
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3a.html')
