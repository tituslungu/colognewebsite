import sys
from final import *
which=sys.argv[1:] or ['slant-1','slant-3']
if 'slant-1' in which:
    write_concept('slant-1', S1(), mark_box=224, icon_rad=100, site='tile', lock_h=140, lock_gap=52, label='Divi')
if 'slant-3' in which:
    pr=S3()[0]; x0,y0,x1,y1=bbox(pr); bc=((x0+x1)/2,(y0+y1)/2); ce=centroid(pr)
    dy=-(ce[1]-bc[1])*0.5   # shift up by half the bbox-to-centroid gap (design units)
    sm=224/max(x1-x0,y1-y0)
    R=maxrad(pr,bc); si=102/R
    lh=140; sl=lh/(y1-y0)
    write_concept('slant-3', pr, mark_box=224, icon_rad=102, mark_off=(0,dy*sm), icon_off=(0,dy*si),
                  site='tile', lock_h=lh, lock_gap=50, lock_dy=dy*sl, label='Divi')
    print('dy',dy,'mark',dy*sm,'icon',dy*si)
