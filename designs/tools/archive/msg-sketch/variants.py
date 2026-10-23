import sys, math
sys.argv = ['x', '/dev/null']
import gen
from gen import *

def m1(name, **kw):
    p = dict(M1); p.update(kw)
    d, g = m1_outline(p)
    cx, cy = m1_divide_centre(g, p)
    open(f'r3-{name}.svg', 'w').write(svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{d}"/>{divide(cx, cy, p["t"], SAGE)}'))
    print(name, 'W', g['W'], 'maxr', round(g['maxr'], 1), 'yT', g['yT'], 'yV', g['yV'])

def m2(name, **kw):
    p = dict(M2); p.update(kw)
    L, R, g = m2_halves(p)
    open(f'r3-{name}.svg', 'w').write(svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{L}"/><path fill="{SAGE}" d="{R}"/>'))
    print(name, g)

m1('1a-6teeth', teeth=6, td=11, tail=3, rc=24, body=96, top=66, t=12)
m1('1b-6teeth-r16', teeth=6, td=11, tail=3, rc=16, body=96, top=66, t=12)
m1('1c-5teeth-out', teeth=5, td=12, tail=3, rc=24, body=100, top=62, t=12, out=10, rise=0)
m1('1d-7teeth', teeth=7, td=9, tail=3.5, rc=26, body=92, top=70, t=11.5)
m2('2a-tail', tail='tri', R=82, g=17, cx=134, cy=121, tip=(54, 207), a1=104)
m2('2b-tail-short', tail='tri', R=84, g=17, cx=132, cy=122, tip=(58, 200), a1=110)
m2('2c-tail-steep', tail='tri', R=82, g=17, cx=134, cy=120, tip=(60, 210), a1=100)
