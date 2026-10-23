import math
from sheetlib import *
items = []
f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
# Split check via dashed stroke (sketch only)
def check(col, sw=40, dash=None, cap='round', pts=((58,134),(106,182),(200,76)), extra=''):
    d = 'M' + 'L'.join(f'{x} {y}' for x,y in pts)
    da = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}" stroke-linejoin="round"{da}{extra}/>'
L1 = math.dist((58,134),(106,182)); L2 = math.dist((106,182),(200,76))
print('legs', L1, L2)
# round caps: visible gap = dashgap - sw
sw = 40; vg = 18; G = vg + sw
# pieces: short leg (L1 - small), then two pieces on long leg
a = L1 - 4; b = 58; c = (L1+L2) - a - b - 2*G
items.append(('B1 Split check — 3 unequal pieces, round caps', svg(check(C['sage'], dash=f'{f(a)} {G} {f(b)} {G} {f(c+40)} 999')), tile(check(C['sage'], dash=f'{f(a)} {G} {f(b)} {G} {f(c+40)} 999'))))
# flat caps: visible gap = dashgap
a2 = L1 + 0; b2 = 46; G2 = 18
items.append(('B2 Split check — flat cuts (perpendicular, so each cut has its own angle)', svg(check(C['sage'], dash=f'{f(a2-10)} {G2} {b2} {G2} 30 {G2} 999', cap='butt')), tile(check(C['sage'], dash=f'{f(a2-10)} {G2} {b2} {G2} 30 {G2} 999', cap='butt'))))
# multi colour pieces
def mc(cols, bg):
    s=''
    segs = [(0, L1-6), (L1-6+G2, 52), (L1-6+G2+52+G2, 999)]
    for (st, ln), col in zip(segs, cols):
        s += check(col, cap='butt', dash=f'0 {f(st)} {ln} 2000')
    return s
items.append(('B3 Split check — each share its own tone', svg(mc([C['char'], C['saged'], C['sage']], None)), tile(mc(['#fff', C['sagel'], C['sage']], None))))
# check cut by parallel vertical slices (knife cuts)
def sliced(col, bg):
    s = check(col, sw=42, cap='round')
    for x in (100, 150):
        s += f'<rect x="{x-8}" y="0" width="16" height="256" fill="{bg}" transform="rotate(14 {x} 128)"/>'
    return s
items.append(('B4 Split check — two parallel slanted knife cuts', svg(sliced(C['sage'], '#fafaf8')), tile(sliced(C['sage'], C['char']))))

# R: equation — the bill bar over unequal share bars
def eq(top, parts, bg):
    x0, x1 = 44, 212; h = 34; g = 16
    s = f'<rect x="{x0}" y="{128-g/2-h}" width="{x1-x0}" height="{h}" rx="{h/2}" fill="{top}"/>'
    ws = [0.48, 0.32, 0.20]; tot = (x1-x0) - g*2; x = x0
    for w, col in zip(ws, parts):
        W = tot*w; s += f'<rect x="{f(x)}" y="{128+g/2}" width="{f(W)}" height="{h}" rx="{h/2}" fill="{col}"/>'; x += W + g
    return s
items.append(('R1 The whole and its unequal parts', svg(eq(C['char'], [C['sage']]*3, None)), tile(eq('#fff', [C['sage']]*3, None))))

# A': Sankey framed: flows exit a circle
def flow_v(L=40, S=96, E=220, top=80, ws=(48,30,18), gap=24):
    H = sum(ws); outs=[]; y = 128-(H+gap*(len(ws)-1))/2; ins=[]; yi=top
    for w in ws:
        ins.append((yi, yi+w)); yi+=w; outs.append((y,y+w)); y+=w+gap
    k = (E-S)*0.5
    d = f'M{L} {top}H{S}'
    for (a,b),(A,B) in zip(ins,outs):
        d += f'C{f(S+k)} {f(a)} {f(E-k)} {f(A)} {E} {f(A)}V{f(B)}C{f(E-k)} {f(B)} {f(S+k)} {f(b)} {S} {f(b)}'
    d += f'H{L}Z'; return d
fv = flow_v()
clip = '<clipPath id="c"><circle cx="128" cy="128" r="100"/></clipPath>'
items.append(('A4 Flow inside a disc (Sankey seen through a porthole)', svg(f'<defs>{clip}</defs><circle cx="128" cy="128" r="100" fill="{C["char"]}"/><path clip-path="url(#c)" fill="{C["sage"]}" transform="translate(-30 0) scale(1.3 1) " d="{fv}"/>'), tile(f'<defs>{clip}</defs><circle cx="128" cy="128" r="100" fill="#3a3a3a"/><path clip-path="url(#c)" fill="{C["sage"]}" transform="translate(-30 0) scale(1.3 1)" d="{fv}"/>')))
# Downward flow — the bill pours into three shares
dv = flow_v(L=30, S=92, E=226, top=84, ws=(46,30,20), gap=26)
items.append(('A5 Flow downward', svg(f'<path fill="{C["sage"]}" transform="rotate(90 128 128)" d="{dv}"/>'), tile(f'<path fill="{C["sage"]}" transform="rotate(90 128 128)" d="{dv}"/>')))
# Tally
def tally(col, acc):
    s=''
    for i,x in enumerate((76,108,140,172)):
        s += f'<rect x="{x-11}" y="66" width="22" height="124" rx="11" fill="{col}"/>'
    s += f'<rect x="40" y="117" width="176" height="22" rx="11" fill="{acc}" transform="rotate(-28 128 128)"/>'
    return s
items.append(('T Tally — counting who had what', svg(tally(C['char'], C['sage'])), tile(tally('#fff', C['sage']))))
# Accordion receipt
def acc(cols):
    xs = [40, 98, 140, 216]; s=''
    ys = [(70,186),(90,166),(70,186)]
    pts = []
    for i in range(3):
        xa, xb = xs[i], xs[i+1]
        ta, ba = (70,186) if i%2==0 else (90,166)
        tb, bb = (90,166) if i%2==0 else (70,186)
        s += f'<path d="M{xa} {ta}L{xb} {tb}V{bb}L{xa} {ba}Z" fill="{cols[i]}"/>'
    return s
items.append(('F Folded bill — unequal panels', svg(acc([C['sage'], C['saged'], C['sage']])), tile(acc([C['sage'], C['saged'], C['sagel']]))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk2.html')
