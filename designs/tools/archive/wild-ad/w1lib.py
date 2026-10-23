import math
from poly import clip_half, line_inter, area, f
from check2 import bbox, centroid
from ck import check_outline, cut_pieces

def build(W=50, short=98, long_=166, a_short=40, a_long=52, cuts=((-28, 0), (34, 0)), gap=12):
    poly = check_outline(W, short, long_, a_short, a_long, 'flat')
    o1, outer, o2, i2, inner, i1 = poly
    pcs = cut_pieces(poly, list(cuts), gap)
    return pcs, dict(o1=o1, o2=o2, i1=i1, i2=i2, h=W/2, short=short, long_=long_, a_short=a_short, a_long=a_long)

def cap_area(h): return math.pi*h*h/2

def xform(pcs, info, s, tx, ty):
    T = lambda p: (p[0]*s+tx, p[1]*s+ty)
    P = [[T(p) for p in Q] for Q in pcs]
    I = dict(info); 
    for k in ('o1', 'o2', 'i1', 'i2'): I[k] = T(info[k])
    I['h'] = info['h']*s
    return P, I

def piece_path(Q, I, rounded):
    """Emit a path; if rounded, the terminal edges (i1->o1 and o2->i2) become semicircles."""
    n = len(Q); s = f'M{f(Q[0][0])} {f(Q[0][1])}'
    close = lambda a, b: math.dist(a, b) < 1e-6
    for k in range(1, n+1):
        a = Q[k-1]; b = Q[k % n]
        if rounded and ((close(a, I['o2']) and close(b, I['i2'])) or (close(a, I['i1']) and close(b, I['o1']))):
            s += f'A{f(I["h"])} {f(I["h"])} 0 0 0 {f(b[0])} {f(b[1])}'
        elif k < n:
            s += f'L{f(b[0])} {f(b[1])}'
    return s + 'Z'

def poly_with_caps(Q, I, rounded, seg=32):
    """Polygon approximation incl. caps (for centroid / radius)."""
    if not rounded: return Q
    out = []; n = len(Q); close = lambda a, b: math.dist(a, b) < 1e-6
    for k in range(n):
        a = Q[k]; b = Q[(k+1) % n]; out.append(a)
        if (close(a, I['o2']) and close(b, I['i2'])) or (close(a, I['i1']) and close(b, I['o1'])):
            c = ((a[0]+b[0])/2, (a[1]+b[1])/2); h = I['h']
            a0 = math.atan2(a[1]-c[1], a[0]-c[0])
            # outward = counter-clockwise on screen (decreasing angle in y-down coords)
            for j in range(1, seg):
                t = a0 - math.pi*j/seg; out.append((c[0]+h*math.cos(t), c[1]+h*math.sin(t)))
    return out

def place(pcs, info, rounded, cx, cy, fit=None, R=None, opt=0.35):
    """Scale so the bbox fits `fit` (max side) or all points lie within radius R of (cx,cy); blend bbox centre / centroid."""
    def geo(s):
        P, I = xform(pcs, info, s, 0, 0)
        A = [poly_with_caps(Q, I, rounded) for Q in P]
        return P, I, A
    P, I, A = geo(1)
    x0, y0, x1, y1 = bbox(A)
    if fit: s = fit/max(x1-x0, y1-y0)
    else: s = 1
    P, I, A = geo(s)
    x0, y0, x1, y1 = bbox(A); gx, gy = centroid(A)
    tx = cx - ((x0+x1)/2 + (gx-(x0+x1)/2)*opt); ty = cy - ((y0+y1)/2 + (gy-(y0+y1)/2)*opt)
    P, I = xform(P, I, 1, tx, ty); A = [[(x+tx, y+ty) for x, y in Q] for Q in A]
    if R:
        r = max(math.dist(p, (cx, cy)) for Q in A for p in Q)
        k = R/r
        P = [[((x-cx)*k+cx, (y-cy)*k+cy) for x, y in Q] for Q in P]
        A = [[((x-cx)*k+cx, (y-cy)*k+cy) for x, y in Q] for Q in A]
        for key in ('o1', 'o2', 'i1', 'i2'): I[key] = ((I[key][0]-cx)*k+cx, (I[key][1]-cy)*k+cy)
        I['h'] *= k
    return P, I, A

def d_of(P, I, rounded): return ''.join(piece_path(Q, I, rounded) for Q in P)
