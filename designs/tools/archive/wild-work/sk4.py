import math
from sheetlib import *
from geo import *
items = []
def poly_outline(pts, w):
    """Outline of a thick polyline with miter join (2 segments) and flat ends. Returns list of points."""
    h = w/2
    (u1, L1) = unit(pts[0], pts[1]); (u2, L2) = unit(pts[1], pts[2])
    n1 = (-u1[1], u1[0]); n2 = (-u2[1], u2[0])
    # miter points
    def inter(p, d, q, e):
        den = d[0]*e[1]-d[1]*e[0]
        t = ((q[0]-p[0])*e[1]-(q[1]-p[1])*e[0])/den
        return (p[0]+d[0]*t, p[1]+d[1]*t)
    A = (pts[0][0]+n1[0]*h, pts[0][1]+n1[1]*h); B = (pts[0][0]-n1[0]*h, pts[0][1]-n1[1]*h)
    C_ = (pts[2][0]+n2[0]*h, pts[2][1]+n2[1]*h); D = (pts[2][0]-n2[0]*h, pts[2][1]-n2[1]*h)
    M1 = inter(A, u1, C_, u2); M2 = inter(B, u1, D, u2)
    return A, M1, C_, D, M2, B
P0, P1, P2 = (60, 128), (106, 174), (200, 80)
def path(pts): return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x,y in pts) + 'Z'
def check_split(W, cuts, gap, cols):
    """cuts: list of (leg, t) where leg 0 = short leg, 1 = long leg, t = fraction along leg; cut perpendicular to leg."""
    A, M1, C_, D, M2, B = poly_outline((P0, P1, P2), W)
    # Build full outline polygon then clip by half-planes for pieces — simpler: use clipPath with gap rects
    s = ''
    clip = ''
    for leg, t in cuts:
        a, b = (P0, P1) if leg == 0 else (P1, P2)
        (u, L) = unit(a, b); p = along(a, b, L*t)
        ang = math.degrees(math.atan2(u[1], u[0]))
        clip += f'<rect x="{f(p[0]-gap/2)}" y="{f(p[1]-100)}" width="{gap}" height="200" transform="rotate({f(ang)} {f(p[0])} {f(p[1])})" fill="#000"/>'
    return path((A, M1, C_, D, M2, B)), clip
def mk(W, cuts, gap, col, bg, idn):
    d, clip = check_split(W, cuts, gap, None)
    return f'<defs><mask id="{idn}"><rect width="256" height="256" fill="#fff"/>{clip}</mask></defs><path d="{d}" fill="{col}" mask="url(#{idn})"/>'
# S1: cut short leg near vertex + long leg at 45%
for name, cuts in [('K1 one cut per leg', [(0, 0.62), (1, 0.42)]), ('K2 two cuts on long leg', [(1, 0.25), (1, 0.62)]), ('K3 cut per leg + tip', [(0, 0.55), (1, 0.30), (1, 0.70)]), ('K4 vertex isolated', [(0, 0.45), (1, 0.22)])]:
    items.append((name, svg(mk(46, cuts, 14, C['sage'], None, 'm'+name[:2])), tile(mk(46, cuts, 14, C['sage'], None, 't'+name[:2]))))
# Sankey corner fan
def corner(ws=(50,30,18), gap=18, x0=44, y0=40, R0=24):
    # vertical band at left from y0 down, turning right around a corner centred at (cx, cy)
    H = sum(ws); cx = x0 + H + R0; cy = 128
    s = ''
    # bands separate only in the turn: inner band radius R0..R0+w3 etc. use concentric arcs with gaps from turn start
    r = R0; bands = []
    for w in reversed(ws):
        bands.append((r, r+w)); r += w + gap
    s = ''
    xs_left = cx - bands[-1][1]
    for (ri, ro) in bands:
        # vertical part from y0 to cy at x in [cx-ro, cx-ri], then quarter arc to horizontal ending at x=220
        d = f'M{f(cx-ro)} {y0}V{cy}A{ro} {ro} 0 0 0 {cx} {f(cy+ro)}H218V{f(cy+ri)}H{cx}A{ri} {ri} 0 0 1 {f(cx-ri)} {cy}V{y0}Z'
        s += d
    return s
cd = corner()
items.append(('Sankey corner — the bill turns and parts ways', svg(f'<path fill="{C["sage"]}" d="{cd}"/>'), tile(f'<path fill="{C["sage"]}" d="{cd}"/>')))
# Coaster tally (Kölsch Deckel)
def coaster(disc, mark, ring=None):
    s = f'<circle cx="128" cy="128" r="96" fill="{disc}"/>'
    for x in (92, 116, 140, 164):
        s += f'<rect x="{x-7}" y="80" width="14" height="96" rx="7" fill="{mark}"/>'
    s += f'<rect x="64" y="121" width="128" height="14" rx="7" fill="{mark}" transform="rotate(-30 128 128)"/>'
    return s
items.append(('Coaster tally — the beer-hall tab, one coaster each', svg(coaster(C['sage'], C['char'])), tile(coaster(C['sage'], C['char']))))
# Fair share: equals with unequal lower bar
def fair(top, low, sh=36, g=22):
    x0, x1 = 48, 208; y1 = 128 - g/2 - sh; y2 = 128 + g/2
    s = f'<rect x="{x0}" y="{y1}" width="{x1-x0}" height="{sh}" rx="{sh/2}" fill="{top}"/>'
    ws = (0.5, 0.3, 0.2); gg = 12; tot = x1-x0-2*gg; x = x0
    for w in ws:
        W = tot*w; s += f'<rect x="{f(x)}" y="{y2}" width="{f(W)}" height="{sh}" rx="{sh/2}" fill="{low}"/>'; x += W + gg
    return s
items.append(('Fair share — an equals sign whose lower bar is unequal', svg(fair(C['char'], C['sage'])), tile(fair('#fff', C['sage']))))
# ivi face
def ivi(col, dot):
    return (f'<rect x="54" y="118" width="30" height="86" rx="15" fill="{col}"/><rect x="172" y="118" width="30" height="86" rx="15" fill="{col}"/>'
            f'<path d="M98 118L128 204L158 118" fill="none" stroke="{col}" stroke-width="30" stroke-linejoin="round" stroke-linecap="round"/>'
            f'<circle cx="69" cy="80" r="19" fill="{dot}"/><circle cx="187" cy="80" r="19" fill="{dot}"/>')
items.append(('ivi — the heart of the name', svg(ivi(C['char'], C['sage'])), tile(ivi('#fff', C['sage']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk4.html')
