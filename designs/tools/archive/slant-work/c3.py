"""slant-3  Three Shares: a tilted table split three ways, unequally; each cut leans so every share is
widest on the side where its diner sits. No single straight split runs through the table."""
import math
from build import *
A=-18                 # table rises 18 deg to the right
L=216; H=64           # tabletop
G=8                   # split gap (perpendicular to each cut)
RO=18; RI=4           # outer / inner corner radii
R=27                  # diner radius
GAP=8                 # diner-to-table clearance = split gap
X=(-16,52)            # cut positions at mid-height: shares of 92 / 68 / 56 (big, medium, small)
LEAN=(0.12,0.22)      # each cut's travel across the table height, as a fraction of H: two different angles
SIDES=(-1,1,-1)       # which side each share's diner sits on (-1 far/top, +1 near/bottom)
def along(t,n=0,cx=128,cy=128):
    r=math.radians(A); return (cx+t*math.cos(r)-n*math.sin(r), cy+t*math.sin(r)+n*math.cos(r))
def line_x(cut, y, off):
    """x of cut line at height y, shifted by off perpendicular to the cut"""
    (xt,yt),(xb,yb)=cut
    dx,dy=xb-xt,yb-yt; l=math.hypot(dx,dy); nx,ny=-dy/l,dx/l  # left normal
    # point on shifted line: (xt+nx*off, yt+ny*off) + t*(dx,dy); solve y
    t=(y-(yt+ny*off))/dy
    return xt+nx*off+t*dx
def geom():
    T,B=-H/2,H/2; s=H*LEAN
    cuts=[]
    for i,x in enumerate(X):
        # share i wide at top (diner above) -> cut's top end further right
        si=H*(LEAN[i] if isinstance(LEAN,(list,tuple)) else LEAN)
        cuts.append(((x+si/2,T),(x-si/2,B)) if SIDES[i]<0 else ((x-si/2,T),(x+si/2,B)))
    pr=[]; edges=[None]+cuts+[None]
    for i in range(len(edges)-1):
        le,re=edges[i],edges[i+1]
        tl=-L/2 if le is None else line_x(le,T,-G/2); bl=-L/2 if le is None else line_x(le,B,-G/2)
        tr=L/2 if re is None else line_x(re,T,G/2); br=L/2 if re is None else line_x(re,B,G/2)
        pts=[rot((128+x,128+y),(128,128),A) for x,y in [(tl,T),(tr,T),(br,B),(bl,B)]]
        rr=[RO if le is None else RI, RO if re is None else RI, RO if re is None else RI, RO if le is None else RI]
        pr.append(P(pts,rr,'table'))
        # diner centred on the share's wide edge
        if SIDES[i]<0: t=(tl+tr)/2
        else: t=(bl+br)/2
        pr.append(C(*along(t,SIDES[i]*(H/2+GAP+R)),R,'diner'))
    return pr
if __name__=='__main__':
    write_concept('slant-3', geom(), mark_box=228, icon_rad=102, site='tile', lock_h=140, lock_gap=48, label='Divi')
