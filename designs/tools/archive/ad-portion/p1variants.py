import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from p1geo import build, svg

OUT = os.path.join(os.path.dirname(__file__), 'proto')
CH, SAGE, SAGE_L, OFF, WHITE = '#2D2D2D', '#6FAF8E', '#8CC4A5', '#FAFAF8', '#FFFFFF'


def scaled(P, s, ox, oy, nx, ny, **over):
    """Scale P about (ox, oy) by s and move that point to (nx, ny)."""
    Q = dict(P)
    tx = lambda x: nx + (x - ox) * s
    ty = lambda y: ny + (y - oy) * s
    Q['cx'] = tx(P['cx']); Q['cy'] = ty(P['cy'])
    Q['x0'] = tx(P['x0']); Q['x1'] = tx(P['x1'])
    for k in ('R', 'g', 'rf', 'rq', 'rt', 'tail_len'):
        Q[k] = P[k] * s
    Q.update(over)
    return Q


def emit(name, P, app_s=0.84, app_gap=None, site_s=1.0):
    d = os.path.join(OUT, name); os.makedirs(d, exist_ok=True)
    g = build(P)
    open(os.path.join(d, 'mark.svg'), 'w').write(svg(g, [CH, CH, SAGE]))
    open(os.path.join(d, 'mark-mono.svg'), 'w').write(svg(g, [WHITE, WHITE, WHITE]))
    A = scaled(P, app_s, 128, 128, 128, 128)
    if app_gap: A['g'] = app_gap
    ga = build(A)
    open(os.path.join(d, 'app-icon.svg'), 'w').write(svg(ga, [OFF, OFF, SAGE], tile=CH))
    S = scaled(P, site_s, 128, 128, 128, 128)
    gs = build(S)
    open(os.path.join(d, 'site-icon.svg'), 'w').write(svg(gs, [WHITE, WHITE, SAGE_L]))
    md = ga['maxdist']((128, 128))
    print(name, 'areas', g['areas'], 'app maxdist from tile centre %.1f (margin %.1f)' % (md, 128 - md), 'tip', [round(x, 1) for x in g['ext']['T']])


if __name__ == '__main__':
    base = dict(cx=130, cy=116, R=96, a0=14, x0=96, a1=4, x1=152, g=16, rf=5, tail_len=34, qdeg=106, rq=7, rt=3.5)
    V = {
        'q1-base': {},
        'q1-angles18-2': dict(a0=18, a1=2, x0=98),
        'q1-angles20-6': dict(a0=20, a1=6, x0=98, x1=154),
        'q1-shorttail': dict(tail_len=26, qdeg=100),
        'q1-longtail': dict(tail_len=44, qdeg=108),
        'q1-gap13': dict(g=13),
    }
    for k, o in V.items():
        P = dict(base); P.update(o)
        emit(k, P)
