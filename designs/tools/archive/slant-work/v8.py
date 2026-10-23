import importlib
from cmp import sheet
import c3, c2
def var(mod,**kw):
    m=importlib.reload(mod)
    for k,v in kw.items(): setattr(m,k,v)
    return m.geom()
V=[('s3 cur',var(c3)),
   ('s3 G8 R26',var(c3,G=8,GAP=8,R=26)),
   ('s3 G8 R26 H60',var(c3,G=8,GAP=8,R=26,H=60,L=220)),
   ('s3 G8 R27 RO18',var(c3,G=8,GAP=8,R=27,RO=18,H=64)),
   ('s2 cur',var(c2)),
   ('s2 GAP6 R24',var(c2,GAP=7,R=24,TOP=(-66,0,66),BOT=(-33,33))),
]
sheet(V,'v8.html')
