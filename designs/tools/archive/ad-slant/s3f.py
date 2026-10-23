from gen import *
from s1b import s1
TBT=[(0,-1,0),(1,1,0),(2,-1,0)]
V=[('s1 G',s1(SPLIT=0.64,DX=46,RO=16,RA=10))]
for name,W,cuts,R,G in [
    ('e 92/166',214,[(92,18),(166,0)],27,8),
    ('f 90/162 R28',214,[(90,18),(162,0)],28,8),
    ('g 94/168 W218 G9',218,[(94,18),(168,0)],28,9),
]:
    p,s=ital(W=W,H=64,ends=0,cuts=cuts,G=G,GAP=G,R=R,RO=18,RI=4,diners=TBT,rot_deg=-18); V.append((name,p))
    print(name,[round((x[2]+x[3])/2,1) for x in s])
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3f.html')
