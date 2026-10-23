"""Art-direction review sheet: variants in design space (bubble r=100 at origin)."""
import math
import os
import subprocess
import sys

R2B = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b'
sys.path.insert(0, R2B)
from geo import *  # noqa
from concepts import place  # noqa

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTO = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg'

LIGHT = {'a': CHARCOAL, 'b': SAGE, 'c': SAGE_L, 'd': SAGE_D, 'w': OFFWHITE}
TILE = {'a': OFFWHITE, 'b': SAGE, 'c': SAGE_L, 'd': SAGE_D, 'w': OFFWHITE}


def body(P, Cs, cols):
    return ''.join(f'<path fill="{cols[r]}" d="{to_path(p, Cs)}"/>' for p, r in P)


def mono(P, Cs, col=WHITE):
    return f'<path fill="{col}" d="{"".join(to_path(p, Cs) for p, _ in P)}"/>'


def sv(inner, size, bg=None, radius=0):
    rect = f'<rect width="256" height="256" fill="{bg}"/>' if bg else ''
    st = f'style="border-radius:{radius}"' if radius else ''
    return f'<svg {st} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="{size}" height="{size}">{rect}{inner}</svg>'


def fit(pieces, circles, k=0.82, cy=130):
    x0, y0, x1, y1 = bbox([p for p, _ in pieces])
    A = sum(abs(area(p)) for p, _ in pieces)
    mx = sum(centroid(p)[0] * abs(area(p)) for p, _ in pieces) / A
    ox = ((x0 + x1) / 2 + mx) / 2
    return place(pieces, circles, k, 128 - k * ox, cy - k * (y0 + y1) / 2)


def render(variants, name, cols=2):
    cells = []
    for v in variants:
        title, pieces, circles = v[:3]
        opt = v[3] if len(v) > 3 else {}
        lc = dict(LIGHT, **opt.get('light', {}))
        tc = dict(TILE, **opt.get('tile', {}))
        P, Cs = fit(pieces, circles, opt.get('k', 0.82))
        Pm, Cm = fit(pieces, circles, 1.0, 128)
        rmax = max_radius([p for p, _ in P])
        shares = sorted((abs(area(p)) for p, _ in pieces), reverse=True)
        tot = sum(shares)
        sh = '/'.join(f'{100 * s / tot:.0f}' for s in shares)
        cells.append(f'''<div class="c"><b>{title} <i>rmax {rmax:.1f} | {sh}</i></b><div class="row">
          <div class="w">{sv(body(Pm, Cm, lc), 200)}</div>
          <div class="col">{sv(body(P, Cs, tc), 120, CHARCOAL, '27px')}
            <div class="row">{sv(body(P, Cs, tc), 40, CHARCOAL, '50%')}{sv(body(P, Cs, tc), 28, CHARCOAL, '6px')}{sv(body(Pm, Cm, lc), 28)}</div></div>
          <div class="col"><div class="tab l">{sv(body(P, Cs, tc), 16, CHARCOAL, '3px')}<span>Divi</span></div>
            <div class="tab d">{sv(body(P, Cs, tc), 16, CHARCOAL, '3px')}<span>Divi</span></div>
            <div class="row"><div class="p">{sv(mono(Pm, Cm), 56)}</div><div class="p">{sv(body(Pm, Cm, tc), 44)}</div></div>
            <div class="row"><div class="k">{sv(body(Pm, Cm, tc), 56)}</div><div class="wb">{sv(mono(Pm, Cm, CHARCOAL), 40)}</div></div></div>
        </div></div>''')
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
    body{{margin:0;background:#f2f3f1;font:600 13px Helvetica Neue,Arial;color:#333}}
    i{{font-weight:400;color:#888;font-style:normal}}
    .grid{{display:grid;grid-template-columns:repeat({cols},1fr);gap:12px;padding:12px;width:{690 * cols}px}}
    .c{{background:#fff;border-radius:10px;padding:10px;display:grid;gap:8px}}
    .row{{display:flex;gap:10px;align-items:center}}
    .col{{display:grid;gap:8px;justify-items:start}}
    .w{{background:#fafaf8;border:1px solid #e5e5e2;border-radius:8px}}
    .wb{{background:#fafaf8;border:1px solid #e5e5e2;border-radius:8px;padding:8px}}
    .tab{{display:flex;gap:6px;align-items:center;padding:6px 10px;border-radius:6px;font-weight:500;width:110px}}
    .tab.l{{background:#fff;box-shadow:0 0 0 1px #ddd}} .tab.d{{background:#35363a;color:#e8eaed}}
    .p{{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url({PHOTO}) center/cover;border-radius:8px;padding:10px}}
    .k{{background:#2d2d2d;border-radius:8px;padding:10px}}
    </style></head><body><div class="grid">{''.join(cells)}</div></body></html>'''
    out = os.path.join(HERE, name + '.html')
    open(out, 'w').write(html)
    png = os.path.join(HERE, name + '.png')
    subprocess.run(['node', os.path.join(R2B, 'shot.mjs'), out, png, str(690 * cols + 24)], check=True)
    return png
