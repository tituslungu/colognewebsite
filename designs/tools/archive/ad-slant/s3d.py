from gen import *
import importlib.util
spec=importlib.util.spec_from_file_location('c3','/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/slant-work/c3.py')
c3=importlib.util.module_from_spec(spec); spec.loader.exec_module(c3)
V=[('current',c3.geom())]
TBT=[(0,-1,0),(1,1,0),(2,-1,0)]
for name,rd,cuts in [
    ('S2 λ0/-18',-18,[(98,0),(160,-18)]),
    ('S4 λ9/-9',-18,[(98,9),(160,-9)]),
    ('S6 λ0/-18 rot-22',-22,[(98,0),(160,-18)]),
    ('S7 λ18/0',-18,[(98,18),(160,0)]),
]:
    p,s=ital(W=214,H=64,ends=0,cuts=cuts,G=8,GAP=8,R=27,RO=18,RI=4,diners=TBT,rot_deg=rd); V.append((name,p))
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3d.html')
