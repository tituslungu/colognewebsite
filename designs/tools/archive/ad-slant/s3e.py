from gen import *
TBT=[(0,-1,0),(1,1,0),(2,-1,0)]
V=[]
for name,W,cuts,R,G,RO in [
    ('S7 98/160',214,[(98,18),(160,0)],27,8,18),
    ('b 104/166',214,[(104,18),(166,0)],27,8,18),
    ('c 106/170 W220',220,[(106,18),(170,0)],28,9,18),
    ('d 100/164 G9',214,[(100,18),(164,0)],28,9,16),
]:
    p,s=ital(W=W,H=64,ends=0,cuts=cuts,G=G,GAP=G,R=R,RO=RO,RI=4,diners=TBT,rot_deg=-18); V.append((name,p))
    print(name,[round(x[2],1) for x in s],[round(x[3],1) for x in s])
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s3e.html')
