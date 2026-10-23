import math, os, sys, json
from poly import *
from tally import *
from wordmark import wordmark_d
OUT = os.environ.get('OUT', '/Users/titus/repos/colognewebsite/designs/logos/wild-2')
os.makedirs(OUT, exist_ok=True)
CH, SAGE, WHITE = '#2D2D2D', '#6FAF8E', '#FFFFFF'
T = dict(w=20, g=15, h=112, sw=17, ang=29.5, knock=5.5, over=6)
R = 104
for a in sys.argv[1:]:
    k, v = a.split('='); 
    if k == 'R': R = float(v)
    else: T[k] = float(v)
def head(vb, label='Divi'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{label}"><title>{label}</title>'
def circ(cx, cy, r, ccw=False):
    sw = 0 if ccw else 1
    return f'M{f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 {sw} {f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 {sw} {f(cx-r)} {f(cy)}Z'
def xf(polys, s, tx, ty, ox=128, oy=128):
    return [[((x-ox)*s+tx, (y-oy)*s+ty) for x, y in P] for P in polys]
def tab(cx, cy, s, disc, ink):
    """Coaster of radius R*s centred at (cx,cy), tally drawn in `ink`."""
    pcs, sl = tally(**T)
    allp = xf(pcs + [sl], s, cx, cy)
    return f'<path fill="{disc}" d="{circ(cx, cy, R*s)}"/><path fill="{ink}" d="' + ''.join(path(P) for P in allp) + '"/>'
def tab_mono(cx, cy, s, col):
    pcs, sl = tally(**T)
    allp = xf(pcs + [sl], s, cx, cy)
    # holes: evenodd
    return f'<path fill="{col}" fill-rule="evenodd" d="{circ(cx, cy, R*s)}' + ''.join(path(P) for P in allp) + '"/>'
def write(name, s): open(os.path.join(OUT, name), 'w').write(s + '\n')
write('mark.svg', head('0 0 256 256') + tab(128, 128, 1, SAGE, CH) + '</svg>')
write('mark-mono.svg', head('0 0 256 256') + tab_mono(128, 128, 1, WHITE) + '</svg>')
APP = os.environ.get('APP', 'full')
if APP == 'disc':
    s = 100/R
    write('app-icon.svg', head('0 0 256 256') + f'<rect width="256" height="256" fill="{CH}"/>' + tab(128, 128, s, SAGE, CH) + '</svg>')
else:
    pcs, sl = tally(**T); s = float(os.environ.get('APPS', 1.2))
    write('app-icon.svg', head('0 0 256 256') + f'<rect width="256" height="256" fill="{SAGE}"/><path fill="{CH}" d="' + ''.join(path(P) for P in xf(pcs+[sl], s, 128, 128)) + '"/></svg>')
write('site-icon.svg', head('0 0 256 256') + tab(128, 128, 1.2, SAGE, CH) + '</svg>')
# lockup
CAP = 100; pad = 14
D = CAP*1.36; s = D/(2*R)
cy = pad + (D - CAP)/2 + CAP/2 + (D-CAP)/2 * 0  # disc centred on cap middle
top_of_disc = pad
cy = top_of_disc + D/2
base = cy + CAP/2
cx = pad + D/2
gap = CAP*0.42
wd, ww = wordmark_d(cx + D/2 + gap, base, CAP)
Wd = cx + D/2 + gap + ww + pad; Hd = D + 2*pad
vb = f'0 0 {f(Wd)} {f(Hd)}'
write('lockup.svg', head(vb) + tab(cx, cy, s, SAGE, CH) + f'<path fill="{CH}" d="{wd}"/></svg>')
write('lockup-reverse.svg', head(vb) + tab(cx, cy, s, SAGE, CH) + f'<path fill="{WHITE}" d="{wd}"/></svg>')
pcs, sl = tally(**T)
print('pieces', len(pcs), 'areas', sorted(round(area(P)) for P in pcs), 'lockup', vb)
