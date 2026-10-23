import math, importlib
import c1
from cmp import sheet
from build import *
def g(TH=18,W=200,H=60,G=11,R=28,GAP=11,SPLIT=0.6,RO=12,RI=4,tdx=None,bdx=None):
    sk=H*math.tan(math.radians(TH)); gh=G/math.cos(math.radians(TH))
    cx,cy=128,128; xl=cx-W/2; xr=cx+W/2; xc=xl+W*SPLIT; top,bot=cy-H/2,cy+H/2
    L=[(xl+sk/2,top),(xc-gh/2+sk/2,top),(xc-gh/2-sk/2,bot),(xl-sk/2,bot)]
    Rr=[(xc+gh/2+sk/2,top),(xr+sk/2,top),(xr-sk/2,bot),(xc+gh/2-sk/2,bot)]
    tx=(Rr[0][0]+Rr[1][0])/2 if tdx is None else cx+tdx; bx=(L[2][0]+L[3][0])/2 if bdx is None else cx+bdx
    return [P(L,[RO,RI,RI,RO],'table'),P(Rr,[RI,RO,RO,RI],'table'),C(tx,top-GAP-R,R,'diner'),C(bx,bot+GAP+R,R,'diner')]
V=[('ext 60/40',g()),
   ('kitty 40',g(tdx=44,bdx=-44)),
   ('split .5 kitty',g(SPLIT=0.52,tdx=46,bdx=-46)),
   ('split .4 piece ctr',g(SPLIT=0.42,tdx=None,bdx=None)),
   ('H66 R30 kitty',g(H=66,R=30,W=196,tdx=44,bdx=-44,SPLIT=0.58)),
   ('TH24 kitty',g(TH=24,tdx=46,bdx=-46)),
   ('W180 H64 R30',g(W=184,H=64,R=30,tdx=40,bdx=-40,SPLIT=0.58,RO=14)),
]
sheet(V,'v1.html')
