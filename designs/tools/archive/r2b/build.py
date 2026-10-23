"""Builds bubble-4 (Fork), bubble-5 (Step) and bubble-6 (Drift) into designs/logos/.

All geometry comes from concepts.py (design space: bubble radius 100 at the
origin). This file only places it: tile, standalone mark, site icon, lockups.
Usage: python3 build.py [concept-id ...]
"""
import os
import sys

sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/divide-build')
from wordmark import word_path  # noqa: E402  (Helvetica Neue Bold outlines, +0.12em)
from geo import *  # noqa: E402,F401
import concepts  # noqa: E402

ROOT = '/Users/titus/repos/colognewebsite/designs/logos'

SCHEME = {
    'light': {'a': CHARCOAL, 'b': SAGE, 'c': SAGE_L},
    'dark': {'a': OFFWHITE, 'b': SAGE, 'c': SAGE_L},
}

CONCEPTS = {
    'bubble-4': dict(geom=concepts.fork, k=0.82),
    'bubble-5': dict(geom=concepts.step, k=0.84),
    'bubble-6': dict(geom=concepts.drift, k=0.835),
}

TILE = dict(k=0.82, cy=130.0)       # bubble radius 82 on the 256 tile
MARK = dict(h=238.0, cy=128.0)      # standalone mark: shape height 238 of 256
SITE = dict(h=246.0, cy=128.0)


def placed(pieces, circles, k, cx, cy):
    """Scale by k and centre on (cx, cy): vertically by the bounding box (the tail
    hangs below the bubble), horizontally halfway between the bounding box and the
    ink's centre of mass, so a heavy speaking piece does not pull the mark off-centre."""
    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    A = sum(abs(area(p)) for p, _ in pieces)
    mx = sum(centroid(p)[0] * abs(area(p)) for p, _ in pieces) / A
    ox = ((x0 + x1) / 2 + mx) / 2
    tx, ty = cx - k * ox, cy - k * (y0 + y1) / 2
    return concepts.place(pieces, circles, k, tx, ty), (tx, ty)


def paths(P, Cs, scheme):
    cols = SCHEME[scheme]
    # one path per colour, drawn in a fixed order
    out = []
    for role in 'abc':
        d = ''.join(to_path(p, Cs) for p, r in P if r == role)
        if d:
            out.append(f'<path fill="{cols[role]}" d="{d}"/>')
    return ''.join(out)


def mono(P, Cs, col=WHITE):
    return f'<path fill="{col}" d="{"".join(to_path(p, Cs) for p, _ in P)}"/>'


def write(cid, name, s):
    d = os.path.join(ROOT, cid)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, name), 'w') as fh:
        fh.write(s)


def lockup(cid, pieces, circles, body_top, body_bottom, scheme, word_col, size=1.3, gap=0.52):
    """Mark beside DIVI. The bubble's circle is `size` x cap height, centred on the
    caps; the tail hangs below the baseline like a descender."""
    C = 100.0
    pad = 20.0
    k = C * size / (body_bottom - body_top)
    cap_top = 0.0
    ty = cap_top + C / 2 - k * (body_top + body_bottom) / 2
    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    tx = -k * x0
    (P, Cs) = concepts.place(pieces, circles, k, tx, ty)
    mx1 = k * (x1 - x0)
    word, ww = word_path('DIVI', cap_px=C, x=mx1 + gap * C, baseline=C)
    top = min(cap_top, ty + k * y0) - pad
    bottom = max(C, ty + k * y1) + pad
    width = mx1 + gap * C + ww + 2 * pad
    vb = f'{f(-pad)} {f(top)} {f(width)} {f(bottom - top)}'
    return svg(paths(P, Cs, scheme) + f'<path fill="{word_col}" d="{word}"/>', vb)


def build(cid):
    spec = CONCEPTS[cid]
    pieces, circles, info = spec['geom']()

    (P, Cs), _ = placed(pieces, circles, spec.get('k', TILE['k']), 128, TILE['cy'])
    rmax = max_radius([p for p, _ in P])
    write(cid, 'app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/>' + paths(P, Cs, 'dark')))

    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    km = min(MARK['h'] / (y1 - y0), 238.0 / (x1 - x0))
    (P, Cs), _ = placed(pieces, circles, km, 128, MARK['cy'])
    write(cid, 'mark.svg', svg(paths(P, Cs, 'light')))
    write(cid, 'mark-mono.svg', svg(mono(P, Cs)))

    ks = min(SITE['h'] / (y1 - y0), 246.0 / (x1 - x0))
    (P, Cs), _ = placed(pieces, circles, ks, 128, SITE['cy'])
    write(cid, 'site-icon.svg', svg(paths(P, Cs, 'dark')))

    write(cid, 'lockup.svg', lockup(cid, pieces, circles, -100, 100, 'light', CHARCOAL))
    write(cid, 'lockup-reverse.svg', lockup(cid, pieces, circles, -100, 100, 'dark', WHITE))
    print(cid, 'tile rmax %.1f' % rmax, 'mark k %.3f' % km)


if __name__ == '__main__':
    for cid in (sys.argv[1:] or CONCEPTS):
        build(cid)
