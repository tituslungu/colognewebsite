import importlib
from cmp import sheet
import c2, c3
def var(mod, **kw):
    m=importlib.reload(mod)
    for k,v in kw.items(): setattr(m,k,v)
    return m.geom()
V=[('s3 base',var(c3)),
   ('s3 RO14 lean.14',var(c3,RO=14,LEAN=0.14,X=(-34,24))),
   ('s3 RO16 lean.22',var(c3,RO=16,LEAN=0.22,X=(-36,22))),
   ('s3 RO16 lean.3',var(c3,RO=16,LEAN=0.3,X=(-36,26),H=72)),
   ('s3 RO18 2below',var(c3,RO=18,LEAN=0.22,X=(-30,30),SIDES=(1,-1,1))),
   ('s2 r16',var(c2,RT=16)),
   ('s2 r16 H70 R23',var(c2,RT=16,H=70,R=23,L=212)),
   ('s2 r12 -14',var(c2,RT=12,A=-14,H=68,R=23,TOP=(-66,0,66),BOT=(-33,33))),
]
sheet(V,'v4.html')
