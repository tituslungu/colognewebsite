import math
from sheetlib import *
from geo import *
items = []
# --- Split check family. Check points.
P0, P1, P2 = (62, 136), (108, 182), (198, 80)
W = 44
def check_pieces(cuts_short, cuts_long, gap, caps='round'):
    """cuts as distances along each leg where a gap is centered; pieces built as capsules; vertex piece is a polyline."""
    pass
# Variant C1: three separate capsules — short leg, vertex-to-mid, mid-to-tip (gaps cut flat, outer ends round)
def c1(col, g=16, m=0.42):
    (u, L2) = unit(P1, P2)
    cut = along(P1, P2, L2*m)
    a = along(P1, P2, L2*m - g/2); b = along(P1, P2, L2*m + g/2)
    # short leg ends before vertex by gap/2 measured along short leg
    (u1, L1) = unit(P0, P1)
    s_end = along(P0, P1, L1 - W/2 - g/2)
    s = f'<path fill="{col}" d="{capsule(P0, s_end, W, "round", "butt")}"/>'
    # vertex piece: from vertex (with butt join on short side) to a
    v_start = along(P1, P0, W/2 - 0)  # little overlap back toward the short leg
    s += f'<path fill="{col}" d="{capsule(along(P1,P0,0), a, W, "butt", "butt")}"/>'
    s += f'<path fill="{col}" d="{capsule(b, P2, W, "butt", "round")}"/>'
    return s
items.append(('C1 check, 3 pieces (crude geometry)', svg(c1(C['sage'])), tile(c1(C['sage']))))

# Variant C2: check made of three capsules that overlap in tone (multiply-like): short leg charcoal, long leg split in two sage tones
def c2(cols, g=14):
    (u2, L2) = unit(P1, P2)
    m = along(P1, P2, L2*0.45)
    s = f'<path fill="{cols[0]}" d="{capsule(P0, P1, W)}"/>'
    s += f'<path fill="{cols[1]}" d="{capsule(P1, along(P1,P2,L2*0.45-g/2), W, "round", "butt")}"/>'
    s += f'<path fill="{cols[2]}" d="{capsule(along(P1,P2,L2*0.45+g/2), P2, W, "butt", "round")}"/>'
    return s
items.append(('C2 check of three tones (short leg / lower / upper)', svg(c2([C['char'], C['saged'], C['sage']])), tile(c2(['#fff', C['sagel'], C['sage']]))))

# Triple tick (read receipts) nested, unequal
def ticks(cols):
    s=''
    for (dx, sc, col) in ((-34, 0.72, cols[0]), (0, 0.86, cols[1]), (40, 1.0, cols[2])):
        pts = [(x*sc+dx+ (1-sc)*128, y*sc + (1-sc)*150) for x,y in (P0,P1,P2)]
        s += f'<path d="M{f(pts[0][0])} {f(pts[0][1])}L{f(pts[1][0])} {f(pts[1][1])}L{f(pts[2][0])} {f(pts[2][1])}" fill="none" stroke="{col}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>'
    return s
items.append(('Triple tick — everyone has ticked (read-receipt nod)', svg(ticks([C['char'], C['saged'], C['sage']])), tile(ticks(['#fff', C['sagel'], C['sage']]))))

# Apollonian: radii 1/2, 1/3, 1/6 inside the table — 'the shares add up'
def apol(R, ks, rot, gap, inner_cols, ring_col=None, ring_w=0, disc_col=None):
    # ks: curvatures of 3 inner circles (given k2,k3 -> k4 from Descartes)
    k1 = -1/R; k2, k3 = ks
    k4 = k1+k2+k3+2*math.sqrt(k1*k2+k2*k3+k3*k1)
    r2, r3, r4 = 1/k2, 1/k3, 1/k4
    c2 = (-(R-r2), 0)
    d1 = R - r3; d12 = r2 + r3
    px = (d12**2 - d1**2 - (R-r2)**2)/(2*(R-r2)); py = -math.sqrt(d1**2 - px**2)
    c3 = (-px, py) if False else (px*-1, py)
    c3 = (-( (d12**2 - d1**2 - (R-r2)**2)/(2*(R-r2)) ), py)
    # recompute c3 properly: |c3|=d1, |c3-c2|=d12
    x = (d1**2 - d12**2 + (R-r2)**2) / (2*(R-r2)) * -1
    # |c3-c2|^2 = (x+(R-r2))^2 + y^2 = d12^2 ; x^2+y^2=d1^2 => 2x(R-r2) + (R-r2)^2 = d12^2-d1^2
    x = (d12**2 - d1**2 - (R-r2)**2)/(2*(R-r2)); y = -math.sqrt(max(d1**2-x**2,0)); c3=(x,y)
    best=None
    for i in range(36000):
        a=i/100*math.pi/180; p=((R-r4)*math.cos(a),(R-r4)*math.sin(a))
        e=abs(math.dist(p,c2)-(r2+r4))+abs(math.dist(p,c3)-(r3+r4))
        if best is None or e<best[0]: best=(e,p)
    c4=best[1]
    cr = math.cos(math.radians(rot)); sr = math.sin(math.radians(rot))
    R_ = lambda p: (128 + p[0]*cr - p[1]*sr, 128 + p[0]*sr + p[1]*cr)
    s=''
    if disc_col: s += f'<circle cx="128" cy="128" r="{R}" fill="{disc_col}"/>'
    if ring_col: s += f'<circle cx="128" cy="128" r="{R-ring_w/2}" fill="none" stroke="{ring_col}" stroke-width="{ring_w}"/>'
    for (c, r), col in zip(((c2,r2),(c3,r3),(c4,r4)), inner_cols):
        q = R_(c); s += f'<circle cx="{f(q[0])}" cy="{f(q[1])}" r="{f(r-gap/2)}" fill="{col}"/>'
    return s, (r2, r3, r4)
