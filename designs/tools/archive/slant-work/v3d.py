import math
from cmp import sheet
from build import *
from v3c import slab
from v2 import g as longt
def zig(a=-18, L=220, H=66, xs=(-60,-4,58), lean=14, g=10, R=21, GAP=9, ro=24, ri=4, sides=(-1,1,-1,1), dpos=None):
    # cuts at xs (mid-height), alternating lean so each piece is wide on its diner's side
    cuts=[]; s=H*lean/100
    for i,x in enumerate(xs):
        # piece i diner side sides[i]; cut between i and i+1
        if sides[i]<0:  # piece i wide at top => cut top further right
            cuts.append((x+s/2, x-s/2))
        else:
            cuts.append((x-s/2, x+s/2))
    bounds=[-L/2]+list(xs)+[L/2]
    din=[(sides[i], (bounds[i]+bounds[i+1])/2 + (0 if dpos is None else dpos[i])) for i in range(len(bounds)-1)]
    return slab(a,L,H,cuts,g,ro,ri,din,R,GAP)
V=[('zig 4',zig()),
   ('zig 4 uneven',zig(xs=(-44,0,66), dpos=(0,0,0,0))),
   ('zig 3',zig(L=212,H=70,xs=(-34,40),R=24,sides=(-1,1,-1))),
   ('zig 3 uneven',zig(L=212,H=70,xs=(-50,10),R=24,sides=(-1,1,-1),lean=18)),
   ('3 table 2+1 -16',longt(a=-16,L=200,H=66,r=24,R=26,GAP=9,top=(-48,38),bot=(-6,))),
   ('para cuts -18',slab(-18,214,70,((-40+12,-40-12),(22+12,22-12)),10,22,4,((-1,-70),(1,-10),(-1,68)),23,9)),
]
sheet(V,'v3d.html')
