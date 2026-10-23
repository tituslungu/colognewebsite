"""Art-director finals for slant-1 and slant-3 (shared metrics: slab 64, gap 11, clearance 11, diner r30, lean 18deg)."""
from gen import *
from s1b import s1
def centroid(prims):
    A=Sx=Sy=0
    for pr in prims:
        pts=samples(pr); n=len(pts)
        a=cx=cy=0
        for i in range(n):
            x0,y0=pts[i]; x1,y1=pts[(i+1)%n]; c=x0*y1-x1*y0; a+=c; cx+=(x0+x1)*c; cy+=(y0+y1)*c
        a/=2; A+=abs(a); Sx+=cx/6*(1 if a>0 else -1); Sy+=cy/6*(1 if a>0 else -1)
    return Sx/A, Sy/A
def S1(): return s1(SPLIT=0.64, DX=46, RO=16, RA=10, RI=4, G=11, GAP=11, R=30, H=64, W=184)
def S3():
    p,s=ital(W=224,H=64,ends=0,cuts=[(96,18),(172,0)],G=11,GAP=11,R=30,RO=16,RI=4,
             diners=[(0,-1,0),(1,1,0),(2,-1,0)],rot_deg=-18)
    return p,s
if __name__=='__main__':
    for n,pr in [('s1',S1()),('s3',S3()[0])]:
        x0,y0,x1,y1=bbox(pr); print(n,'bbox c',round((x0+x1)/2,2),round((y0+y1)/2,2),'centroid',[round(v,2) for v in centroid(pr)],'size',round(x1-x0,1),round(y1-y0,1))
    print([round((x[2]+x[3])/2,1) for x in S3()[1]])
