from h import *
import importlib.util
def ital(W=200, H=64, ends=18, cuts=(), G=10, RO=14, RI=4, diners=(), R=28, GAP=10, rot_deg=0, cx=128, cy=128):
    """horizontal slab, ends lean `ends` deg (+ = top to the right). cuts=[(x_mid_offset_from_left, lean_deg)].
    diners=[(share_index, side(-1 top/+1 bottom), along_offset)] dot centred on that share's edge on that side."""
    T,B=-H/2,H/2
    def xat(xm, lean, y, off=0):
        # line through (xm,0) leaning `lean` deg (top to the right); shifted perpendicular by off (+ = to the right)
        t=math.tan(math.radians(lean)); return xm - y*t + off/math.cos(math.radians(lean))
    edges=[(-W/2,ends,0)]+[(-W/2+x,l,1) for x,l in cuts]+[(W/2,ends,0)]
    pr=[]; shares=[]
    for i in range(len(edges)-1):
        (x0,l0,c0),(x1,l1,c1)=edges[i],edges[i+1]
        o0=G/2 if c0 else 0; o1=-G/2 if c1 else 0
        tl=xat(x0,l0,T,o0); bl=xat(x0,l0,B,o0); tr=xat(x1,l1,T,o1); br=xat(x1,l1,B,o1)
        pts=[(tl,T),(tr,T),(br,B),(bl,B)]
        rr=[RI if c0 else RO, RI if c1 else RO, RI if c1 else RO, RI if c0 else RO]
        P_=[rot((cx+x,cy+y),(cx,cy),rot_deg) for x,y in pts]
        pr.append(P(P_,rr,'table')); shares.append(((tl+tr)/2,(bl+br)/2,(tr-tl),(br-bl)))
    for si,side,off in diners:
        ttop,tbot,_,_=shares[si]
        x=(ttop if side<0 else tbot)+off
        # follow the share's mid-lean outward
        y=side*(H/2+GAP+R)
        lean=(ttop-tbot)/H  # x per y upward
        x=x+(-y-side*H/2)*lean if False else x
        pr.append(C(*rot((cx+x,cy+y),(cx,cy),rot_deg),R,'diner'))
    return pr, shares