R=104
a1, rr = apol(R, (2/R, 3/R), 200, 10, [C['sage']]*3, disc_col=C['char'])
print('1/2 1/3 1/6 radii', rr)
a1t, _ = apol(R, (2/R, 3/R), 200, 10, [C['sage'], C['sagel'], '#fff'], ring_col=C['sage'], ring_w=0)
items.append(('Round table ½ + ⅓ + ⅙ = 1 (radii) — room for one more', svg(a1), tile(apol(R, (2/R,3/R), 200, 10, [C['sage']]*3, disc_col='#3a3a3a')[0])))
a2, rr2 = apol(R, (1/(0.6*R), 1/(0.4*R)), 140, 10, [C['sage'], C['sage'], C['sage']], disc_col=C['char'])
items.append(('Round table 0.6 / 0.4 / 0.33', svg(a2), tile(apol(R, (1/(0.6*R), 1/(0.4*R)), 140, 10, [C['sage'], C['sagel'], '#fff'])[0] + f'<circle cx="128" cy="128" r="{R}" fill="none" stroke="#fff" stroke-width="10"/>')))

# Waterfall: total bar + staggered shares
def waterfall(top, sh):
    x0, x1 = 48, 208; h = 26; g = 12; y = 128 - (4*h+3*g)/2
    s = f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="{h}" rx="{h/2}" fill="{top}"/>'
    parts = [0.46, 0.30, 0.24]; x = x0
    for i, p in enumerate(parts):
        w = (x1-x0)*p; yy = y + (i+1)*(h+g)
        s += f'<rect x="{f(x)}" y="{f(yy)}" width="{f(w)}" height="{h}" rx="{h/2}" fill="{sh}"/>'; x += w
    return s
items.append(('Waterfall — the bill, line by line', svg(waterfall(C['char'], C['sage'])), tile(waterfall('#fff', C['sage']))))

# DIVI 2x2 modular tile
def modular(col, acc):
    g=12; c=78; x0=128-c-g/2; x1=128+g/2
    s = f'<path d="M{x0} {x0}H{x0+c/2}A{c/2} {c/2} 0 0 1 {x0+c/2} {x0+c}H{x0}Z" fill="{col}"/>'
    s += f'<rect x="{x1+c/2-14}" y="{x0}" width="28" height="{c}" fill="{col}"/>'
    s += f'<path d="M{x0} {x1}H{x0+c}L{x0+c/2} {x1+c}Z" fill="{acc}"/>'
    s += f'<rect x="{x1+c/2-14}" y="{x1}" width="28" height="{c}" fill="{col}"/>'
    return s
items.append(('D-I-V-I modular tile', svg(modular(C['char'], C['sage'])), tile(modular('#fff', C['sage']))))
# Bird with split bill
def bird(body, beak, eye):
    s = f'<circle cx="112" cy="132" r="72" fill="{body}"/>'
    s += f'<path d="M176 104L236 118L180 128Z" fill="{beak}"/><path d="M180 136L230 146L172 160Z" fill="{beak}"/>'
    s += f'<circle cx="138" cy="106" r="11" fill="{eye}"/>'
    return s
items.append(('Split the bill — a bird whose bill splits', svg(bird(C['char'], C['sage'], '#fafaf8')), tile(bird('#fff', C['sage'], C['char']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk3.html')
