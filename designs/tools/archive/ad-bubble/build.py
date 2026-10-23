"""Art-direction build for the split-bubble 'no through-cut' family.

Geometry lives in forms.py (design space: bubble r=100 at the origin, y down).
Usage: python3 build.py <root> <cid> [<cid> ...]   (root = designs/logos or a scratch dir)
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/divide-build')
import forms  # noqa: E402
from geo import *  # noqa: E402,F401
from concepts import place  # noqa: E402
from wordmark import word_path  # noqa: E402

CONCEPTS = {}


def concept(cid, geom, light, dark, k=0.82, order='abcd'):
    CONCEPTS[cid] = dict(geom=geom, light=light, dark=dark, k=k, order=order)


TILE_CY = 130.0      # the tail hangs below: centre the whole shape's bbox a touch low
MARK_H = 238.0       # standalone mark: shape height of 256
SITE_H = 246.0


def placed(pieces, circles, k, cx, cy):
    """Scale by k; centre vertically on the bbox, horizontally halfway between the bbox centre
    and the centre of mass (so a heavy piece does not pull the mark off-centre)."""
    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    A = sum(abs(area(p)) for p, _ in pieces)
    mx = sum(centroid(p)[0] * abs(area(p)) for p, _ in pieces) / A
    ox = ((x0 + x1) / 2 + mx) / 2
    return place(pieces, circles, k, cx - k * ox, cy - k * (y0 + y1) / 2)


def paths(P, Cs, cols, order):
    out = []
    for role in order:
        d = ''.join(to_path(p, Cs) for p, r in P if r == role)
        if d:
            out.append(f'<path fill="{cols[role]}" d="{d}"/>')
    return ''.join(out)


def mono(P, Cs, col=WHITE):
    return f'<path fill="{col}" d="{"".join(to_path(p, Cs) for p, _ in P)}"/>'


def lockup(pieces, circles, cols, order, word_col, size=1.3, gap=0.5):
    """Mark beside DIVI: the bubble's diameter is `size` x cap height, centred on the caps;
    the tail hangs below the baseline like a descender."""
    C = 100.0
    pad = 20.0
    k = C * size / 200.0
    ty = C / 2
    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    tx = -k * x0
    P, Cs = place(pieces, circles, k, tx, ty)
    mx1 = k * (x1 - x0)
    word, ww = word_path('DIVI', cap_px=C, x=mx1 + gap * C, baseline=C)
    top = min(0.0, ty + k * y0) - pad
    bottom = max(C, ty + k * y1) + pad
    width = mx1 + gap * C + ww + 2 * pad
    vb = f'{f(-pad)} {f(top)} {f(width)} {f(bottom - top)}'
    return svg(paths(P, Cs, cols, order) + f'<path fill="{word_col}" d="{word}"/>', vb)


def build(root, cid):
    spec = CONCEPTS[cid]
    pieces, circles, _ = spec['geom']()
    L, Dk, order = spec['light'], spec['dark'], spec['order']
    d = os.path.join(root, cid)
    os.makedirs(d, exist_ok=True)

    def write(name, s):
        with open(os.path.join(d, name), 'w') as fh:
            fh.write(s)

    P, Cs = placed(pieces, circles, spec['k'], 128, TILE_CY)
    rmax = max_radius([p for p, _ in P])
    write('app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/>' + paths(P, Cs, Dk, order)))

    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    km = min(MARK_H / (y1 - y0), MARK_H / (x1 - x0))
    P, Cs = placed(pieces, circles, km, 128, 128)
    write('mark.svg', svg(paths(P, Cs, L, order)))
    write('mark-mono.svg', svg(mono(P, Cs)))

    ks = min(SITE_H / (y1 - y0), SITE_H / (x1 - x0))
    P, Cs = placed(pieces, circles, ks, 128, 128)
    write('site-icon.svg', svg(paths(P, Cs, Dk, order)))

    write('lockup.svg', lockup(pieces, circles, L, order, CHARCOAL))
    write('lockup-reverse.svg', lockup(pieces, circles, Dk, order, WHITE))
    shares = sorted((abs(area(p)) for p, _ in pieces), reverse=True)
    print(cid, 'tile rmax %.1f' % rmax, 'shares', '/'.join('%.0f' % (100 * s / sum(shares)) for s in shares))


# ----------------------------------------------------------------------------- concepts
LIGHT3 = {'a': CHARCOAL, 'b': SAGE, 'd': SAGE_D}
DARK3 = {'a': OFFWHITE, 'b': SAGE, 'd': SAGE_L}

concept('bubble-4', lambda: forms.fork(roles=('a', 'b', 'd')), LIGHT3, DARK3)
concept('step-S18', lambda: forms.step2(y1=-14, y2=22, xs=10, g=20, roles=('b', 'a', 'd')), LIGHT3, DARK3, k=0.84)
concept('bubble-5', lambda: forms.step_inv(y1=-14, y2=20, xs=24, g=21, tipx=-24, a1=forms.a_for(-24), a2=130,
                                           roles=('a', 'b', 'd')), LIGHT3, DARK3, k=0.84)

if __name__ == '__main__':
    root = sys.argv[1]
    for cid in sys.argv[2:]:
        build(root, cid)
