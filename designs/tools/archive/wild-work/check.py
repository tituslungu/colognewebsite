import math
from poly import *
SQ = math.sqrt(2)
def check_poly(vx, vy, W, short, long_, term='perp', apex='point'):
    """Check with 90° legs at ±45°. Vertex centre-line point (vx,vy). short/long = centre-line leg lengths.
    term: 'perp' (perpendicular), 'vert', 'horiz' terminal cuts. apex: 'point' (miter) or 'flat' (horizontal flat at given depth)."""
    h = W/2
    u1 = (1/SQ, 1/SQ)    # short leg direction (down-right toward vertex)
    u2 = (1/SQ, -1/SQ)   # long leg direction (up-right from vertex)
    P0 = (vx - u1[0]*short, vy - u1[1]*short)
    P2 = (vx + u2[0]*long_, vy + u2[1]*long_)
    n1 = (-u1[1], u1[0]); n2 = (-u2[1], u2[0])
    # edges: short leg upper edge (offset -n1?) — compute both offset lines
    up1 = (P0[0]+n1[0]*h, P0[1]+n1[1]*h); lo1 = (P0[0]-n1[0]*h, P0[1]-n1[1]*h)
    up2 = (P2[0]+n2[0]*h, P2[1]+n2[1]*h); lo2 = (P2[0]-n2[0]*h, P2[1]-n2[1]*h)
    # which offset is "inner" (top) ? n1 = (-0.707, 0.707) points down-left -> lo1 = up-right side = inner/top edge of short leg
    # inner (top) edge of short leg: through lo1 dir u1 ; outer (bottom) edge: through up1 dir u1
    # long leg: n2 = (0.707, 0.707) down-right -> up2 is lower/outer edge, lo2 is inner/top edge
    inner = line_inter(lo1, u1, lo2, u2)     # top notch of the V
    outer = line_inter(up1, u1, up2, u2)     # bottom point
    pts = []
    # terminals
    def term_pts(P, u, side_a, side_b, sign):
        if term == 'perp':
            return [side_a, side_b]
        d = (0, 1) if term == 'vert' else (1, 0)
        # cut line through P along d; intersect with the two edges
        A = line_inter(side_a, u, P, d); B = line_inter(side_b, u, P, d)
        return [A, B]
    # order: start at short-leg terminal outer (bottom-left), go along outer edge to bottom point, up outer edge of long leg to tip, across tip, back along inner edges.
    t_short = term_pts(P0, u1, up1, lo1, 1)   # [outer, inner]
    t_long = term_pts(P2, u2, up2, lo2, 1)    # [outer, inner]
    poly = [t_short[0]]
    if apex == 'point':
        poly.append(outer)
    else:
        # flat apex: cut the bottom with a horizontal line at depth = apex (distance above outer point)
        y = outer[1] - apex
        a = line_inter(up1, u1, (0, y), (1, 0)); b = line_inter(up2, u2, (0, y), (1, 0))
        poly += [a, b]
    poly += [t_long[0], t_long[1], inner, t_short[1]]
    return poly, dict(P0=P0, P2=P2, inner=inner, outer=outer)
