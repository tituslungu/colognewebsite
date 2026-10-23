from geo import *
import math
def along(cx, cy, a, t, n=0):
    r = math.radians(a)
    return cx + t*math.cos(r) - n*math.sin(r), cy + t*math.sin(r) + n*math.cos(r)
def poly(pts): return "M" + "L".join(f"{f(x)} {f(y)}" for x,y in pts) + "Z"
def rpoly(pts, r):
    """polygon with rounded corners; r scalar or list per vertex"""
    n=len(pts); d=[]; rs = r if isinstance(r,(list,tuple)) else [r]*n
    for i in range(n):
        p0=pts[i-1]; p1=pts[i]; p2=pts[(i+1)%n]; ri=rs[i]
        if not ri:
            d.append(("L" if d else "M")+f"{f(p1[0])} {f(p1[1])}"); continue
        v1=(p0[0]-p1[0],p0[1]-p1[1]); v2=(p2[0]-p1[0],p2[1]-p1[1])
        l1=math.hypot(*v1); l2=math.hypot(*v2)
        u1=(v1[0]/l1,v1[1]/l1); u2=(v2[0]/l2,v2[1]/l2)
        ang=math.acos(max(-1,min(1,u1[0]*u2[0]+u1[1]*u2[1])))
        t=ri/math.tan(ang/2)
        a=(p1[0]+u1[0]*t,p1[1]+u1[1]*t); b=(p1[0]+u2[0]*t,p1[1]+u2[1]*t)
        cross=u1[0]*u2[1]-u1[1]*u2[0]
        sweep = 1 if cross<0 else 0
        d.append(("L" if d else "M")+f"{f(a[0])} {f(a[1])}")
        d.append(f"A{f(ri)} {f(ri)} 0 0 {sweep} {f(b[0])} {f(b[1])}")
    return "".join(d)+"Z"
def italic(sk_deg=18, w=200, h=64, cuts=(), g=12, r=6, ri=None, dots=(), R=28, cx=128, cy=128):
    """horizontal tabletop, ends + cuts leaning right by sk_deg. cuts = x offsets of cut centre lines (at mid-height) from left end."""
    sk=h*math.tan(math.radians(sk_deg)); xs=[cx-w/2]+[cx-w/2+c for c in cuts]+[cx+w/2]; parts=[]
    ri = r if ri is None else ri
    for i in range(len(xs)-1):
        x0=xs[i]+(g/2 if i>0 else 0); x1=xs[i+1]-(g/2 if i<len(xs)-2 else 0)
        pts=[(x0+sk/2,cy-h/2),(x1+sk/2,cy-h/2),(x1-sk/2,cy+h/2),(x0-sk/2,cy+h/2)]
        rr=[r if i==0 else ri, r if i==len(xs)-2 else ri, r if i==len(xs)-2 else ri, r if i==0 else ri]
        parts.append((rpoly(pts,rr),'table'))
    parts+=[(circ(x,y,R),'diner') for x,y in dots]
    return parts
def cutslab(a=-20, L=212, H=72, cuts=(), g=11, R=24, gap=9, diners=(), ro=22, ri=5, cx=128, cy=128):
    lines=[(-L/2,-L/2)]+list(cuts)+[(L/2,L/2)]; parts=[]
    for i in range(len(lines)-1):
        (a0,b0),(a1,b1)=lines[i],lines[i+1]
        o0=g/2 if i>0 else 0; o1=g/2 if i<len(lines)-2 else 0
        # shift cut lines perpendicular-ish: offset along x by g/2 / cos(angle of cut)
        def off(aa,bb,o):
            ang=math.atan2(H,bb-aa); k=o/math.sin(ang) if o else 0; return k
        k0=off(a0,b0,o0); k1=off(a1,b1,o1)
        pts=[(a0+k0,-H/2),(a1-k1,-H/2),(b1-k1,H/2),(b0+k0,H/2)]
        P=[rot(cx+x,cy+y,cx,cy,a) for x,y in pts]
        rr=[ro if i==0 else ri, ro if i==len(lines)-2 else ri, ro if i==len(lines)-2 else ri, ro if i==0 else ri]
        parts.append((rpoly(P,rr),'table'))
    for s,t in diners:
        x,y=along(cx,cy,a,t,s*(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    return parts
def longtable(a=-22, L=216, H=60, r=22, R=21, gap=7, top=(), bot=(), cx=128, cy=128):
    parts=[(rrect(cx,cy,L,H,r,a),'table')]
    for t in top:
        x,y=along(cx,cy,a,t,-(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    for t in bot:
        x,y=along(cx,cy,a,t,(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    return parts
