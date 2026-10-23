import os, base64
C = dict(char='#2D2D2D', sage='#6FAF8E', sagel='#8CC4A5', saged='#3E7A5B', deep='#24382E', off='#FAFAF8', gray='#ECEBE8', white='#FFFFFF')
def svg(body, vb='0 0 256 256'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{body}</svg>'
def uri(s):
    return 'data:image/svg+xml;base64,' + base64.b64encode(s.encode()).decode()
def tile(body, bg=C['char']):
    return svg(f'<rect width="256" height="256" fill="{bg}"/>' + body)
def sheet(items, path, cols=None):
    # items: list of (label, mark_svg, tile_svg)
    rows = []
    for label, mark, t in items:
        rows.append(f'''<div class="it"><div class="lab">{label}</div><div class="r">
<div class="sw w"><img src="{uri(mark)}" width="170"></div>
<img src="{uri(t)}" width="170" style="border-radius:38px">
<div class="sm"><img src="{uri(t)}" width="64" class="c"><img src="{uri(t)}" width="40" class="c"><img src="{uri(t)}" width="24" style="border-radius:5px"><img src="{uri(t)}" width="16" style="border-radius:3px">
<div class="dk"><img src="{uri(t)}" width="16" style="border-radius:3px"></div></div>
</div></div>''')
    html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
body{{margin:0;background:#f2f3f1;font:600 13px Helvetica Neue,Arial;color:#333}}
.g{{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;padding:18px}}
.it{{background:#fff;border-radius:12px;padding:12px}}
.lab{{margin-bottom:8px}}
.r{{display:flex;gap:14px;align-items:center}}
.sw{{width:190px;height:190px;display:grid;place-items:center;border-radius:12px}}
.w{{background:#fafaf8;border:1px solid #e3e3e0}}
.sm{{display:flex;gap:10px;align-items:center;flex-wrap:wrap;width:200px}}
.c{{border-radius:50%}}
.dk{{background:#35363a;padding:6px;border-radius:4px;display:flex}}
</style></head><body><div class="g">{''.join(rows)}</div></body></html>'''
    open(path, 'w').write(html)
