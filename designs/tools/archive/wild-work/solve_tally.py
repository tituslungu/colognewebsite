import math
from tally import tally
from poly import area
def stubs(w, g, h, sw, ang, knock):
    pcs, _ = tally(w=w, g=g, h=h, sw=sw, ang=ang, knock=knock, over=6)
    return sorted(round(area(P)) for P in pcs)
# outer stub vertical length = h/2 - dy1 - band ; dy1 = 1.5*(w+g)*tan(ang) ; band = (sw/2+knock)/cos(ang)
for h in (104, 108, 112):
    for w, g, sw in ((17, 16, 15), (18, 16, 16)):
        knock = 5
        # target stub = 0.13*h
        best = None
        for a10 in range(200, 400):
            a = math.radians(a10/10); dy1 = 1.5*(w+g)*math.tan(a); band = (sw/2+knock)/math.cos(a)
            stub = h/2 - dy1 - band
            if best is None or abs(stub - 0.13*h) < abs(best[1] - 0.13*h): best = (a10/10, stub)
        print(dict(h=h, w=w, g=g, sw=sw), 'ang', best[0], 'stub', round(best[1], 1), stubs(w, g, h, sw, best[0], knock))
