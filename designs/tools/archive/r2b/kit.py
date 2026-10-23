"""Sketch kit: bubble + knife cuts -> coloured pieces."""
import math
from geo import *


def unit(a):
    r = math.radians(a)
    return (math.cos(r), math.sin(r))


def along(p, u, t):
    return (p[0] + u[0] * t, p[1] + u[1] * t)


def ray(J, a, L=260):
    return along(J, unit(a), L)


def offset_line(p0, p1, d):
    """Line p0->p1 shifted by d along its left-hand screen normal (negative x side for downward lines)."""
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy)
    n = (dy / L, -dx / L)
    if n[0] > 0:
        n = (-n[0], -n[1])
    return (p0[0] + n[0] * d, p0[1] + n[1] * d), (p1[0] + n[0] * d, p1[1] + n[1] * d)


def line_y(p0, p1, y):
    t = (y - p0[1]) / (p1[1] - p0[1])
    return (p0[0] + (p1[0] - p0[0]) * t, y)


def bubble(C, tail=None):
    """tail: ('cut', p0, p1, g, tip_y, a_out) - tail inner edge along the left edge of the cut p0->p1
             ('free', a1, a2, tip)            - triangle from circle angles a1,a2 to tip"""
    if not tail:
        return [C.pts()], None
    if tail[0] == 'cut':
        _, p0, p1, g, tip_y, a_out = tail
        q0, q1 = offset_line(p0, p1, g / 2)
        T = line_y(q0, q1, tip_y)
        Q = line_y(q0, q1, C.cy)
        return union(C.pts(), [C.at(a_out), T, Q]), T
    if tail[0] == 'free':
        _, a1, a2, T = tail
        return union(C.pts(), [C.at(a1), T, C.at(a2), (C.cx, C.cy)]), T


def build(C, cuts, g, tail=None, roles=None, nudge=None, ends='butt'):
    """cuts: list of polylines. roles: list of (test_point, role). nudge: {role_index: (dx,dy)}"""
    shape, T = bubble(C, tail)
    knives = [stroke(c, g, ends) for c in cuts]
    pieces = cut(shape, knives)
    out = []
    if roles:
        for pt, r in roles:
            i = which(pieces, pt)
            out.append((pieces[i], r))
        if len(out) != len(pieces):
            # unassigned pieces default to 'a'
            used = {id(p) for p, _ in out}
            out += [(p, 'a') for p in pieces if id(p) not in used]
    else:
        pieces.sort(key=lambda p: -abs(area(p)))
        out = [(p, 'abcd'[i % 4]) for i, p in enumerate(pieces)]
    if nudge:
        out = [(move(p, *nudge.get(k, (0, 0))), r) for k, (p, r) in enumerate(out)]
    return out
