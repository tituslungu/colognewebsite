import math, os, sys
from poly import *
from check2 import *
from wordmark import wordmark_d
OUT = '/Users/titus/repos/colognewebsite/designs/logos/wild-1'
os.makedirs(OUT, exist_ok=True)
CH, SAGE, WHITE = '#2D2D2D', '#6FAF8E', '#FFFFFF'
P = dict(W=46, short=98, long_=166, d1=28, d2=34, gap=16, a_short=40, a_long=52)
for a in sys.argv[1:]:
    k, v = a.split('='); P[k] = float(v)
_, pieces = split_check(**P)
def head(vb, label='Divi'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{label}"><title>{label}</title>'
def paths(pcs, col):
    return f'<path fill="{col}" d="' + ''.join(path(p) for p in pcs) + '"/>'
def write(name, s):
    open(os.path.join(OUT, name), 'w').write(s + '\n')
OPT = 0.35
SITE = float(os.environ.get('SITE', 1.18))
# mark: fill the 256 box with ~24 padding
m = place(pieces, 128, 128, 1.0, OPT)
x0, y0, x1, y1 = bbox(m)
sc = min(208/(x1-x0), 208/(y1-y0))
m = place(pieces, 128, 128, sc, OPT)
write('mark.svg', head('0 0 256 256') + paths(m, SAGE) + '</svg>')
write('mark-mono.svg', head('0 0 256 256') + paths(m, WHITE) + '</svg>')
# app icon: keep inside a circle of radius R_SAFE about the tile centre
R_SAFE = float(os.environ.get('RSAFE', 96))
a = place(pieces, 128, 128, 1.0, OPT); r = max_radius(a)
a = place(pieces, 128, 128, R_SAFE/r, OPT)
write('app-icon.svg', head('0 0 256 256') + f'<rect width="256" height="256" fill="{CH}"/>' + paths(a, SAGE) + '</svg>')
# site icon on the photo band: sage mark, no tile (same geometry as the mark, a touch smaller so it optically matches a 44px tile)
write('site-icon.svg', head('0 0 256 256') + paths(place(pieces, 128, 128, sc*SITE, OPT), WHITE) + '</svg>')
# lockup: cap height 100
CAP = 100
raw = place(pieces, 0, 0, 1.0, 0)  # bbox-centred at origin
bx0, by0, bx1, by1 = bbox(raw)
s = (CAP*1.16)/(by1-by0)
L = place(pieces, 0, 0, s, 0)
bx0, by0, bx1, by1 = bbox(L)
pad = 14
# vertical: centre the check's box on the cap middle, nudged down a little (mass sits low)
base = pad + CAP + (by1-by0 - CAP)/2 + 2
mx = pad - bx0; my = base - CAP/2 + 2
L = [[(x+mx, y+my) for x, y in Pp] for Pp in L]
bx0, by0, bx1, by1 = bbox(L)
gap = CAP*0.36
wd, ww = wordmark_d(bx1 + gap, base, CAP)
W_ = bx1 + gap + ww + pad; H_ = max(by1, base) + pad
top = min(by0, base-CAP) - pad
vb = f'0 {f(top)} {f(W_)} {f(H_-top)}'
write('lockup.svg', head(vb) + paths(L, SAGE) + f'<path fill="{CH}" d="{wd}"/></svg>')
write('lockup-reverse.svg', head(vb) + paths(L, SAGE) + f'<path fill="{WHITE}" d="{wd}"/></svg>')
print('areas', [round(area(p)) for p in m], 'mark bbox', [round(v) for v in bbox(m)], 'app maxR', round(max_radius(a)), 'lockup vb', vb)
