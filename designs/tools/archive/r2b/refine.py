"""Large review sheet for concept variants (design space -> tile space)."""
import math
from geo import *
from concepts import place
import sheet as S

PHOTO = S.PHOTO


def tile_place(pieces, circles, k=0.84, cx=128, cy=116):
    return place(pieces, circles, k, cx, cy)


def render(variants, out_html):
    cells = []
    for name, pieces, circles in variants:
        P, Cs = tile_place(pieces, circles)
        light = S.body(P, Cs, 'light')
        tile = S.body(P, Cs, 'tile')
        mono = S.mono(P, Cs)
        rmax = max_radius([p for p, _ in P])
        cells.append(f'''<div class="c"><b>{name} — rmax {rmax:.1f}</b><div class="row">
          <div class="w">{S.sv(light, 220)}</div>
          <div class="col">{S.sv(tile, 120, CHARCOAL, '27px')}
            <div class="row">{S.sv(tile, 40, CHARCOAL, '50%')}{S.sv(tile, 32, CHARCOAL, '7px')}</div></div>
          <div class="col"><div class="tab l">{S.sv(tile, 16, CHARCOAL, '3px')}<span>Divi</span></div>
            <div class="tab d">{S.sv(tile, 16, CHARCOAL, '3px')}<span>Divi</span></div>
            <div class="p">{S.sv(mono, 64)}</div><div class="k">{S.sv(tile, 64)}</div></div>
        </div></div>''')
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
    body{{margin:0;background:#f2f3f1;font:600 13px Helvetica Neue,Arial;color:#333}}
    .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;padding:14px;width:1370px}}
    .c{{background:#fff;border-radius:10px;padding:12px;display:grid;gap:8px}}
    .row{{display:flex;gap:12px;align-items:center}}
    .col{{display:grid;gap:10px;justify-items:start}}
    .w{{background:#fafaf8;border:1px solid #e5e5e2;border-radius:8px}}
    .tab{{display:flex;gap:6px;align-items:center;padding:6px 10px;border-radius:6px;font-weight:500;width:110px}}
    .tab.l{{background:#fff;box-shadow:0 0 0 1px #ddd}} .tab.d{{background:#35363a;color:#e8eaed}}
    .p{{background:linear-gradient(rgba(11,11,11,.5),rgba(11,11,11,.42)),url({PHOTO}) center/cover;border-radius:8px;padding:12px}}
    .k{{background:#2d2d2d;border-radius:8px;padding:12px}}
    </style></head><body><div class="grid">{''.join(cells)}</div></body></html>'''
    open(out_html, 'w').write(html)
