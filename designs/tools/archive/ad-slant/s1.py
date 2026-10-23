from h import *
def s1(TH=18, W=184, H=64, G=11, R=30, GAP=11, SPLIT=0.58, RO=14, RI=4, top=None, bot=None, DX=40):
    sk=H*math.tan(math.radians(TH)); gh=G/math.cos(math.radians(TH))
    cx,cy=128,128; xl=cx-W/2; xr=cx+W/2; xc=xl+W*SPLIT; T,B=cy-H/2,cy+H/2
    L=[(xl+sk/2,T),(xc-gh/2+sk/2,T),(xc-gh/2-sk/2,B),(xl-sk/2,B)]
    Rr=[(xc+gh/2+sk/2,T),(xr+sk/2,T),(xr-sk/2,B),(xc+gh/2-sk/2,B)]
    # share centres at mid height
    cl=(xl+xc-gh/2)/2; cr=(xc+gh/2+xr)/2
    tx = cx+DX if top is None else (cr if top=='c' else top)
    bx = cx-DX if bot is None else (cl if bot=='c' else bot)
    # dots follow the lean: a dot above sits where the share's centreline (leaning) meets its row
    t_off=(H/2+GAP+R)*math.tan(math.radians(TH))
    if top=='c': tx=cr+t_off
    if bot=='c': bx=cl-t_off
    return [P(L,[RO,RI,RI,RO],'table'),P(Rr,[RI,RO,RO,RI],'table'),C(tx,T-GAP-R,R,'diner'),C(bx,B+GAP+R,R,'diner')]
V=[('A current',s1()),
   ('B 64/36 c',s1(SPLIT=0.64,top='c',bot='c')),
   ('C 62/38 c',s1(SPLIT=0.62,top='c',bot='c')),
   ('D 64/36 DX44',s1(SPLIT=0.64,DX=44)),
   ('E 64/36 tc only',s1(SPLIT=0.64,top='c',bot=None,DX=46)),
   ('F 66/34 c W176',s1(SPLIT=0.66,W=176,top='c',bot='c')),
]
cmp(V,'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-slant/s1a.html')
