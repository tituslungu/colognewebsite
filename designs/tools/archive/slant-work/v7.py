import importlib
from cmp import sheet
import c3
def var(**kw):
    m=importlib.reload(c3)
    for k,v in kw.items(): setattr(m,k,v)
    return m.geom()
V=[('cur',var()),
   ('a',var(X=(-14,50),LEAN=(0.1,0.24))),
   ('b',var(X=(-18,46),LEAN=(0.12,0.2),H=66,L=216)),
   ('c',var(X=(-20,44),LEAN=(0.06,0.26),H=66,L=216,R=23)),
   ('d sides flip',var(X=(-20,44),LEAN=(0.1,0.24),SIDES=(1,-1,1))),
]
sheet(V,'v7.html')
