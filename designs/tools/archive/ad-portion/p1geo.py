"""Analytic geometry for portion-1 "Three Shares".

A round bubble (centre C, radius R) is cut by two straight gaps of width g.
Cut i passes through (x_i, cy) and leans a_i degrees (top to the right).
  share 0: left crescent        n0.p <= c0 - h
  share 1: middle share         n0.p >= c0 + h  and  n1.p <= c1 - h, plus the tail
  share 2: right D (sage)       n1.p >= c1 + h
The tail continues share 1's left edge (the first cut) straight past the rim to
a tip T, and returns to the rim along edge E (T -> Q). Every convex corner gets
a true fillet arc (rim fillets rf, tip rt); the tail/rim join gets a concave
fillet rq. Each share is one closed path; all arcs are exact.
"""
import math

def v(x, y): return (x, y)
def add(a, b): return (a[0] + b[0], a[1] + b[1])
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def mul(a, k): return (a[0] * k, a[1] * k)
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def norm(a): return math.hypot(*a)
def unit(a): n = norm(a); return (a[0] / n, a[1] / n)
def cross(a, b): return a[0] * b[1] - a[1] * b[0]


def basis(deg):
    a = math.radians(deg)
    u = (math.sin(a), -math.cos(a))   # along the cut, pointing up
    n = (math.cos(a), math.sin(a))    # normal, pointing right
    return u, n


def line_circle(n, u, k, C, R, top):
    """Point on line n.p = k at distance R from C; top=True picks the upper one."""
    cn, cu = dot(n, C), dot(u, C)
    d = R * R - (k - cn) ** 2
    if d < 0: raise ValueError('line misses circle')
    t = cu + math.sqrt(d) if top else cu - math.sqrt(d)
    return add(mul(n, k), mul(u, t))


def rim_fillet(n, u, k, sgn, C, R, rf, top):
    """Convex fillet where line n.p=k meets the inside of circle (C,R).
    Region is on side sgn (+1: n.p >= k). Returns (point on line, point on rim, centre)."""
    q = line_circle(n, u, k + sgn * rf, C, R - rf, top)
    pl = sub(q, mul(n, sgn * rf))
    pc = add(C, mul(sub(q, C), R / (R - rf)))
    return pl, pc, q


class Path:
    def __init__(self, p0, nd=2):
        self.nd = nd
        self.d = ['M' + self.f(p0)]

    def f(self, p):
        r = lambda x: ('%.*f' % (self.nd, x)).rstrip('0').rstrip('.')
        return r(p[0]) + ' ' + r(p[1])

    def L(self, p): self.d.append('L' + self.f(p))

    def A(self, r, p, large, sweep):
        rr = ('%.*f' % (self.nd, r)).rstrip('0').rstrip('.')
        self.d.append('A%s %s 0 %d %d %s' % (rr, rr, large, sweep, self.f(p)))

    def Z(self): self.d.append('Z'); return ''.join(self.d)


def arc_flags(C, p_from, p_to, sweep):
    """Large-arc flag for an arc around C from p_from to p_to, sweep 1 = clockwise on screen."""
    a0 = math.atan2(p_from[1] - C[1], p_from[0] - C[0])
    a1 = math.atan2(p_to[1] - C[1], p_to[0] - C[0])
    span = (a1 - a0) % (2 * math.pi) if sweep == 1 else (a0 - a1) % (2 * math.pi)
    return 1 if span > math.pi else 0


