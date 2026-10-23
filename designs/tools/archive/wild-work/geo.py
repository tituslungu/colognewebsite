import math
f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
def unit(a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy); return (dx/L, dy/L), L
def capsule(p, q, w, cap_p='round', cap_q='round'):
    """Filled outline of a thick segment p->q, width w, each end round or flat (butt)."""
    (ux, uy), L = unit(p, q); nx, ny = -uy, ux; h = w/2
    a = (p[0]+nx*h, p[1]+ny*h); b = (q[0]+nx*h, q[1]+ny*h); c = (q[0]-nx*h, q[1]-ny*h); d = (p[0]-nx*h, p[1]-ny*h)
    s = f'M{f(a[0])} {f(a[1])}L{f(b[0])} {f(b[1])}'
    s += (f'A{f(h)} {f(h)} 0 0 0 {f(c[0])} {f(c[1])}' if cap_q=='round' else f'L{f(c[0])} {f(c[1])}')
    s += f'L{f(d[0])} {f(d[1])}'
    s += (f'A{f(h)} {f(h)} 0 0 0 {f(a[0])} {f(a[1])}' if cap_p=='round' else '')
    return s + 'Z'
def lerp(a, b, t): return (a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t)
def along(a, b, d):
    (ux, uy), L = unit(a, b); return (a[0]+ux*d, a[1]+uy*d)
