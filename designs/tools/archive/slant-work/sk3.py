from geo import *
from sheet import sheet
import math
def along(cx, cy, a, t, n=0):
    r = math.radians(a)
    return cx + t*math.cos(r) - n*math.sin(r), cy + t*math.sin(r) + n*math.cos(r)
def poly(pts): return "M" + "L".join(f"{f(x)} {f(y)}" for x,y in pts) + "Z"
def rpoly(pts, r):
    """polygon with rounded corners radius r (arc fillets)"""
    n=len(pts); d=[]
    for i in range(n):
        p0=pts[i-1]; p1=pts[i]; p2=pts[(i+1)%n]
        v1=(p0[0]-p1[0],p0[1]-p1[1]); v2=(p2[0]-p1[0],p2[1]-p1[1])
        l1=math.hypot(*v1); l2=math.hypot(*v2)
        u1=(v1[0]/l1,v1[1]/l1); u2=(v2[0]/l2,v2[1]/l2)
        ang=math.acos(max(-1,min(1,u1[0]*u2[0]+u1[1]*u2[1])))
        t=r/math.tan(ang/2)
        a=(p1[0]+u1[0]*t,p1[1]+u1[1]*t); b=(p1[0]+u2[0]*t,p1[1]+u2[1]*t)
        cross=u1[0]*u2[1]-u1[1]*u2[0]
        sweep = 1 if cross<0 else 0
        d.append(("L" if d else "M")+f"{f(a[0])} {f(a[1])}")
        d.append(f"A{f(r)} {f(r)} 0 0 {sweep} {f(b[0])} {f(b[1])}")
    return "".join(d)+"Z"
S=[]
def italic(sk_deg=18, w=200, h=64, cuts=(), g=12, r=6, dots=(), R=28, cy=128):
    sk=h*math.tan(math.radians(sk_deg)); xs=[128-w/2]+[128-w/2+c for c in cuts]+[128+w/2]; parts=[]
    for i in range(len(xs)-1):
        x0=xs[i]+(g/2 if i>0 else 0); x1=xs[i+1]-(g/2 if i<len(xs)-2 else 0)
        pts=[(x0+sk/2,cy-h/2),(x1+sk/2,cy-h/2),(x1-sk/2,cy+h/2),(x0-sk/2,cy+h/2)]
        parts.append((rpoly(pts,r) if r else poly(pts),'table'))
    parts+=[(circ(x,y,R),'diner') for x,y in dots]
    return parts
S.append(('italic 18 split', italic(18, cuts=(124,), dots=((92,62),(170,194)) )))
S.append(('italic 18 r6 tight', italic(18, w=196, h=60, cuts=(116,), dots=((168,64),(92,192)), R=27)))
S.append(('italic 30 split', italic(30, w=190, cuts=(110,), dots=((170,64),(86,192)))))
S.append(('obelus/slash', [(rrect(128,128,170,46,23,-30),'table'),(circ(128,58,26),'diner'),(circ(128,198,26),'diner')]))
# multi-angle split of rotated slab: cut lines in local coords as (t_top, t_bottom)
def cutslab(a=-20, L=212, H=72, cuts=((-30,-50),(42,30)), g=11, R=24, gap=9, diners=((-1,-70),(-1,75),(1,-5)), r=18):
    # build local polygon pieces between cut lines; local x from -L/2..L/2, y from -H/2..H/2
    lines=[(-L/2,-L/2)]+list(cuts)+[(L/2,L/2)]
    parts=[]
    for i in range(len(lines)-1):
        (a0,b0),(a1,b1)=lines[i],lines[i+1]
        o0=g/2 if i>0 else 0; o1=g/2 if i<len(lines)-2 else 0
        pts=[(a0+o0,-H/2),(a1-o1,-H/2),(b1-o1,H/2),(b0+o0,H/2)]
        P=[rot(128+x,128+y,128,128,a) for x,y in pts]
        rr=[r if (i==0) else 4, r if i==len(lines)-2 else 4]
        parts.append((rpoly(P,6),'table'))
    for s,t in diners:
        x,y=along(128,128,a,t,s*(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    return parts
S.append(('cut 3 angles', cutslab()))
S.append(('cut 3 angles b', cutslab(cuts=((-50,-24),(34,52)), diners=((-1,-80),(1,-12),(-1,70)))))
# brick: two rows
def brick(a=-20, L=212, H=80, g=10, tcut=30, bcut=-36, R=22, gap=8, r=6):
    parts=[]
    h=(H-g)/2
    rows=[(-H/2,-g/2,tcut),(g/2,H/2,bcut)]
    for (y0,y1,c) in rows:
        for (x0,x1) in [(-L/2,c-g/2),(c+g/2,L/2)]:
            P=[rot(128+x,128+y,128,128,a) for x,y in [(x0,y0),(x1,y0),(x1,y1),(x0,y1)]]
            parts.append((rpoly(P,r),'table'))
    for s,t in [(-1,(-L/2+tcut)/2),(-1,(L/2+tcut)/2),(1,(-L/2+bcut)/2),(1,(L/2+bcut)/2)]:
        x,y=along(128,128,a,t,s*(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    return parts
S.append(('brick 4', brick()))
sheet(S,'sk3.html')
