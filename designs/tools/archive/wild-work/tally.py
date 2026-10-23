import math
from poly import *
def rect(x0, y0, x1, y1): return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
def tally(cx=128, cy=128, w=20, g=16, h=112, sw=None, ang=30, knock=8, over=14, n=4):
    """Returns (bar_pieces, slash_poly). Bars vertical, slash rising left->right at `ang` degrees, knocked out of the bars by `knock`."""
    sw = sw or w
    tw = n*w + (n-1)*g; x0 = cx - tw/2
    bars = [rect(x0 + i*(w+g), cy - h/2, x0 + i*(w+g) + w, cy + h/2) for i in range(n)]
    a = math.radians(ang); u = (math.cos(a), -math.sin(a)); nrm = (math.sin(a), math.cos(a))  # nrm points down-right of the line
    # slash centre line through (cx, cy); half-length so it overshoots the outer bars by `over` horizontally
    half = (tw/2 + over) / math.cos(a)
    p = (cx - u[0]*half, cy - u[1]*half); q = (cx + u[0]*half, cy + u[1]*half)
    hs = sw/2
    slash = [(p[0]+nrm[0]*hs, p[1]+nrm[1]*hs), (q[0]+nrm[0]*hs, q[1]+nrm[1]*hs), (q[0]-nrm[0]*hs, q[1]-nrm[1]*hs), (p[0]-nrm[0]*hs, p[1]-nrm[1]*hs)]
    pieces = []
    band = hs + knock
    c0 = nrm[0]*cx + nrm[1]*cy
    for b in bars:
        above = clip_half(b, -nrm[0], -nrm[1], c0 - band)   # nrm.x <= c0 - band
        below = clip_half(b, nrm[0], nrm[1], -(c0 + band))   # nrm.x >= c0 + band
        for P in (above, below):
            if len(P) >= 3 and area(P) > 1: pieces.append(P)
    return pieces, slash
