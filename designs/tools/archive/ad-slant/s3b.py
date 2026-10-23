from gen import *
import importlib.util
spec=importlib.util.spec_from_file_location('c3','/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/slant-work/c3.py')
c3=importlib.util.module_from_spec(spec); spec.loader.exec_module(c3)
V=[('current',c3.geom())]
# slab frame: rectangle ends (lean 0), cuts / and \ mirrored (+18,-18) -> Λ wedge, diners TL(big) B(mid) TR(small)
for name,rd,W,cuts,R,H in [
    ('rot-16 Λ18',-16,214,[(98,18),(160,-18)],27,64),
    ('rot-18 Λ18 big',-18,214,[(104,18),(166,-18)],27,64),
    ('rot-14 Λ24',-14,214,[(100,24),(162,-24)],27,64),
    ('ital TL/B/TR',0,214,[(100,18),(162,-18)],27,64),
]:
    ends=0 if rd else 18
    p,s=ital(W=W,H=H,ends=ends,cuts=cuts,G=8,GAP=8,R=R,RO=18,RI=4,diners=[(0,-1,0),(1,1,0),(2,-1,0)],rot_deg=rd); V.append((name,p))
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3b.html')
