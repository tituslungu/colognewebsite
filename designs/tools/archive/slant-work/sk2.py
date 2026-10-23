from geo import *
from sheet import sheet
import math
def along(cx, cy, a, t, n=0):
    r = math.radians(a)
    return cx + t*math.cos(r) - n*math.sin(r), cy + t*math.sin(r) + n*math.cos(r)
def para_d(pts):
    return "M" + "L".join(f"{f(x)} {f(y)}" for x,y in pts) + "Z"
S = []
def split(a=-20, H=70, lens=(70,120), g=12, r=16, R=27, gap=9, slots=((0,1,0.5),(1,-1,0.5)), cy=128, cx=128):
    total = sum(lens)+g*(len(lens)-1); t0=-total/2; parts=[]; cs=[]
    for l in lens:
        c=t0+l/2; cs.append((c,l)); x,y=along(cx,cy,a,c); parts.append((rrect(x,y,l,H,r,a),'table')); t0+=l+g
    for (i,s,u) in slots:
        c,l=cs[i]; t=c-l/2+u*l
        dx,dy=along(cx,cy,a,t,s*(H/2+gap+R)); parts.append((circ(dx,dy,R),'diner'))
    return parts
S.append(('split2 -20 perp', split()))
S.append(('split2 -20 short R', split(lens=(120,70), slots=((0,1,0.4),(1,-1,0.6)))))
S.append(('split3 -22', split(a=-22, H=64, lens=(56,84,44), g=11, R=22, gap=8, slots=((0,1,0.5),(1,-1,0.5),(2,-1,0.5)))))
# parallelogram split: skewed, gap parallel to ends
def pgram(cx, cy, w, h, sk, cuts=(), g=12, rad=0):
    # sk = horizontal shift of top relative to bottom (top moves right)
    pieces=[]; xs=[cx-w/2]+[cx-w/2+c for c in cuts]+[cx+w/2]
    for i in range(len(xs)-1):
        x0 = xs[i] + (g/2 if i>0 else 0); x1 = xs[i+1] - (g/2 if i<len(xs)-2 else 0)
        pieces.append(para_d([(x0+sk/2,cy-h/2),(x1+sk/2,cy-h/2),(x1-sk/2,cy+h/2),(x0-sk/2,cy+h/2)]))
    return pieces
def pg(w=196,h=62,sk=40,cuts=(78,),dots=((168,60),(84,196)),R=28):
    parts=[(d,'table') for d in pgram(128,128,w,h,sk,cuts)]
    parts+= [(circ(x,y,R),'diner') for x,y in dots]
    return parts
S.append(('pgram 2', pg()))
S.append(('pgram 3', pg(cuts=(60,124), dots=((176,62),(60,192),(130,194)), R=24)))
S.append(('pgram whole', pg(cuts=(), dots=((176,62),(80,194)))))
def long(a=-22, L=216, H=60, r=22, R=21, gap=7, top=(-62,10,82), bot=(-82,-10,62)):
    parts=[(rrect(128,128,L,H,r,a),'table')]
    for t in top:
        x,y=along(128,128,a,t,-(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    for t in bot:
        x,y=along(128,128,a,t,(H/2+gap+R)); parts.append((circ(x,y,R),'diner'))
    return parts
S.append(('long 6', long()))
S.append(('long 4', long(L=200,H=66,R=24,top=(-40,50),bot=(-50,40))))
S.append(('long 3+2', long(L=210,H=64,R=22,top=(-64,0,64),bot=(-32,32))))
sheet(S, 'sk2.html')
