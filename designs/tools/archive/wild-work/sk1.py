import math, json
from sheetlib import *
items = []
f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')

# 1/2 Flow (Sankey) — one band splits into unequal ribbons
def flow(L=40, S=100, E=216, top=80, ws=(44,32,20), gap=30, round_end=False, round_start=False):
    H = sum(ws); outs = []; y = 128 - (H + gap*(len(ws)-1))/2
    ins = []; yi = top
    for w in ws:
        ins.append((yi, yi+w)); yi += w
        outs.append((y, y+w)); y += w + gap
    k = (E - S) * 0.55
    d = f'M{f(L)} {f(top)}H{f(S)}'
    for i, ((a,b),(A,B)) in enumerate(zip(ins, outs)):
        d += f'C{f(S+k)} {f(a)} {f(E-k)} {f(A)} {f(E)} {f(A)}'
        if round_end: d += f'A{f((B-A)/2)} {f((B-A)/2)} 0 0 1 {f(E)} {f(B)}'
        else: d += f'V{f(B)}'
        d += f'C{f(E-k)} {f(B)} {f(S+k)} {f(b)} {f(S)} {f(b)}'
    d += f'H{f(L)}'
    if round_start: d += f'A{f(H/2)} {f(H/2)} 0 0 1 {f(L)} {f(top)}'
    d += 'Z'
    return d
d1 = flow()
items.append(('1 Flow — one bill splits into unequal shares (flat ends)', svg(f'<path fill="{C["sage"]}" d="{d1}"/>'), tile(f'<path fill="{C["sage"]}" d="{d1}"/>')))
d2 = flow(L=70, S=104, E=200, top=80, round_end=True, round_start=True)
items.append(('2 Flow — rounded ends', svg(f'<path fill="{C["sage"]}" d="{d2}"/>'), tile(f'<path fill="{C["sage"]}" d="{d2}"/>')))
items.append(('3 Flow — diagonal fan', svg(f'<path fill="{C["sage"]}" transform="rotate(-35 128 128)" d="{d2}"/>'), tile(f'<path fill="{C["sage"]}" transform="rotate(-35 128 128)" d="{d2}"/>')))

# 4 Round table: three mutually tangent discs inside a circle (Descartes)
def tangent_inner(R, r1, r2):
    # circle 1 at angle 180deg, tangent inside outer; circle 2 tangent to outer and c1
    c1 = (-(R-r1), 0)
    d1 = R - r2; d12 = r1 + r2
    # |p|=d1, |p-c1|=d12
    x = (d1**2 - d12**2 + (R-r1)**2) / (2*(-(R-r1))) * -1
    # solve properly: |p|^2=d1^2 ; (px+R-r1)^2+py^2 = d12^2 -> 2px(R-r1) + (R-r1)^2 = d12^2 - d1^2
    px = (d12**2 - d1**2 - (R-r1)**2) / (2*(R-r1)); py = -math.sqrt(max(d1**2 - px**2, 0))
    return c1, (px, py)
def third(R, c1, r1, c2, r2):
    k1, k2, k3 = -1/R, 1/r1, 1/r2
    k4 = k1 + k2 + k3 + 2*math.sqrt(k1*k2 + k2*k3 + k3*k1)
    r3 = 1/k4
    # numeric solve for center: tangent to all
    best = None
    for i in range(0, 3600):
        a = i/10*math.pi/180; p = ((R-r3)*math.cos(a), (R-r3)*math.sin(a))
        e = abs(math.dist(p, c1) - (r1+r3)) + abs(math.dist(p, c2) - (r2+r3))
        if best is None or e < best[0]: best = (e, p)
    return best[1], r3
R = 104; r1, r2 = 0.6*R, 0.4*R
c1, c2 = tangent_inner(R, r1, r2)
c3, r3 = third(R, c1, r1, c2, r2)
print('round table radii', r1, r2, r3)
g = 7
def discs(cx, cy, fill):
    s = ''
    for (x,y), r in ((c1,r1),(c2,r2),(c3,r3)):
        s += f'<circle cx="{f(cx+x)}" cy="{f(cy+y)}" r="{f(r-g)}" fill="{fill}"/>'
    return s
rt = f'<circle cx="128" cy="128" r="{R}" fill="{C["char"]}"/>' + discs(128,128,C['sage'])
items.append(('4 Round table — three unequal plates fill one table', svg(rt), tile(f'<circle cx="128" cy="128" r="{R}" fill="none" stroke="{C["sage"]}" stroke-width="10"/>' + discs(128,128,C['sage']))))

# 5 QR of plates
def plate(cx, cy, col):
    return f'<circle cx="{cx}" cy="{cy}" r="36" fill="none" stroke="{col}" stroke-width="13"/><circle cx="{cx}" cy="{cy}" r="14" fill="{col}"/>'
qr = plate(84,84,C['char']) + plate(172,84,C['char']) + plate(84,172,C['char']) + f'<rect x="146" y="146" width="52" height="52" rx="10" fill="{C["sage"]}"/>'
qrt = plate(84,84,'#fff') + plate(172,84,'#fff') + plate(84,172,'#fff') + f'<rect x="146" y="146" width="52" height="52" rx="10" fill="{C["sage"]}"/>'
items.append(('5 QR of plates — the table is the code', svg(qr), tile(qrt)))

