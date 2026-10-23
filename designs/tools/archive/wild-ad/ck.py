import math
from poly import clip_half, line_inter, area, path, f
from check2 import bbox, centroid, place, max_radius

def check_outline(W, short, long_, a_short, a_long, cap='flat', vx=0, vy=0, seg=24, tcut=None):
    """Check outline. cap: 'flat' (perpendicular), 'round', 'vert' (vertical terminals)."""
    h = W/2
    u1 = (math.cos(math.radians(a_short)), math.sin(math.radians(a_short)))
    u2 = (math.cos(math.radians(a_long)), -math.sin(math.radians(a_long)))
    P0 = (vx-u1[0]*short, vy-u1[1]*short); P2 = (vx+u2[0]*long_, vy+u2[1]*long_)
    n1 = (-u1[1], u1[0]); n2 = (-u2[1], u2[0])
    o1 = (P0[0]+n1[0]*h, P0[1]+n1[1]*h); i1 = (P0[0]-n1[0]*h, P0[1]-n1[1]*h)
    o2 = (P2[0]+n2[0]*h, P2[1]+n2[1]*h); i2 = (P2[0]-n2[0]*h, P2[1]-n2[1]*h)
    outer = line_inter(o1, u1, o2, u2); inner = line_inter(i1, u1, i2, u2)
    if cap == 'flat':
        return [o1, outer, o2, i2, inner, i1]
    if cap == 'vert':
        # vertical terminal through the leg's end centre
        a = line_inter(o1, u1, P0, (0, 1)); b = line_inter(i1, u1, P0, (0, 1))
        c = line_inter(o2, u2, P2, (0, 1)); d = line_inter(i2, u2, P2, (0, 1))
        return [a, outer, c, d, inner, b]
    if cap == 'round':
        pts = [o1, outer, o2]
        # arc around P2 from o2 to i2 (outward side = +u2)
        a0 = math.atan2(n2[1], n2[0])
        for k in range(1, seg):
            t = a0 - math.pi*k/seg
            pts.append((P2[0]+h*math.cos(t), P2[1]+h*math.sin(t)))
        pts += [i2, inner, i1]
        a0 = math.atan2(-n1[1], -n1[0])
        for k in range(1, seg):
            t = a0 - math.pi*k/seg
            pts.append((P0[0]+h*math.cos(t), P0[1]+h*math.sin(t)))
        return pts

def cut_pieces(poly, cuts, gap):
    """cuts: list of (x, angle_from_vertical_deg) through point (x, 0). Sorted left->right."""
    pieces = []
    halfs = []
    for (x, ang) in cuts:
        t = math.radians(ang)
        d = (math.sin(t), math.cos(t))  # direction of cut line (downwards-ish)
        nrm = (d[1], -d[0])              # points right-ish
        c = -(nrm[0]*x + nrm[1]*0)
        halfs.append((nrm, c))
    g = gap/2
    for k in range(len(cuts)+1):
        P = poly
        if k > 0:
            nrm, c = halfs[k-1]; P = clip_half(P, nrm[0], nrm[1], c - g)
        if k < len(cuts):
            nrm, c = halfs[k]; P = clip_half(P, -nrm[0], -nrm[1], -c - g)
        pieces.append(P)
    return pieces
