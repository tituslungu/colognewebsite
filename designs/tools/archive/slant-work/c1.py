"""slant-1  Italic Split: a tabletop leaning at the V's angle, split unequally at that same angle; two diners kitty-corner."""
import math
from build import *
TH=18.0      # lean of ends + cut = stroke angle of the V in Helvetica Neue Bold (18.1 deg)
W=184; H=64  # tabletop, measured at mid-height
G=11         # split gap, perpendicular to the cut
R=30         # diner radius
GAP=11       # diner-to-table clearance = split gap
SPLIT=0.58   # left (larger) share, fraction of W
RO=14; RI=4  # outer / inner corner radii
DX=40        # diners sit DX either side of centre: top over the small share, bottom under the large one
def geom():
    sk=H*math.tan(math.radians(TH)); gh=G/math.cos(math.radians(TH))
    cx,cy=128,128; xl=cx-W/2; xr=cx+W/2; xc=xl+W*SPLIT; top,bot=cy-H/2,cy+H/2
    L=[(xl+sk/2,top),(xc-gh/2+sk/2,top),(xc-gh/2-sk/2,bot),(xl-sk/2,bot)]
    Rr=[(xc+gh/2+sk/2,top),(xr+sk/2,top),(xr-sk/2,bot),(xc+gh/2-sk/2,bot)]
    return [P(L,[RO,RI,RI,RO],'table'),P(Rr,[RI,RO,RO,RI],'table'),
            C(cx+DX,top-GAP-R,R,'diner'),C(cx-DX,bot+GAP+R,R,'diner')]
if __name__=='__main__':
    import sys
    write_concept('slant-1', geom(), mark_box=224, icon_rad=100, site='tile', lock_h=140, lock_gap=52, label='Divi')
