import math
f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
def clip_half(poly, a, b, c):
    """Keep points where a*x + b*y + c >= 0 (Sutherland–Hodgman, one half-plane)."""
    out = []
    n = len(poly)
    for i in range(n):
        P = poly[i]; Q = poly[(i+1) % n]
        dp = a*P[0]+b*P[1]+c; dq = a*Q[0]+b*Q[1]+c
        if dp >= 0: out.append(P)
        if (dp >= 0) != (dq >= 0):
            t = dp/(dp-dq); out.append((P[0]+(Q[0]-P[0])*t, P[1]+(Q[1]-P[1])*t))
    return out
def strip_x(poly, x0, x1):
    p = clip_half(poly, 1, 0, -x0)   # x >= x0
    return clip_half(p, -1, 0, x1)   # x <= x1
def strip_dir(poly, ang_deg, s0, s1, cx=128, cy=128):
    """Keep points whose signed distance along normal n=(cos,sin) of ang lies in [s0,s1] (measured from cx,cy)."""
    a = math.cos(math.radians(ang_deg)); b = math.sin(math.radians(ang_deg))
    p = clip_half(poly, a, b, -(a*cx+b*cy) - s0)
    return clip_half(p, -a, -b, (a*cx+b*cy) + s1)
def line_inter(p, d, q, e):
    den = d[0]*e[1]-d[1]*e[0]; t = ((q[0]-p[0])*e[1]-(q[1]-p[1])*e[0])/den
    return (p[0]+d[0]*t, p[1]+d[1]*t)
def path(poly, r=0):
    if r <= 0:
        return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in poly) + 'Z'
    # round every corner with radius r (clamped to half the shorter adjacent edge)
    n = len(poly); s = ''
    for i in range(n):
        P0 = poly[i-1]; P1 = poly[i]; P2 = poly[(i+1) % n]
        d1 = math.dist(P0, P1); d2 = math.dist(P1, P2)
        u1 = ((P0[0]-P1[0])/d1, (P0[1]-P1[1])/d1); u2 = ((P2[0]-P1[0])/d2, (P2[1]-P1[1])/d2)
        cosang = max(-1, min(1, u1[0]*u2[0]+u1[1]*u2[1])); ang = math.acos(cosang)
        t = r/math.tan(ang/2) if ang > 1e-6 else 0
        t = min(t, d1*0.45, d2*0.45); rr = t*math.tan(ang/2)
        A = (P1[0]+u1[0]*t, P1[1]+u1[1]*t); B = (P1[0]+u2[0]*t, P1[1]+u2[1]*t)
        cross = u1[0]*u2[1]-u1[1]*u2[0]
        sweep = 1 if cross < 0 else 0
        s += (f'M{f(A[0])} {f(A[1])}' if i == 0 else f'L{f(A[0])} {f(A[1])}') + f'A{f(rr)} {f(rr)} 0 0 {sweep} {f(B[0])} {f(B[1])}'
    return s + 'Z'
def area(poly):
    return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly))))/2
