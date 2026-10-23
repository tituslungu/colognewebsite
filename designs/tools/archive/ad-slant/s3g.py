from gen import *
TBT=[(0,-1,0),(1,1,0),(2,-1,0)]
V=[]
for name,W,cuts,R,G,H in [
    ('g G9',218,[(94,18),(168,0)],28,9,64),
    ('h G11',222,[(96,18),(172,0)],28,11,64),
    ('i G11 H66',222,[(96,18),(172,0)],29,11,66),
    ('j G12 R30',226,[(98,18),(176,0)],30,12,66),
]:
    p,s=ital(W=W,H=H,ends=0,cuts=cuts,G=G,GAP=G,R=R,RO=18,RI=4,diners=TBT,rot_deg=-18); V.append((name,p))
    print(name,[round((x[2]+x[3])/2,1) for x in s])
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3g.html')
