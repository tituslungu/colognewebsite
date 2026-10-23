import math
from cmp import sheet
from build import *
def along(cx,cy,a,t,n=0):
    r=math.radians(a); return (cx+t*math.cos(r)-n*math.sin(r), cy+t*math.sin(r)+n*math.cos(r))
def L2W(a,pts): return [rot((128+x,128+y),(128,128),a) for x,y in pts]
def offset_line(p,q,d):
    # shift segment p->q by d along its left normal
    dx,dy=q[0]-p[0],q[1]-p[1]; l=math.hypot(dx,dy); nx,ny=-dy/l,dx/l
    return (p[0]+nx*d,p[1]+ny*d),(q[0]+nx*d,q[1]+ny*d)
def inter(p1,p2,p3,p4):
    x1,y1=p1;x2,y2=p2;x3,y3=p3;x4,y4=p4
    den=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
    t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den
    return (x1+t*(x2-x1),y1+t*(y2-y1))
def cuts3(a=-20,L=214,H=74,cuts=((-38,-22),(26,48)),g=10,R=23,GAP=9,diners=((-1,-70),(1,6),(-1,74)),ro=24,ri=4):
    # local slab x in [-L/2,L/2], y in [-H/2,H/2]; cut i passes (top_x,-H/2)->(bot_x,H/2)
    T=-H/2;B=H/2
    lines=[]
    for (tx,bx) in cuts:
        p,q=(tx,T),(bx,B); lines.append((p,q))
    pieces=[]; edges=[None]+lines+[None]
    for i in range(len(edges)-1):
        le,re=edges[i],edges[i+1]
        top=((-L/2,T),(L/2,T)); bot=((-L/2,B),(L/2,B))
        if le: lp,lq=offset_line(le[0],le[1],-g/2)  # shift right
        if re: rp,rq=offset_line(re[0],re[1],g/2)   # shift left
        tl=inter(lp,lq,*top) if le else (-L/2,T); bl=inter(lp,lq,*bot) if le else (-L/2,B)
        tr=inter(rp,rq,*top) if re else (L/2,T); br=inter(rp,rq,*bot) if re else (L/2,B)
        pts=L2W(a,[tl,tr,br,bl])
        rr=[ro if not le else ri, ro if not re else ri, ro if not re else ri, ro if not le else ri]
        pieces.append(P(pts,rr,'table'))
    for s,t in diners: pieces.append(C(*along(128,128,a,t,s*(H/2+GAP+R)),R,'diner'))
    return pieces
def tsplit(a=-20,L=214,H=76,xc=-12,yc=0,g=10,R=23,GAP=9,ro=24,ri=4,diners=((1,-60),(-1,46),(1,52))):
    T=-H/2;B=H/2
    left=[(-L/2,T),(xc-g/2,T),(xc-g/2,B),(-L/2,B)]
    rt=[(xc+g/2,T),(L/2,T),(L/2,yc-g/2),(xc+g/2,yc-g/2)]
    rb=[(xc+g/2,yc+g/2),(L/2,yc+g/2),(L/2,B),(xc+g/2,B)]
    pr=[P(L2W(a,left),[ro,ri,ri,ro],'table'),P(L2W(a,rt),[ri,ro,ri,ri],'table'),P(L2W(a,rb),[ri,ri,ro,ri],'table')]
    for s,t in diners: pr.append(C(*along(128,128,a,t,s*(H/2+GAP+R)),R,'diner'))
    return pr
V=[('fan',cuts3()),
   ('same-lean diff',cuts3(cuts=((-50,-34),(30,6)),diners=((-1,-76),(1,-8),(-1,66)))),
   ('fan uneven',cuts3(cuts=((-24,-52),(52,28)),diners=((-1,-70),(1,-2),(-1,80)))),
   ('4 pieces',cuts3(L=220,H=72,cuts=((-58,-44),(-6,10),(52,40)),R=20,diners=((-1,-84),(1,-28),(-1,22),(1,78)))),
   ('T split',tsplit()),
   ('T split b',tsplit(xc=20,diners=((-1,-40),(1,-40),(-1,70)),yc=0)),
   ('T angled',cuts3(cuts=((-20,-36),),diners=((-1,-60),(1,-62),(-1,60)))),
]
sheet(V,'v3.html')
