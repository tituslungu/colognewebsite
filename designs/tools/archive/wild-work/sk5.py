import math
from sheetlib import *
from geo import *
items = []
def check_outline(P0, P1, P2, W):
    h = W/2
    (u1, L1) = unit(P0, P1); (u2, L2) = unit(P1, P2)
    n1 = (-u1[1], u1[0]); n2 = (-u2[1], u2[0])
    def inter(p, d, q, e):
        den = d[0]*e[1]-d[1]*e[0]; t = ((q[0]-p[0])*e[1]-(q[1]-p[1])*e[0])/den; return (p[0]+d[0]*t, p[1]+d[1]*t)
    A = (P0[0]+n1[0]*h, P0[1]+n1[1]*h); B = (P0[0]-n1[0]*h, P0[1]-n1[1]*h)
    Cc = (P2[0]+n2[0]*h, P2[1]+n2[1]*h); D = (P2[0]-n2[0]*h, P2[1]-n2[1]*h)
    M1 = inter(A, u1, Cc, u2); M2 = inter(B, u1, D, u2)
    return [A, M1, Cc, D, M2, B]
def P(pts): return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x,y in pts) + 'Z'
def knife(idn, col, P0, P1, P2, W, cuts, gap, angle=90):
    """cuts: x positions of vertical cuts (angle = cut direction in degrees from x-axis)."""
    d = P(check_outline(P0, P1, P2, W))
    m = ''.join(f'<rect x="{f(x-gap/2)}" y="-200" width="{gap}" height="700" transform="rotate({angle-90} {f(x)} 128)" fill="#000"/>' for x in cuts)
    return f'<defs><mask id="{idn}"><rect x="-50" y="-50" width="356" height="356" fill="#fff"/>{m}</mask></defs><path d="{d}" fill="{col}" mask="url(#{idn})"/>'
Q = ((58, 130), (106, 178), (202, 82))
for i,(nm, cuts, ang) in enumerate([('V1 vertical cuts — the vertex becomes a little V', (84, 128), 90),
                         ('V2 vertical cuts, wider V', (78, 136), 90),
                         ('V3 cuts leaning with the long leg (75°)', (84, 132), 75),
                         ('V4 three cuts / four shares', (80, 124, 164), 90)]):
    items.append((nm, svg(knife(f'a{i}', C['sage'], *Q, 46, cuts, 15, ang)), tile(knife(f'b{i}', C['sage'], *Q, 46, cuts, 15, ang))))
# two tone: vertex V in charcoal on white / white on charcoal
def knife2(idn, cols, cuts, gap=15, W=46, ang=90):
    d = P(check_outline(*Q, W)); s=''
    edges = [-100] + list(cuts) + [400]
    for k in range(len(edges)-1):
        a = edges[k] + (gap/2 if k>0 else 0); b = edges[k+1] - (gap/2 if k < len(edges)-2 else 0)
        s += f'<clipPath id="{idn}{k}"><rect x="{f(a)}" y="-100" width="{f(b-a)}" height="500" transform="rotate({ang-90} {f((a+b)/2)} 128)"/></clipPath><path d="{d}" fill="{cols[k]}" clip-path="url(#{idn}{k})"/>'
    return s
items.append(('V5 shares in tones', svg(knife2('c', [C['sage'], C['char'], C['sage']], (84,128))), tile(knife2('d', [C['sagel'], '#fff', C['sage']], (84,128)))))
# Mobile / balance
def mobile(bar, w1, w2, w3, line):
    s = ''
    # top pivot string
    s += f'<rect x="{128-5}" y="36" width="10" height="34" rx="5" fill="{line}"/>'
    s += f'<rect x="44" y="66" width="168" height="16" rx="8" fill="{bar}"/>'
    # left weight big (close to pivot = 128 -> pivot at x=128; left arm length 60, right arm 76)
    s += f'<circle cx="62" cy="128" r="34" fill="{w1}"/><rect x="57" y="74" width="10" height="24" fill="{line}"/>'
    s += f'<rect x="191" y="74" width="10" height="44" fill="{line}"/>'
    s += f'<rect x="150" y="114" width="80" height="14" rx="7" fill="{bar}"/>'
    s += f'<circle cx="164" cy="170" r="24" fill="{w2}"/><circle cx="214" cy="160" r="15" fill="{w3}"/>'
    s += f'<rect x="159" y="122" width="10" height="26" fill="{line}"/><rect x="209" y="122" width="10" height="24" fill="{line}"/>'
    return s
items.append(('Balance — a mobile: unequal shares, still in balance', svg(mobile(C['char'], C['sage'], C['sage'], C['sage'], C['char'])), tile(mobile('#fff', C['sage'], C['sage'], C['sage'], '#fff'))))
# Coaster variants: two coasters overlapping, each with its own strokes
def coasters(c1, c2, m1, m2, bg):
    s = f'<circle cx="104" cy="112" r="72" fill="{c1}"/>'
    for x in (80, 100, 120):
        s += f'<rect x="{x-6}" y="80" width="12" height="64" rx="6" fill="{m1}"/>'
    s += f'<circle cx="170" cy="168" r="56" fill="{bg}"/><circle cx="170" cy="168" r="48" fill="{c2}"/>'
    for x in (160, 180):
        s += f'<rect x="{x-6}" y="144" width="12" height="48" rx="6" fill="{m2}"/>'
    return s
items.append(('Coasters — one tab each', svg(coasters(C['sage'], C['char'], C['char'], C['sage'], '#fafaf8')), tile(coasters(C['sage'], '#fff', C['char'], C['char'], C['char']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk5.html')
