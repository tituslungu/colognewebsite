from h import *
def s1(TH=18, W=184, H=64, G=11, R=30, GAP=11, SPLIT=0.58, RO=14, RA=None, RI=4, DX=40, cx=128, cy=128):
    """RO obtuse outer radius, RA acute outer radius"""
    RA = RO if RA is None else RA
    sk=H*math.tan(math.radians(TH)); gh=G/math.cos(math.radians(TH))
    xl=cx-W/2; xr=cx+W/2; xc=xl+W*SPLIT; T,B=cy-H/2,cy+H/2
    # left slab: TL obtuse, TR acute(inner), BR obtuse(inner), BL acute
    L=[(xl+sk/2,T),(xc-gh/2+sk/2,T),(xc-gh/2-sk/2,B),(xl-sk/2,B)]
    Rr=[(xc+gh/2+sk/2,T),(xr+sk/2,T),(xr-sk/2,B),(xc+gh/2-sk/2,B)]
    return [P(L,[RO,RI,RI,RA],'table'),P(Rr,[RI,RA,RO,RI],'table'),C(cx+DX,T-GAP-R,R,'diner'),C(cx-DX,B+GAP+R,R,'diner')]
if __name__=='__main__':
    V=[('A current',s1()),
       ('D 64/36 DX44',s1(SPLIT=0.64,DX=44)),
       ('G 64 DX44 RO16 RA10',s1(SPLIT=0.64,DX=44,RO=16,RA=10)),
       ('H 62 DX42 RO16 RA10',s1(SPLIT=0.62,DX=42,RO=16,RA=10)),
       ('I 64 DX44 W192',s1(SPLIT=0.64,DX=46,W=192,RO=16,RA=10)),
    ]
    cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s1b.html')
