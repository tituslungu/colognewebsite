"""slant-2  Long Table: the hero photo's table, tilted; five friends seated three-and-two along it."""
import math
from build import *
A=-18          # table rises 18 deg to the right
L=212; H=70     # tabletop
RT=16           # tabletop corner radius
R=24            # diner radius
GAP=7           # diner-to-table clearance
TOP=(-66,0,66)  # seats along the far side (offset from centre, along the table)
BOT=(-33,33)    # seats along the near side, interleaved
def along(t,n=0,cx=128,cy=128):
    r=math.radians(A); return (cx+t*math.cos(r)-n*math.sin(r), cy+t*math.sin(r)+n*math.cos(r))
def geom():
    c=(128,128)
    pts=[rot(p,c,A) for p in [(128-L/2,128-H/2),(128+L/2,128-H/2),(128+L/2,128+H/2),(128-L/2,128+H/2)]]
    pr=[P(pts,RT,'table')]
    pr+=[C(*along(t,-(H/2+GAP+R)),R,'diner') for t in TOP]
    pr+=[C(*along(t,(H/2+GAP+R)),R,'diner') for t in BOT]
    return pr
if __name__=='__main__':
    write_concept('slant-2', geom(), mark_box=232, icon_rad=102, site='tile', lock_h=140, lock_gap=48, label='Divi')
