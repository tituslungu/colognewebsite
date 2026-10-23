import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from p1geo import basis, dot
def areas(P, N=300):
    cx, cy, R, h = P['cx'], P['cy'], P['R'], P['g']/2
    u0,n0 = basis(P['a0']); u1,n1 = basis(P['a1'])
    c0 = dot(n0,(P['x0'],cy)); c1 = dot(n1,(P['x1'],cy))
    cnt=[0,0,0]
    for i in range(N):
        for j in range(N):
            x=cx-R+(i+.5)*2*R/N; y=cy-R+(j+.5)*2*R/N
            if (x-cx)**2+(y-cy)**2>R*R: continue
            s0=dot(n0,(x,y)); s1=dot(n1,(x,y))
            if s0<=c0-h: cnt[0]+=1
            elif s0>=c0+h and s1<=c1-h: cnt[1]+=1
            elif s1>=c1+h: cnt[2]+=1
    t=sum(cnt); return [100*c/t for c in cnt]
def solve(P, t0, t2):
    # bisection on x0 for share0 and x1 for share2
    lo,hi=P['cx']-P['R'],P['cx']+P['R']
    for key,idx,target in (('x0',0,t0),('x1',2,t2)):
        a,b=lo,hi
        for _ in range(30):
            m=(a+b)/2; Q=dict(P); Q[key]=m
            ar=areas(Q,200)[idx]
            if (ar<target)==(idx==0): a=m
            else: b=m
        P[key]=round((a+b)/2,2)
    return P
if __name__=='__main__':
    import json
    P=json.loads(sys.argv[1]); t0=float(sys.argv[2]); t2=float(sys.argv[3])
    P=solve(P,t0,t2); print(json.dumps(P), [round(a,1) for a in areas(P)])