# 6 i-people
def ipeople(stem, dot):
    s=''; xs=(70,128,186); hs=(84,120,64)
    for x,h in zip(xs,hs):
        s += f'<rect x="{x-17}" y="{206-h}" width="34" height="{h}" rx="17" fill="{stem}"/><circle cx="{x}" cy="{206-h-34}" r="19" fill="{dot}"/>'
    return s
items.append(('6 i-people — the i’s of divi as friends of different appetites', svg(ipeople(C['char'], C['sage'])), tile(ipeople('#fff', C['sage']))))

# 7 lowercase divi geometric monoline
def ldivi(col, dot, sw=22):
    s = f'<g fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'
    s += f'<circle cx="62" cy="150" r="30"/><path d="M92 74V180"/><path d="M128 120V180"/><path d="M158 120L180 180L202 120"/><path d="M232 120V180"/></g>'
    s += f'<circle cx="128" cy="88" r="13" fill="{dot}"/><circle cx="232" cy="88" r="13" fill="{dot}"/>'
    return svg(s, '20 40 230 176')
lm = ldivi(C['char'], C['sage'])
items.append(('7 lowercase divi — tittles in sage', lm, tile(f'<g transform="translate(14 40) scale(0.9)">{ldivi("#fff", C["sage"])[ldivi("#fff", C["sage"]).index(">")+1:-6]}</g>')))

# 8 fanned phones
def phones(a, b, c):
    s=''
    for ang, col in ((-20,a),(20,c),(0,b)):
        s += f'<rect x="96" y="56" width="64" height="118" rx="14" fill="{col}" stroke="{C["off"] if col!=b else C["off"]}" stroke-width="0" transform="rotate({ang} 128 220)"/>'
    return s
ph = f'<g>' + ''.join(f'<rect x="97" y="52" width="62" height="116" rx="14" fill="{col}" stroke="#fafaf8" stroke-width="10" paint-order="stroke" transform="rotate({ang} 128 210)"/>' for ang,col in ((-24,C['char']),(24,C['char']),(0,C['sage']))) + '</g>'
pht = ''.join(f'<rect x="97" y="52" width="62" height="116" rx="14" fill="{col}" stroke="{C["char"]}" stroke-width="10" paint-order="stroke" transform="rotate({ang} 128 210)"/>' for ang,col in ((-24,'#fff'),(24,'#fff'),(0,C['sage'])))
items.append(('8 Fanned phones — everyone at the table on their own phone', svg(ph), tile(pht)))

# 9 Seat ring around a table
def ring(col_t, col_s):
    s = f'<circle cx="128" cy="128" r="52" fill="{col_t}"/>'
    rr = 86; arcs = [(-90, 110), (34, 70), (118, 84), (216, 44)]
    for st, ln in arcs:
        a0 = math.radians(st); a1 = math.radians(st+ln)
        x0,y0 = 128+rr*math.cos(a0), 128+rr*math.sin(a0); x1,y1 = 128+rr*math.cos(a1), 128+rr*math.sin(a1)
        s += f'<path d="M{f(x0)} {f(y0)}A{rr} {rr} 0 {1 if ln>180 else 0} 1 {f(x1)} {f(y1)}" fill="none" stroke="{col_s}" stroke-width="26" stroke-linecap="round"/>'
    return s
items.append(('9 Seats round a table — unequal places', svg(ring(C['sage'], C['char'])), tile(ring(C['sage'], '#fff'))))

# 10 Plates cluster
def cluster(cols):
    cs = [(104,118,52),(178,96,34),(170,172,40),(110,196,24)]
    return ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>' for (x,y,r),c in zip(cs, cols))
items.append(('10 Shared plates cluster', svg(cluster([C['sage'],C['char'],C['char'],C['char']])), tile(cluster([C['sage'],'#fff','#fff','#fff']))))

# 11 Clink — three glasses leaning in
def clink(cols):
    s=''
    for ang, h, col in ((-14, 120, cols[0]), (14, 100, cols[2]), (0, 140, cols[1])):
        s += f'<rect x="{128-20}" y="{214-h}" width="40" height="{h}" rx="20" fill="{col}" stroke="{cols[3]}" stroke-width="10" paint-order="stroke" transform="rotate({ang} 128 70)"/>'
    return s
items.append(('11 Clink — three glasses meet', svg(clink([C['char'],C['sage'],C['char'],'#fafaf8'])), tile(clink(['#fff',C['sage'],'#fff',C['char']]))))

# 12 DIVI as shapes — half disc, bar, triangle, bar
def shapes(col, acc):
    return (f'<path d="M36 84H60A44 44 0 0 1 60 172H36Z" fill="{col}"/>'
            f'<rect x="114" y="84" width="22" height="88" fill="{col}"/>'
            f'<path d="M148 84H198L173 172Z" fill="{acc}"/>'
            f'<rect x="210" y="84" width="22" height="88" fill="{col}"/>')
items.append(('12 D·I·V·I reduced to shapes', svg(shapes(C['char'], C['sage'])), tile(shapes('#fff', C['sage']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk1.html')
