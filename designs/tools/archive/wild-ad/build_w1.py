import sys, os, math
from w1lib import *
from wordmark import wordmark_d
from check2 import bbox, centroid
from poly import f, area
OUT = os.environ.get('OUT', '/Users/titus/repos/colognewebsite/designs/logos/wild-1')
CH, SAGE, WHITE = '#2D2D2D', '#6FAF8E', '#FFFFFF'
G = dict(W=50, short=98, long_=166, a_short=40, a_long=52, gap=13, cuts=((-34, 0), (40, 0)))
ROUND = True
FIT = float(os.environ.get('FIT', 208)); RSAFE = float(os.environ.get('RSAFE', 100))
OPT = float(os.environ.get('OPT', 0.35))
RATIO = float(os.environ.get('RATIO', 1.18)); DY = float(os.environ.get('DY', 2)); GAPC = float(os.environ.get('GAPC', 0.28))
pcs, info = build(**G)
def head(vb): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Divi"><title>Divi</title>'
def write(n, s): open(os.path.join(OUT, n), 'w').write(s + '\n')
P, I, A = place(pcs, info, ROUND, 128, 128, fit=FIT, opt=OPT)
md = d_of(P, I, ROUND)
write('mark.svg', head('0 0 256 256') + f'<path fill="{SAGE}" d="{md}"/></svg>')
write('mark-mono.svg', head('0 0 256 256') + f'<path fill="{WHITE}" d="{md}"/></svg>')
APPGAP = float(os.environ.get('APPGAP', 15))
Ga = dict(G); Ga['gap'] = APPGAP
pcs_a, info_a = build(**Ga)
Pa, Ia, Aa = place(pcs_a, info_a, ROUND, 128, 128, R=RSAFE, opt=OPT)
write('app-icon.svg', head('0 0 256 256') + f'<rect width="256" height="256" fill="{CH}"/><path fill="{SAGE}" d="{d_of(Pa, Ia, ROUND)}"/></svg>')
# lockup
CAP = 100; stem = 157/714*CAP
s = stem*RATIO/(2*info['h'])
P0, I0, A0 = place(pcs, info, ROUND, 0, 0, opt=0)
P0, I0 = xform(P0, I0, s, 0, 0); A0 = [[(x*s, y*s) for x, y in Q] for Q in A0]
x0, y0, x1, y1 = bbox(A0); pad = 16
tx = pad - x0; ty = -CAP/2 - (y0+y1)/2 + DY
P0, I0 = xform(P0, I0, 1, tx, ty); A0 = [[(x+tx, y+ty) for x, y in Q] for Q in A0]
x0, y0, x1, y1 = bbox(A0)
wl = x1 + GAPC*CAP
wd, ww = wordmark_d(wl, 0, CAP)
top = min(y0, -CAP) - pad; bot = max(y1, 0) + pad; Wt = wl + ww + pad
vb = f'0 {f(top)} {f(Wt)} {f(bot-top)}'
ld = d_of(P0, I0, ROUND)
write('lockup.svg', head(vb) + f'<path fill="{SAGE}" d="{ld}"/><path fill="{CH}" d="{wd}"/></svg>')
write('lockup-reverse.svg', head(vb) + f'<path fill="{SAGE}" d="{ld}"/><path fill="{WHITE}" d="{wd}"/></svg>')
ar = [area(Q) for Q in A]; tot = sum(ar)
print('mark bbox', [round(v, 1) for v in bbox(A)], 'centroid', [round(v, 1) for v in centroid(A)])
print('shares %', [round(100*a/tot, 1) for a in ar])
print('app bbox', [round(v, 1) for v in bbox(Aa)], 'maxR', round(max(math.dist(p, (128, 128)) for Q in Aa for p in Q), 1), 'gap in app units', round(APPGAP*Ia['h']/info['h'], 2), 'stroke', round(2*Ia['h'], 1))
print('lockup vb', vb, 'check h', round(y1-y0, 1), 'stroke', round(2*I0['h'], 1), 'stem', round(stem, 1))