def build(P):
    cx, cy, R = P['cx'], P['cy'], P['R']
    C = (cx, cy)
    h = P['g'] / 2
    rf = P['rf']
    u0, n0 = basis(P['a0'])
    u1, n1 = basis(P['a1'])
    c0 = dot(n0, (P['x0'], cy))
    c1 = dot(n1, (P['x1'], cy))
    out = {}

    # share 0: left crescent, n0.p <= c0 - h, clockwise: down the cut, round the left, back
    k = c0 - h
    tl, tc, _ = rim_fillet(n0, u0, k, -1, C, R, rf, True)
    bl, bc, _ = rim_fillet(n0, u0, k, -1, C, R, rf, False)
    p = Path(tl)
    p.L(bl)
    p.A(rf, bc, 0, 1)
    p.A(R, tc, arc_flags(C, bc, tc, 1), 1)
    p.A(rf, tl, 0, 1)
    out['s0'] = p.Z()

    # share 2: right D, n1.p >= c1 + h, clockwise: up the cut, round the right, back
    k = c1 + h
    tl2, tc2, _ = rim_fillet(n1, u1, k, +1, C, R, rf, True)
    bl2, bc2, _ = rim_fillet(n1, u1, k, +1, C, R, rf, False)
    p = Path(bl2)
    p.L(tl2)
    p.A(rf, tc2, 0, 1)
    p.A(R, bc2, arc_flags(C, tc2, bc2, 1), 1)
    p.A(rf, bl2, 0, 1)
    out['s2'] = p.Z()

    # share 1: middle + tail
    kL = c0 + h          # left edge (region n0.p >= kL)
    kR = c1 - h          # right edge (region n1.p <= kR)
    a_l, a_c, _ = rim_fillet(n0, u0, kL, +1, C, R, rf, True)      # top-left
    b_l, b_c, _ = rim_fillet(n1, u1, kR, -1, C, R, rf, True)      # top-right
    d_l, d_c, _ = rim_fillet(n1, u1, kR, -1, C, R, rf, False)     # bottom-right
    # tail tip T: on the left edge line, t_tip units below where it leaves the rim
    exit_pt = line_circle(n0, u0, kL, C, R, False)
    T = sub(exit_pt, mul(u0, P['tail_len']))
    # Q: rim point at angle qdeg (screen angle, 90 = straight down)
    if 'q_off' in P:
        ax = math.degrees(math.atan2(exit_pt[1] - cy, exit_pt[0] - cx))
        P = dict(P); P['qdeg'] = ax - P['q_off']
    qa = math.radians(P['qdeg'])
    Q0 = (cx + R * math.cos(qa), cy + R * math.sin(qa))
    e = unit(sub(T, Q0))               # along E, from Q towards T
    m = (e[1], -e[0])                  # a normal of E
    # outward side of E = the side away from the tail interior (tail interior contains exit_pt side?)
    mid_tail = add(mul(add(T, exit_pt), 0.5), mul(sub(Q0, exit_pt), 0.3))
    if dot(m, sub(mid_tail, T)) > 0: m = mul(m, -1)
    rq = P['rq']
    # concave fillet centre: on line m.p = m.T + rq, at distance R + rq from C, nearest to Q0
    kk = dot(m, T) + rq
    cn, ce = dot(m, C), dot(e, C)
    dd = (R + rq) ** 2 - (kk - cn) ** 2
    cands = [add(mul(m, kk), mul(e, ce + s * math.sqrt(dd))) for s in (1, -1)]
    q = min(cands, key=lambda c: norm(sub(c, Q0)))
    qe = sub(q, mul(m, rq))                         # tangent point on E
    qc = add(C, mul(sub(q, C), R / (R + rq)))       # tangent point on rim
    # tip fillet between E (arriving, direction e) and left edge (departing, direction u0)
    rt = P['rt']
    a_in = e
    b_out = u0
    phi = math.acos(max(-1, min(1, dot(mul(a_in, -1), b_out))))
    dist = rt / math.tan(phi / 2)
    t_in = sub(T, mul(a_in, dist))
    t_out = add(T, mul(b_out, dist))

    p = Path(a_l)
    p.A(rf, a_c, 0, 1)
    p.A(R, b_c, arc_flags(C, a_c, b_c, 1), 1)
    p.A(rf, b_l, 0, 1)
    p.L(d_l)
    p.A(rf, d_c, 0, 1)
    p.A(R, qc, arc_flags(C, d_c, qc, 1), 1)
    p.A(rq, qe, 0, 0)
    p.L(t_in)
    p.A(rt, t_out, 0, 1)
    p.L(a_l)
    out['s1'] = p.Z()

    # metrics: areas by sampling, extents
    pts = [tc, bc, tc2, bc2, a_c, b_c, d_c, qc, T]
    ext = {'minx': cx - R, 'maxx': cx + R, 'miny': cy - R, 'maxy': max(cy + R, T[1]), 'T': T}
    ext['minx'] = min(ext['minx'], T[0])
    out['ext'] = ext
    # area shares inside the circle (Monte Carlo grid)
    cnt = [0, 0, 0]
    N = 400
    for i in range(N):
        for j in range(N):
            x = cx - R + (i + .5) * 2 * R / N
            y = cy - R + (j + .5) * 2 * R / N
            if (x - cx) ** 2 + (y - cy) ** 2 > R * R: continue
            s0 = dot(n0, (x, y)); s1 = dot(n1, (x, y))
            if s0 <= c0 - h: cnt[0] += 1
            elif s0 >= c0 + h and s1 <= c1 - h: cnt[1] += 1
            elif s1 >= c1 + h: cnt[2] += 1
    tot = sum(cnt)
    out['areas'] = [round(100 * c / tot, 1) for c in cnt]
    # max distance of any silhouette point from a given centre (for circle-crop checks)
    def maxdist(cc):
        md = norm(sub(C, cc)) + R
        return max(md, norm(sub(T, cc)))
    out['maxdist'] = maxdist
    return out


def svg(paths, fills, tile=None, vb='0 0 256 256', extra=''):
    body = ''
    if tile: body += '<rect width="256" height="256" fill="%s"/>' % tile
    # merge shares that share a fill into one path element
    groups = {}
    order = []
    for k, f in zip(('s0', 's1', 's2'), fills):
        if f not in groups: groups[f] = []; order.append(f)
        groups[f].append(paths[k])
    for f in order:
        body += '<path fill="%s" d="%s"/>' % (f, ''.join(groups[f]))
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s" role="img" aria-label="Divi">'
            '<title>Divi</title>%s%s</svg>\n') % (vb, body, extra)
