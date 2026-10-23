import sys
sys.argv = ['x', '/dev/null']
from gen import *

def m1(name, **kw):
    p = dict(M1); p.update(kw)
    d, g = m1_outline(p)
    cx, cy = m1_divide_centre(g, p)
    open(f'r4-{name}.svg', 'w').write(svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{d}"/>{divide(cx, cy, p["t"], SAGE)}'))
    print(name, 'W', g['W'], 'x', g['xL'], g['xR'], 'maxr', round(g['maxr'], 1), 'tail', g['tailTip'])

def m2(name, **kw):
    p = dict(M2); p.update(kw)
    R, cx, cy = p['R'], p['cx'], p['cy']
    if 'rel' in p:
        p['tip'] = (cx + p['rel'][0] * R, cy + p['rel'][1] * R)
    L, Rr, g = m2_halves(p)
    open(f'r4-{name}.svg', 'w').write(svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{L}"/><path fill="{SAGE}" d="{Rr}"/>'))
    print(name, {k: (tuple(round(x, 1) for x in v) if isinstance(v, tuple) else round(v, 1)) for k, v in g.items()})

m1('1e-out45', teeth=5, td=12, tail=3, out=10, rc=24, body=100, top=62, t=12)
m1('1f-out45-r20', teeth=5, td=12, tail=3, out=12, rc=20, body=98, top=63, t=12.5)
m1('1g-out45-big', teeth=5, td=13, tail=3, out=12, rc=26, body=104, top=58, t=13)
m2('2d', tail='tri', R=78, g=17, cx=134, cy=118, rel=(-0.98, 1.12), a1=108, a2=150)
m2('2e', tail='tri', R=80, g=17, cx=133, cy=117, rel=(-0.96, 1.16), a1=112, a2=155)
m2('2f', tail='tri', R=80, g=17, cx=134, cy=118, rel=(-0.84, 1.18), a1=106, a2=145)
