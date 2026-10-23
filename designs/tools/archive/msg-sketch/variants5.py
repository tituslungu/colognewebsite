import sys
sys.argv = ['x', '/dev/null']
from gen import *
def m1(name, **kw):
    p = dict(M1); p.update(kw)
    d, g = m1_outline(p)
    cx, cy = m1_divide_centre(g, p)
    open(f'r5-{name}.svg', 'w').write(svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{d}"/>{divide(cx, cy, p["t"], SAGE)}'))
    print(name, round(g['maxr'], 1), g['bbox'])
def m2(name, **kw):
    p = dict(M2); p.update(kw)
    L, Rr, g = m2_halves(p)
    open(f'r5-{name}.svg', 'w').write(svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{L}"/><path fill="{SAGE}" d="{Rr}"/>'))
    print(name, round(g['maxr'], 1), g['bbox'])
m1('1-current')
m1('1-t14', t=14)
m1('1-tail35', tail=3.5, t=13.5, top=60)
m2('2-a110')
m2('2-a116', a1=116)
m2('2-a120-rel', a1=120, rel=(-0.95, 1.17))
