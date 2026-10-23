import math
from cmp import sheet
from build import *
def rect_pts(cx,cy,w,h,a):
    return [rot(p,(cx,cy),a) for p in [(cx-w/2,cy-h/2),(cx+w/2,cy-h/2),(cx+w/2,cy+h/2),(cx-w/2,cy+h/2)]]
def along(cx,cy,a,t,n=0):
    r=math.radians(a); return (cx+t*math.cos(r)-n*math.sin(r), cy+t*math.sin(r)+n*math.cos(r))
def g(a=-18,L=214,H=64,r=24,R=22,GAP=8,top=(-64,0,64),bot=(-32,32)):
    pr=[P(rect_pts(128,128,L,H,a),r,'table')]
    for t in top: pr.append(C(*along(128,128,a,t,-(H/2+GAP+R)),R,'diner'))
    for t in bot: pr.append(C(*along(128,128,a,t,(H/2+GAP+R)),R,'diner'))
    return pr
V=[('5 -18',g()),
   ('5 -14 big',g(a=-14,L=210,H=60,R=24,top=(-66,0,66),bot=(-33,33))),
   ('5 -22 pill',g(a=-22,L=210,H=60,r=30,R=22)),
   ('4 -18',g(L=196,H=64,R=25,top=(-40,40),bot=(-56,24))),
   ('6 -18',g(L=220,H=58,R=19,GAP=7,top=(-70,-4,62),bot=(-62,4,70))),
   ('3+2 uneven',g(a=-18,L=214,H=64,R=22,top=(-74,-22,40),bot=(-6,58))),
   ('5 -26',g(a=-26,L=214,H=62,R=22)),
]
sheet(V,'v2.html')
