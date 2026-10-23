import math
from cmp import sheet
from build import *
from v3 import along, L2W, offset_line, inter
def slab(a, L, H, cuts, g, ro, ri, diners, R, GAP, ends=(0,0)):
    """generic rotated slab; ends=(left lean dx, right lean dx) local x offset of top vs bottom at ends; cuts=(top_x,bot_x)"""
    T=-H/2;B=H/2
    edges=[((-L/2+ends[0]/2,T),(-L/2-ends[0]/2,B))]+[((tx,T),(bx,B)) for tx,bx in cuts]+[((L/2+ends[1]/2,T),(L/2-ends[1]/2,B))]
    top=((-L,T),(L,T)); bot=((-L,B),(L,B)); pr=[]
    for i in range(len(edges)-1):
        le,re=edges[i],edges[i+1]
        lp,lq=offset_line(le[0],le[1],-g/2) if i>0 else le
        rp,rq=offset_line(re[0],re[1],g/2) if i<len(edges)-2 else re
        pts=[inter(lp,lq,*top),inter(rp,rq,*top),inter(rp,rq,*bot),inter(lp,lq,*bot)]
        rr=[ro if i==0 else ri, ro if i==len(edges)-2 else ri, ro if i==len(edges)-2 else ri, ro if i==0 else ri]
        pr.append(P(L2W(a,pts),rr,'table'))
    for s,t in diners: pr.append(C(*along(128,128,a,t,s*(H/2+GAP+R)),R,'diner'))
    return pr
k=math.tan(math.radians(18))
H=62
V=[('V wedge flat',slab(0,212,H,((-36+H*k/2,-36-H*k/2),(30-H*k/2,30+H*k/2)),11,10,4,((-1,-3),(1,-74),(1,72)),24,10,ends=(H*k,-H*k))),
   ('V wedge -14',slab(-14,212,H,((-36+H*k/2,-36-H*k/2),(30-H*k/2,30+H*k/2)),11,10,4,((-1,-3),(1,-74),(1,72)),24,10,ends=(H*k,-H*k))),
   ('V wedge uneven -14',slab(-14,214,H,((-50+H*k/2,-50-H*k/2),(14-H*k/2,14+H*k/2)),11,10,4,((-1,-18),(1,-86),(1,64)),24,10,ends=(H*k,-H*k))),
   ('A wedge -14',slab(-14,214,H,((-40-H*k/2,-40+H*k/2),(26+H*k/2,26-H*k/2)),11,10,4,((1,-7),(-1,-80),(-1,66)),24,10,ends=(-H*k,H*k))),
   ('mixed lean -16',slab(-16,214,H+6,((-44+H*k/2,-44-H*k/2),(24,24)),11,14,4,((-1,-80),(1,-12),(-1,64)),24,10,ends=(0,0))),
]
sheet(V,'v3c.html')
