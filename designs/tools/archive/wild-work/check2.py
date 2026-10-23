import math
from poly import *
def check_poly2(W, short, long_, a_short=45, a_long=45, vx=0, vy=0):
    """Check with independent leg angles (degrees above horizontal). Perpendicular terminals, mitred vertex."""
    h = W/2
    u1 = (math.cos(math.radians(a_short)), math.sin(math.radians(a_short)))      # down-right into vertex
    u2 = (math.cos(math.radians(a_long)), -math.sin(math.radians(a_long)))       # up-right from vertex
    P0 = (vx - u1[0]*short, vy - u1[1]*short); P2 = (vx + u2[0]*long_, vy + u2[1]*long_)
    n1 = (-u1[1], u1[0]); n2 = (-u2[1], u2[0])
    o1 = (P0[0]+n1[0]*h, P0[1]+n1[1]*h); i1 = (P0[0]-n1[0]*h, P0[1]-n1[1]*h)
    o2 = (P2[0]+n2[0]*h, P2[1]+n2[1]*h); i2 = (P2[0]-n2[0]*h, P2[1]-n2[1]*h)
    # n1 for u1=(+,+) is (-,+): down-left => o1 is the outer/bottom edge
    # n2 for u2=(+,-) is (+,+): down-right => o2 is the outer/bottom edge
    outer = line_inter(o1, u1, o2, u2); inner = line_inter(i1, u1, i2, u2)
    return [o1, outer, o2, i2, inner, i1]
def split_check(W, short, long_, d1, d2, gap, a_short=45, a_long=45, cut_ang=90):
    poly = check_poly2(W, short, long_, a_short, a_long)
    pcs = []
    cuts = [-d1, d2]
    edges = [-1e4] + cuts + [1e4]
    for k in range(3):
        a = edges[k] + (gap/2 if k else 0); b = edges[k+1] - (gap/2 if k < 2 else 0)
        if cut_ang == 90: pcs.append(strip_x(poly, a, b))
        else: pcs.append(strip_dir(poly, cut_ang, a, b, 0, 0))
    return poly, pcs
def bbox(polys):
    xs = [p[0] for P in polys for p in P]; ys = [p[1] for P in polys for p in P]
    return min(xs), min(ys), max(xs), max(ys)
def centroid(polys):
    A = 0; cx = 0; cy = 0
    for P in polys:
        n = len(P)
        for i in range(n):
            x0, y0 = P[i]; x1, y1 = P[(i+1)%n]; c = x0*y1 - x1*y0
            A += c; cx += (x0+x1)*c; cy += (y0+y1)*c
    A /= 2; return cx/(6*A), cy/(6*A)
def place(polys, cx, cy, scale, opt=0.0):
    """Scale about origin then translate so that a blend of bbox centre and centroid sits at (cx,cy)."""
    S = [[(x*scale, y*scale) for x, y in P] for P in polys]
    x0, y0, x1, y1 = bbox(S); gx, gy = centroid(S)
    bx, by = (x0+x1)/2, (y0+y1)/2
    tx = bx + (gx-bx)*opt; ty = by + (gy-by)*opt
    return [[(x-tx+cx, y-ty+cy) for x, y in P] for P in S]
def max_radius(polys, cx=128, cy=128):
    return max(math.dist(p, (cx, cy)) for P in polys for p in P)
