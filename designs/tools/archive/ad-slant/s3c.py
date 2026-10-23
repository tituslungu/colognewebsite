from gen import *
import importlib.util
spec=importlib.util.spec_from_file_location('c3','/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/slant-work/c3.py')
c3=importlib.util.module_from_spec(spec); spec.loader.exec_module(c3)
V=[('current',c3.geom())]
D_TBT=[(0,-1,0),(1,1,0),(2,-1,0)]
D_BTB=[(0,1,0),(1,-1,0),(2,1,0)]
for name,rd,cuts,dn in [
    ('fan 4/22 TBT',-18,[(100,4),(162,22)],D_TBT),
    ('fan -6/-24 TBT',-18,[(100,-6),(162,-24)],D_TBT),
    ('vert+perp TBT',-18,[(100,0),(162,18)],D_TBT),
    ('steep-28 fan TBT',-28,[(100,4),(162,22)],D_TBT),
    ('-18 fan BTB',-18,[(100,-4),(162,-22)],D_BTB),
    ('+18 fan BTB',18,[(100,4),(162,22)],D_BTB),
]:
    p,s=ital(W=214,H=64,ends=0,cuts=cuts,G=8,GAP=8,R=27,RO=18,RI=4,diners=dn,rot_deg=rd); V.append((name,p))
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3c.html')
