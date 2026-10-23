"""The three round-2 'no through-cut' split-bubble concepts, in design space:
bubble circle centred on the origin, radius 100 (y down). Each geometry function
returns (pieces, circles, info) with pieces = [(polygon, role)]; role 'a' is the
base colour (charcoal / off-white), 'b' sage, 'c' the third tone.
"""
import math
from geo import *
from kit import unit, along, ray

O = Circle(0, 0, 100)


def tail_poly(p0, u, g, tip_y, a_out, side=-1):
    """Tail whose inner edge runs along the left (side=-1) edge of a gap whose centre line
    passes through p0 with direction u; tip at height tip_y; outer edge leaves the
    circle at angle a_out."""
    n = (u[1], -u[0])
    if (n[0] > 0) == (side < 0):
        n = (-n[0], -n[1])
    q = (p0[0] + n[0] * g / 2, p0[1] + n[1] * g / 2)
    t = (tip_y - q[1]) / u[1]
    T = (q[0] + u[0] * t, tip_y)
    Q = (q[0] - u[0] * 40, q[1] - u[1] * 40)
    return [O.at(a_out), T, Q], T


# --------------------------------------------------------------- bubble-4: Fork
# One cut rises from the tail on a diagonal and forks at J: one branch straight up,
# one straight across. Three shares of three sizes; the cuts run in three
# directions (diagonal, vertical, horizontal) and never cross the whole bubble.
FORK = dict(jx=22.0, jy=-18.0, stem=110.0, g=21.0, tip=124.0, a_out=126.0)


def fork(p=FORK):
    J = (p['jx'], p['jy'])
    g = p['g']
    us = unit(p['stem'])
    tri, T = tail_poly(J, us, g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([ray(J, p['stem'], 400), J, ray(J, -90, 400)], g),
            stroke([J, ray(J, 0, 400)], g),
            stroke([ray(J, p['stem'], 400), J, ray(J, 0, 400)], g)]
    pcs = cut(shape, cuts)
    roles = []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx > J[0] and cy < J[1]:
            roles.append((poly, 'c'))       # the cap
        elif cy > J[1] and (cx - J[0]) * us[1] - (cy - J[1]) * us[0] > 0:
            roles.append((poly, 'b'))       # the share right of the stem
        else:
            roles.append((poly, 'a'))       # the speaking piece with the tail
    return roles, [O], dict(tip=T)


# --------------------------------------------------------------- bubble-5: Step
# The across-cut steps down as it crosses the bubble, and the joint below rises
# from the tail to the upper tread. Two shares underneath, of different heights;
# no cut runs straight through.
STEP = dict(y1=-30.0, y2=20.0, xs=16.0, g=21.0, tip=124.0, a_out=126.0, roles=('b', 'a', 'c'))


def step(p=STEP):
    g = p['g']
    xs, y1, y2 = p['xs'], p['y1'], p['y2']
    tri, T = tail_poly((xs, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(-300, y1), (xs, y1), (xs, 300)], g),
            stroke([(xs, y2), (300, y2)], g),
            stroke([(xs, y1), (xs, y2), (300, y2)], g)]
    pcs = cut(shape, cuts)
    roles = []
    for poly in pcs:
        cx, cy = centroid(poly)
        dome, speaker, share = p['roles']
        if cy < y1 or (cx > xs and cy < y2 and cy < 0):
            roles.append((poly, dome))
        elif cx < xs:
            roles.append((poly, speaker))
        else:
            roles.append((poly, share))
    return roles, [O], dict(tip=T)


# -------------------------------------------------------------- bubble-6: Drift
# Message-2's bubble with each half cracked once more on the same 15-degree
# slant, one crack high on the speaking side and one low on the sage side; then
# the upper pair of shares is nudged along the slant, the way a plate slides
# across a table. The cracks stay clean and even; the central split now steps
# twice, so no gap runs straight through. Four unequal shares; the speaking
# piece with the tail stays put.
_SLIP = 11.0
_V = (_SLIP * math.cos(math.radians(15)), -_SLIP * math.sin(math.radians(15)))
DRIFT = dict(x0=-6.0, yl=-40.0, yr=40.0, slant=15.0, g=19.0, tip=124.0, a_out=126.0,
             d=dict(TL=_V, TR=_V), roles=dict(TL='a', BL='a', TR='b', BR='b'))


def drift(p=DRIFT):
    g, x0, s = p['g'], p['x0'], p['slant']
    tri, T = tail_poly((x0, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    L, R = (x0, p['yl']), (x0, p['yr'])
    cuts = [stroke([(x0, -300), (x0, 300)], g),
            stroke([L, ray(L, 180 - s, 400)], g), stroke([R, ray(R, -s, 400)], g)]
    pcs = cut(shape, cuts)
    out, circles = [], []
    t = math.tan(math.radians(s))
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < x0:
            key = 'TL' if cy < p['yl'] + (x0 - cx) * t else 'BL'
        else:
            key = 'TR' if cy < p['yr'] - (cx - x0) * t else 'BR'
        dd = p['d'].get(key, 0.0)
        if isinstance(dd, tuple):
            v = dd
        else:
            n = math.hypot(cx, cy)
            v = (cx / n * dd, cy / n * dd)
        out.append((move(poly, *v), p['roles'][key]))
        circles.append(Circle(v[0], v[1], 100))
    return out, circles, dict(tip=T)


# ------------------------------------------------------------- bubble-6: Offset
# Message-2's central split, staggered: the joint that rises from the tail and the
# joint that drops from the top are offset sideways and meet a short cut from the
# left edge. The speaking half becomes two shares; the sage D stays whole but
# steps. No cut runs straight through.
OFFSET = dict(h=-20.0, xu=-18.0, xl=6.0, g=21.0, tip=124.0, a_out=126.0, roles=('a', 'a', 'b'))


def offset(p=OFFSET):
    g, h, xu, xl = p['g'], p['h'], p['xu'], p['xl']
    tri, T = tail_poly((xl, 0), (0, 1), g, p['tip'], p['a_out'])
    shape = union(O.pts(), tri)
    cuts = [stroke([(-300, h), (xu, h), (xu, -300)], g),
            stroke([(-300, h), (xl, h), (xl, 300)], g),
            stroke([(xu, -300), (xu, h), (xl, h), (xl, 300)], g)]
    pcs = cut(shape, cuts)
    cap, speaker, d = p['roles']
    out = []
    for poly in pcs:
        cx, cy = centroid(poly)
        if cx < min(xu, xl) and cy < h:
            out.append((poly, cap))
        elif cx < xl and cy > h:
            out.append((poly, speaker))
        else:
            out.append((poly, d))
    return out, [O], dict(tip=T)


def place(pieces, circles, k, tx, ty):
    return ([(xform(p, k, tx, ty), r) for p, r in pieces], [c.moved(k, tx, ty) for c in circles])
