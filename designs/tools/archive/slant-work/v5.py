import importlib, math
from cmp import sheet
from build import *
import c3
def var(**kw):
    m=importlib.reload(c3)
    for k,v in kw.items(): setattr(m,k,v)
    return m.geom()
def kinked(a0=-10, a1=-26, L0=120, L1=96, H=60, gap=10, r=16, R=24, GAP=10, d0=((-1,-28),(1,30)), d1=((-1,20),)):
    # table 0 centred left, table 1 continues from its right end, rotated by a1; joint gap wedge
    c=(128,128)
    # place joint point J at origin; table0 extends left from J along a0, table1 right along a1
    def along(o,a,t,n): r_=math.radians(a); return (o[0]+t*math.cos(r_)-n*math.sin(r_), o[1]+t*math.sin(r_)+n*math.cos(r_))
    J=(0,0)
    c0=along(J,a0,-(L0/2+gap/2),0); c1=along(J,a1,(L1/2+gap/2),0)
    def rect(cn,a,L): return [rot((cn[0]+x,cn[1]+y),cn,a) for x,y in [(-L/2,-H/2),(L/2,-H/2),(L/2,H/2),(-L/2,H/2)]]
    pr=[P(rect(c0,a0,L0),r,'table'),P(rect(c1,a1,L1),r,'table')]
    for s,t in d0: pr.append(C(*along(c0,a0,t,s*(H/2+GAP+R)),R,'diner'))
    for s,t in d1: pr.append(C(*along(c1,a1,t,s*(H/2+GAP+R)),R,'diner'))
    # recentre
    x0,y0,x1,y1=bbox(pr); dx,dy=128-(x0+x1)/2,128-(y0+y1)/2
    out=[]
    for p in pr:
        if p[0]=='c': out.append(('c',(p[1][0]+dx,p[1][1]+dy),p[2],p[3]))
        else: out.append(('p',[(x+dx,y+dy) for x,y in p[1]],p[2],p[3]))
    return out
V=[('seams thin',var(H=58,L=224,G=7,GAP=9,R=22,X=(-30,34),LEAN=0.3,RO=14)),
   ('seams perp+lean',var(H=58,L=224,G=7,GAP=9,R=22,X=(-30,34),LEAN=0.0,RO=14)),
   ('kinked 2',kinked()),
   ('kinked 2 b',kinked(a0=-8,a1=-28,L0=110,L1=110,d0=((-1,-20),),d1=((1,10),(-1,30)))),
   ('kinked 3',kinked(a0=-6,a1=-30,L0=130,L1=80,d0=((-1,-34),(1,10)),d1=((-1,6),))),
]
sheet(V,'v5.html')
