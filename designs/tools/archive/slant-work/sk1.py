from geo import *
from sheet import sheet
import math
def along(cx, cy, a, t, n=0):
    """point at distance t along axis (angle a, clockwise) and n along normal (positive = below)"""
    r = math.radians(a)
    return cx + t*math.cos(r) - n*math.sin(r), cy + t*math.sin(r) + n*math.cos(r)
S = []
# S1/S2: table-1 rotated
def t1(a):
    parts = [(rrect(128,128,224,64,16,a),'table')]
    for (x,y) in [(72,51.2),(184,204.8)]:
        X,Y = rot(x,y,128,128,a); parts.append((circ(X,Y,32),'diner'))
    return parts
S.append(('t1 rot -20 (%)', t1(-20)))
S.append(('t1 rot +20', t1(20)))
# S3: broad slab, 3 diners 2 top 1 bottom
def slab3(a=-20, L=200, H=72, r=24, R=26, gap=12, top=(-50,50), bot=(0,)):
    parts=[(rrect(128,128,L,H,r,a),'table')]
    for t in top:
        x,y=along(128,128,a,t,-(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    for t in bot:
        x,y=along(128,128,a,t,(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    return parts
S.append(('3 diners 2/1', slab3()))
S.append(('4 diners stagger', slab3(top=(-60,30), bot=(-30,60))))
S.append(('4 diners -30', slab3(a=-30, top=(-55,25), bot=(-25,55))))
# S5: segmented slab alternating diners
def seg(a=-20, H=64, lens=(84,52,68), g=12, r=14, R=24, gap=10, sides=(-1,1,-1), rr=None):
    total = sum(lens)+g*(len(lens)-1); t0=-total/2; parts=[]
    for i,(l,s) in enumerate(zip(lens,sides)):
        c=t0+l/2; x,y=along(128,128,a,c); parts.append((rrect(x,y,l,H,r,a),'table'))
        dx,dy=along(128,128,a,c,s*(H/2+gap+R)); parts.append((circ(dx,dy,R),'diner'))
        t0+=l+g
    return parts
S.append(('seg 3 alt', seg()))
S.append(('seg 2 kitty', seg(lens=(120,84),sides=(-1,1),R=28)))
# italic obelus: parallelogram slab
def para(cx,cy,w,h,skew):
    # horizontal top/bottom, ends slanted by skew (dx over height)
    s=skew*h/2
    return f"M{f(cx-w/2+s)} {f(cy-h/2)}L{f(cx+w/2+s)} {f(cy-h/2)}L{f(cx+w/2-s)} {f(cy+h/2)}L{f(cx-w/2-s)} {f(cy+h/2)}Z"
S.append(('italic obelus', [(para(128,128,200,64,0.6),'table'),(circ(170,58,30),'diner'),(circ(86,198,30),'diner')]))
# 1 above, 2 below, steeper
S.append(('1/2 at 28', slab3(a=-28, L=210, H=70, top=(-30,), bot=(-10,62))))
# seesaw-ish: dots along slab axis (head & foot)
def ends(a=20):
    parts=[(rrect(128,128,150,60,18,a),'table')]
    for t,n in [(-105,-10),(105,10)]:
        x,y=along(128,128,a,t,n); parts.append((circ(x,y,26),'diner'))
    return parts
S.append(('head & foot +20', ends()))
sheet(S, 'sk1.html')
