from gen import *
import importlib.util
spec=importlib.util.spec_from_file_location('c2','/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/slant-work/c2.py')
c2=importlib.util.module_from_spec(spec); spec.loader.exec_module(c2)
V=[('current',c2.geom())]
def lt(A=-18,L=200,H=60,R=27,GAP=8,top=(-62,0,62),bot=(-31,31),cuts=(),G=8,RO=16):
    p,s=ital(W=L,H=H,ends=0,cuts=cuts,G=G,RO=RO,RI=4,diners=[],rot_deg=A)
    def along(t,n): r=math.radians(A); return (128+t*math.cos(r)-n*math.sin(r),128+t*math.sin(r)+n*math.cos(r))
    p+=[C(*along(t,-(H/2+GAP+R)),R,'diner') for t in top]+[C(*along(t,(H/2+GAP+R)),R,'diner') for t in bot]
    return p
V.append(('3+2 big',lt(L=196,R=28,top=(-64,0,64),bot=(-32,32))))
V.append(('2+2 R30',lt(L=180,R=30,top=(-20,52),bot=(-52,20))))
V.append(('3+2 cut',lt(L=200,R=26,top=(-64,0,64),bot=(-32,32),cuts=[(130,18)])))
V.append(('3+2 -10',lt(A=-10,L=196,R=28,top=(-64,0,64),bot=(-32,32))))
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s2a.html')
