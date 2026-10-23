import math
from cmp import sheet
from build import *
from v3 import cuts3, along, L2W
def hsplit(a=-20,L=216,H=76,x1=-30,x2=30,ym=0,g=10,R=22,GAP=9,ro=24,ri=4,diners=((1,-72),(-1,0),(1,6),(-1,74))):
    T=-H/2;B=H/2
    pcs=[([(-L/2,T),(x1-g/2,T),(x1-g/2,B),(-L/2,B)],[ro,ri,ri,ro]),
         ([(x1+g/2,T),(x2-g/2,T),(x2-g/2,ym-g/2),(x1+g/2,ym-g/2)],ri),
         ([(x1+g/2,ym+g/2),(x2-g/2,ym+g/2),(x2-g/2,B),(x1+g/2,B)],ri),
         ([(x2+g/2,T),(L/2,T),(L/2,B),(x2+g/2,B)],[ri,ro,ro,ri])]
    pr=[P(L2W(a,p),r,'table') for p,r in pcs]
    for s,t in diners: pr.append(C(*along(128,128,a,t,s*(H/2+GAP+R)),R,'diner'))
    return pr
def stepsplit(a=-18,L=214,H=72,xt=14,xb=-22,g=10,R=26,GAP=10,ro=24,ri=4,diners=((-1,-50),(1,52))):
    T=-H/2;B=H/2;m=0
    left=[(-L/2,T),(xt-g/2,T),(xt-g/2,m-g/2),(xb-g/2,m-g/2),(xb-g/2,B),(-L/2,B)]
    right=[(xt+g/2,T),(L/2,T),(L/2,B),(xb+g/2,B),(xb+g/2,m+g/2),(xt+g/2,m+g/2)]
    pr=[P(L2W(a,left),[ro,ri,ri,ri,ri,ro],'table'),P(L2W(a,right),[ri,ro,ro,ri,ri,ri],'table')]
    for s,t in diners: pr.append(C(*along(128,128,a,t,s*(H/2+GAP+R)),R,'diner'))
    return pr
V=[('fan pill',cuts3(H=72,ro=36,cuts=((-24,-50),(50,26)),diners=((-1,-72),(1,-2),(-1,78)))),
   ('H split 4',hsplit()),
   ('H split off',hsplit(x1=-20,x2=44,ym=-6,diners=((1,-70),(-1,12),(1,12),(-1,80)))),
   ('step 2',stepsplit()),
   ('step 3 diners',stepsplit(xt=30,xb=-10,R=23,diners=((-1,-60),(1,-56),(-1,74)))),
]
sheet(V,'v3b.html')
