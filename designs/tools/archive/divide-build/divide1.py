# divide-1 "Split D": a geometric D (Helvetica Bold proportions) cut through by the
# divide bar; each half keeps one dot of the ÷.
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from wordmark import word_path

OUT = '/Users/titus/repos/colognewebsite/designs/logos/divide-1'
os.makedirs(OUT, exist_ok=True)
SAGE, CHAR, WHITE, OFF = '#6FAF8E', '#2D2D2D', '#FFFFFF', '#FAFAF8'

# Proportions, all as fractions of the D's height H.
P = dict(
    wr=0.885,   # width / height  (Helvetica Neue Bold D = 0.885)
    rc=0.085,   # stem corner radius
    g=0.115,    # the cut (divide bar) thickness
    d=0.17,     # dot diameter
    dx=0.465,   # dot centre, fraction of width from the stem edge
    dy=0.47,    # dot centre, fraction of half-height measured from the cut
    shift=0.022 # optical shift right (fraction of H): the round side reads lighter
)

def f(v): return ('%.2f' % v).rstrip('0').rstrip('.')

def split_d(cx, cy, H, p=P):
    r = H / 2; W = p['wr'] * H; a = W - r
    x0 = cx - W / 2 + p['shift'] * H; y0 = cy - r; xs = x0 + a
    rc = p['rc'] * H; g = p['g'] * H; d = p['d'] * H
    yt, yb = cy - g / 2, cy + g / 2
    xb = xs + math.sqrt(r * r - (g / 2) ** 2)
    top = (f"M{f(x0)} {f(yt)}V{f(y0+rc)}A{f(rc)} {f(rc)} 0 0 1 {f(x0+rc)} {f(y0)}"
           f"H{f(xs)}A{f(r)} {f(r)} 0 0 1 {f(xb)} {f(yt)}Z")
    bot = (f"M{f(x0)} {f(yb)}H{f(xb)}A{f(r)} {f(r)} 0 0 1 {f(xs)} {f(y0+H)}"
           f"H{f(x0+rc)}A{f(rc)} {f(rc)} 0 0 1 {f(x0)} {f(y0+H-rc)}Z")
    hh = r - g / 2
    dxp = x0 + p['dx'] * W
    holes = ''
    for yy in (yt - p['dy'] * hh, yb + p['dy'] * hh):
        rr = d / 2
        holes += f"M{f(dxp-rr)} {f(yy)}a{f(rr)} {f(rr)} 0 1 0 {f(2*rr)} 0a{f(rr)} {f(rr)} 0 1 0 {f(-2*rr)} 0Z"
    return top + bot + holes, dict(x0=x0, y0=y0, W=W, H=H)

def svg(body, vb='0 0 256 256', title='Divi'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><title>{title}</title>{body}</svg>\n'

def write(name, s):
    open(os.path.join(OUT, name), 'w').write(s)

def build(app_H=160, mark_H=196, tile=CHAR, app_fill=SAGE, site='mono'):
    d, _ = split_d(128, 128, mark_H)
    write('mark.svg', svg(f'<path fill="{SAGE}" fill-rule="evenodd" d="{d}"/>'))
    write('mark-mono.svg', svg(f'<path fill="{WHITE}" fill-rule="evenodd" d="{d}"/>'))
    d2, _ = split_d(128, 128, app_H)
    write('app-icon.svg', svg(f'<rect width="256" height="256" fill="{tile}"/><path fill="{app_fill}" fill-rule="evenodd" d="{d2}"/>'))
    if site == 'mono':
        d3, _ = split_d(128, 128, 214)
        write('site-icon.svg', svg(f'<path fill="{WHITE}" fill-rule="evenodd" d="{d3}"/>'))
    elif site == 'tile':
        p = os.path.join(OUT, 'site-icon.svg')
        if os.path.exists(p): os.remove(p)
    # Lockup: mark 1.12 x cap height, centred on the caps; gap 0.6 cap; DIVI tracked +0.12em.
    cap = 100.0; mk = 1.12
    md, info = split_d(0, 0, cap * mk)
    mx = -info['x0']; my = cap / 2
    gap = 0.6 * cap
    wd, ww = word_path('DIVI', cap_px=cap, x=info['W'] + gap, baseline=cap)
    total = info['W'] + gap + ww
    top = my - cap * mk / 2
    vb = f'0 {f(top)} {f(total)} {f(cap*mk)}'
    sym = f'<path fill="{SAGE}" fill-rule="evenodd" transform="translate({f(mx)} {f(my)})" d="{md}"/>'
    write('lockup.svg', svg(sym + f'<path fill="{CHAR}" d="{wd}"/>', vb=vb))
    write('lockup-reverse.svg', svg(sym + f'<path fill="{WHITE}" d="{wd}"/>', vb=vb))

if __name__ == '__main__':
    build()
    print('written', sorted(os.listdir(OUT)))
