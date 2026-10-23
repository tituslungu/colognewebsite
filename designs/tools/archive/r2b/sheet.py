"""Contact sheet for sketch variants: each variant is (name, pieces, circles)
where pieces = [(poly, role)], role in 'a' (base), 'b' (sage), 'c' (third)."""
import os
from geo import to_path, CHARCOAL, SAGE, SAGE_L, SAGE_D, OFFWHITE, WHITE, DEEP

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTO = 'file:///Users/titus/repos/colognewebsite/assets/img/table.jpg'

SCHEMES = {
    'light': {'a': CHARCOAL, 'b': SAGE, 'c': SAGE_L, 'd': CHARCOAL},
    'tile': {'a': OFFWHITE, 'b': SAGE, 'c': SAGE_L, 'd': OFFWHITE},
}


def body(pieces, circles, scheme, override=None):
    cols = dict(SCHEMES[scheme])
    if override:
        cols.update(override.get(scheme, {}))
    return ''.join(f'<path fill="{cols[r]}" d="{to_path(p, circles)}"/>' for p, r in pieces)


def mono(pieces, circles, col=WHITE):
    return f'<path fill="{col}" d="{"".join(to_path(p, circles) for p, _ in pieces)}"/>'


def sv(inner, size, bg=None, radius=0):
    rect = f'<rect width="256" height="256" fill="{bg}"/>' if bg else ''
    st = f'style="border-radius:{radius}"' if radius else ''
    return f'<svg {st} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="{size}" height="{size}">{rect}{inner}</svg>'


def write(variants, out_html, cols=None):
    cells = []
    for v in variants:
        name, pieces, circles = v[:3]
        ov = v[3] if len(v) > 3 else None
        light = body(pieces, circles, 'light', ov)
        tile = body(pieces, circles, 'tile', ov)
        m = mono(pieces, circles)
        cells.append(f'''<div class="c"><div class="row">
          <div class="w">{sv(light, 132)}</div>
          <div class="g">{sv(tile, 72, CHARCOAL, '16px')}{sv(tile, 40, CHARCOAL, '50%')}{sv(tile, 16, CHARCOAL, '3px')}
          <div class="tab">{sv(tile, 16, CHARCOAL, '3px')}</div></div>
          <div class="p">{sv(m, 56)}</div></div><b>{name}</b></div>''')
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
    body{{margin:0;background:#f2f3f1;font:600 13px Helvetica Neue,Arial;color:#333}}
    .grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:14px;width:1370px}}
    .c{{background:#fff;border-radius:10px;padding:10px;display:grid;gap:6px}}
    .row{{display:flex;gap:10px;align-items:center}}
    .w{{background:#fafaf8;border:1px solid #e5e5e2;border-radius:8px}}
    .g{{display:grid;gap:8px;justify-items:center;grid-template-columns:auto auto;align-items:center}}
    .tab{{background:#202124;padding:6px;border-radius:4px}}
    .p{{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url({PHOTO}) center/cover;border-radius:8px;padding:14px}}
    </style></head><body><div class="grid">{''.join(cells)}</div></body></html>'''
    with open(out_html, 'w') as fh:
        fh.write(html)
