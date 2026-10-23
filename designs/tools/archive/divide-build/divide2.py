# divide-2 "Two Plates": the divide sign drawn as a table seen from above — two plates,
# each with its own order (the animation's sage dot and sage wave), and the bar that splits the bill.
import math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from wordmark import word_path

OUT = '/Users/titus/repos/colognewebsite/designs/logos/divide-2'
os.makedirs(OUT, exist_ok=True)
SAGE, CHAR, WHITE, OFF = '#6FAF8E', '#2D2D2D', '#FFFFFF', '#FAFAF8'
def f(v): return ('%.2f' % v).rstrip('0').rstrip('.')

# Proportions in the app-icon box (256). Everything derives from the plate radius R.
G = dict(R=39, s=64, bt=20, bl=164, dox=0.2, doy=0.12,
         rim=0.66, rimw=0.07,          # faint inner rim, as on the animation's plates
         dot=0.26,                     # top plate: a sage dot
         ww=0.80, wamp=0.15, wst=0.18) # bottom plate: a sage wave (two half-waves)

def geom(k=1.0, cx=128, cy=128, g=G):
    R = g['R']*k
    return dict(R=R, top=(cx, cy - g['s']*k), bot=(cx, cy + g['s']*k),
                bar=(cx - g['bl']*k/2, cy - g['bt']*k/2, g['bl']*k, g['bt']*k),
                rim_r=R*g['rim'], rim_w=R*g['rimw'], dot_r=R*g['dot'], dox=R*g['dox'], doy=R*g['doy'],
                ww=R*g['ww'], wamp=R*g['wamp'], wst=R*g['wst'])

def wave_d(x, y, w, amp):
    return f"M{f(x-w/2)} {f(y)}q{f(w/4)} {f(-2*amp)} {f(w/2)} 0t{f(w/2)} 0"

def bar_el(P, fill):
    bx, by, bl, bt = P['bar']
    return f'<rect x="{f(bx)}" y="{f(by)}" width="{f(bl)}" height="{f(bt)}" rx="{f(bt/2)}" fill="{fill}"/>'

def full_colour(P, plate=OFF, food=SAGE, bar=SAGE, rim=True):
    out = ''
    for (x, y) in (P['top'], P['bot']):
        out += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["R"])}" fill="{plate}"/>'
        if rim:
            out += (f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["rim_r"])}" fill="none" stroke="{CHAR}" '
                    f'stroke-opacity=".13" stroke-width="{f(P["rim_w"])}"/>')
    x, y = P['top']; out += f'<circle cx="{f(x+P["dox"])}" cy="{f(y+P["doy"])}" r="{f(P["dot_r"])}" fill="{food}"/>'
    x, y = P['bot']
    out += (f'<path d="{wave_d(x, y, P["ww"], P["wamp"])}" fill="none" stroke="{food}" '
            f'stroke-width="{f(P["wst"])}" stroke-linecap="round"/>')
    return out + bar_el(P, bar)

def one_colour(P, fill, uid):
    """Plates are solid discs with the food cut out; no rim (a rim cut-out reads as a target)."""
    (x1, y1), (x2, y2) = P['top'], P['bot']
    m = (f'<mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">'
         f'<rect width="256" height="256" fill="#fff"/>'
         f'<circle cx="{f(x1+P["dox"])}" cy="{f(y1+P["doy"])}" r="{f(P["dot_r"])}" fill="#000"/>'
         f'<path d="{wave_d(x2, y2, P["ww"], P["wamp"])}" fill="none" stroke="#000" stroke-width="{f(P["wst"])}" stroke-linecap="round"/></mask>')
    discs = ''.join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["R"])}"/>' for (x, y) in (P['top'], P['bot']))
    bx, by, bl, bt = P['bar']
    bar = f'<rect x="{f(bx)}" y="{f(by)}" width="{f(bl)}" height="{f(bt)}" rx="{f(bt/2)}"/>'
    return m + f'<g fill="{fill}"><g mask="url(#{uid})">{discs}</g>{bar}</g>'

def svg(body, vb='0 0 256 256', title='Divi'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><title>{title}</title>{body}</svg>\n'
def write(name, s): open(os.path.join(OUT, name), 'w').write(s)

def build(mark_k=1.06, site="mono"):
    Pm = geom(mark_k)
    write('mark.svg', svg(one_colour(Pm, SAGE, 'food')))
    write('mark-mono.svg', svg(one_colour(Pm, WHITE, 'food')))
    write('mark-colour.svg', svg(full_colour(Pm)))  # full-colour symbol for dark grounds
    write('app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHAR}"/>' + full_colour(geom(1.0))))
    p = os.path.join(OUT, 'site-icon.svg')
    if site == 'mono':
        write('site-icon.svg', svg(one_colour(geom(1.2), WHITE, 'food')))
    elif site == 'colour':
        write('site-icon.svg', svg(full_colour(geom(1.2))))
    elif os.path.exists(p): os.remove(p)
    # Lockup: symbol height = 1.3 x cap height, centred on the cap height.
    cap = 100.0
    k = 1.3 * cap / (2 * (G['s'] + G['R']))
    P = geom(k, cx=0, cy=0)
    sym_w = G['bl'] * k
    mx, my = sym_w / 2, cap / 2
    gap = 0.55 * cap
    wd, ww = word_path('DIVI', cap_px=cap, x=sym_w + gap, baseline=cap)
    top = my - (G['s'] + G['R']) * k
    vb = f'0 {f(top)} {f(sym_w + gap + ww)} {f(2*(G["s"]+G["R"])*k)}'
    def sym(fill):
        # re-use the one-colour geometry, translated
        inner = one_colour(P, fill, 'lk').replace('maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"', f'maskUnits="userSpaceOnUse" x="{f(-sym_w)}" y="{f(-cap)}" width="{f(2*sym_w)}" height="{f(2*cap)}"')
        inner = inner.replace('<rect width="256" height="256" fill="#fff"/>', f'<rect x="{f(-sym_w)}" y="{f(-cap)}" width="{f(2*sym_w)}" height="{f(2*cap)}" fill="#fff"/>')
        return f'<g transform="translate({f(mx)} {f(my)})">{inner}</g>'
    write('lockup.svg', svg(sym(SAGE) + f'<path fill="{CHAR}" d="{wd}"/>', vb=vb))
    write('lockup-reverse.svg', svg(sym(SAGE) + f'<path fill="{WHITE}" d="{wd}"/>', vb=vb))

if __name__ == '__main__':
    build(site=sys.argv[1] if len(sys.argv) > 1 else 'tile')
    print(sorted(os.listdir(OUT)))
