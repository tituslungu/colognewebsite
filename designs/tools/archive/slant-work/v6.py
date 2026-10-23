import importlib
from cmp import sheet
import c3
def var(**kw):
    m=importlib.reload(c3)
    for k,v in kw.items(): setattr(m,k,v)
    return m.geom()
V=[('dec 96/66/50',var(X=(-10,56),LEAN=0.16)),
   ('big mid',var(X=(-52,40),LEAN=0.16)),
   ('big mid 1up',var(X=(-52,40),LEAN=0.2,SIDES=(1,-1,1))),
   ('dec lean diff',var(X=(-10,56),LEAN=(0.08,0.32))),
   ('small big med',var(X=(-60,28),LEAN=(0.3,0.1))),
   ('big mid H64 L220',var(X=(-50,42),LEAN=0.22,H=64,L=220,R=23)),
]
sheet(V,'v6.html')
