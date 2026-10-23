from lib import *
from sheet import sheet
S=[]
S.append(('it2 60/40', italic(18, w=200, h=60, cuts=(118,), g=11, r=8, ri=4, dots=((171,65),(85,191)), R=27)))
S.append(('it2 r12', italic(18, w=200, h=62, cuts=(118,), g=11, r=14, ri=4, dots=((171,64),(85,192)), R=27)))
S.append(('it3 2top', italic(18, w=210, h=60, cuts=(96,142), g=10, r=8, ri=4, dots=((80,65),(182,65),(124,191)), R=24)))
S.append(('it3 b', italic(18, w=210, h=60, cuts=(70,150), g=10, r=8, ri=4, dots=((76,191),(116,65),(190,191)), R=24)))
S.append(('long 5 -22', longtable(a=-22, L=214, H=64, r=24, R=22, gap=7, top=(-62,0,62), bot=(-31,31))))
S.append(('long 5 -16', longtable(a=-16, L=214, H=64, r=24, R=22, gap=7, top=(-62,0,62), bot=(-31,31))))
S.append(('shares fan', cutslab(a=-20, L=214, H=74, cuts=((-38,-22),(26,48)), g=10, R=23, gap=8, diners=((-1,-70),(1,6),(-1,74)), ro=24, ri=4)))
S.append(('shares fan b', cutslab(a=-18, L=214, H=74, cuts=((-20,-44),(40,26)), g=10, R=23, gap=8, diners=((-1,-74),(1,0),(-1,72)), ro=24, ri=4)))
S.append(('shares X', cutslab(a=-20, L=214, H=74, cuts=((-44,-14),(48,18)), g=10, R=23, gap=8, diners=((-1,-76),(1,2),(-1,74)), ro=24, ri=4)))
sheet(S,'sk4.html',tile_scale=0.74)
