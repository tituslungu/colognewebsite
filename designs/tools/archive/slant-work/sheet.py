import sys, json
from geo import *
COL = {'white': {'table': '#6FAF8E', 'diner': '#2D2D2D', 'bg': '#FAFAF8'},
       'tile': {'table': '#6FAF8E', 'diner': '#FAFAF8', 'bg': '#2D2D2D'},
       'mono': {'table': '#FFFFFF', 'diner': '#FFFFFF', 'bg': '#2D2D2D'}}
def render(parts, mode, tilebg=True, scale=1.0):
    c = COL[mode]
    body = ''.join(path(d, c.get(role, role)) for d, role in parts)
    if scale != 1.0:
        body = f'<g transform="translate(128 128) scale({scale}) translate(-128 -128)">{body}</g>'
    return svg(body, bg=c['bg'] if tilebg else None)
def sheet(sketches, out, tile_scale=0.78):
    rows = []
    for name, parts in sketches:
        cells = []
        cells.append(f'<div class="c"><div class="big">{render(parts, "white")}</div></div>')
        cells.append(f'<div class="c"><div class="big round">{render(parts, "tile", scale=tile_scale)}</div></div>')
        cells.append(f'<div class="c"><div class="big">{render(parts, "mono")}</div></div>')
        cells.append(f'<div class="c"><div class="s40 round">{render(parts, "tile", scale=tile_scale)}</div><div class="s40 round">{render(parts, "white", scale=tile_scale)}</div></div>')
        cells.append(f'<div class="c"><div class="s16">{render(parts, "tile", scale=tile_scale)}</div><div class="s16">{render(parts, "white", scale=tile_scale)}</div><div class="s32">{render(parts, "tile", scale=tile_scale)}</div></div>')
        rows.append(f'<div class="row"><div class="n">{name}</div>{"".join(cells)}</div>')
    html = '''<!doctype html><meta charset=utf-8><style>body{margin:0;padding:16px;background:#f2f3f1;font:600 13px Helvetica}
    .row{display:flex;gap:14px;align-items:center;margin-bottom:12px}.n{width:120px}
    .c{display:flex;gap:10px;align-items:center}.big svg{width:150px;height:150px;display:block}
    .round svg{border-radius:50%}.s40 svg{width:40px;height:40px;display:block}.s16 svg{width:16px;height:16px;display:block;border-radius:3px}
    .s32 svg{width:32px;height:32px;display:block;border-radius:6px}</style>''' + ''.join(rows)
    open(out, 'w').write(html)
