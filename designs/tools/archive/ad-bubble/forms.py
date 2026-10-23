"""Generalised geometry for the art-direction pass (design space: bubble r=100 at origin)."""
import math
import ad  # noqa  (sets sys.path)
from geo import *  # noqa
from kit import unit, along, ray  # noqa
from concepts import O, tail_poly  # noqa


def fork(jx=22.0, jy=-18.0, stem=110.0, up=-90.0, side=0.0, g=21.0, tip=124.0, a_out=126.0,
         branch_at=0.0, roles=('a', 'b', 'c')):
    """Cut rises from the tail along `stem` (pointing down from J), continues from J along `up`;
    a side branch leaves the up-branch `branch_at` units above J along `side`."""
    J = (jx, jy)
    us = unit(stem)
    tri, T = tail_poly(J, us, g, tip, a_out)
    shape = union(O.pts(), tri)
    J2 = ray(J, up, branch_at) if branch_at else J
    cuts = [stroke([ray(J, stem, 400), J, ray(J, up, 400)], g),
            stroke([J2, ray(J2, side, 400)], g)]
    if not branch_at:
        cuts.append(stroke([ray(J, stem, 400), J, ray(J, side, 400)], g))
    pcs = cut(shape, cuts)
    speaker, mid, cap = roles
    out = []
    uu = unit(up)
    usd = unit(side)
    for poly in pcs:
        cx, cy = centroid(poly)
        # left of the spine (stem+up) -> speaker
        if cy > J[1]:
            left = (cx - J[0]) * us[1] - (cy - J[1]) * us[0] < 0
        else:
            left = (cx - J[0]) * uu[1] - (cy - J[1]) * uu[0] > 0
        if left:
            out.append((poly, speaker))
        else:
            # above the side branch -> cap
            above = (cx - J2[0]) * usd[1] - (cy - J2[1]) * usd[0] > 0
            out.append((poly, cap if above else mid))
    return out, [O], dict(tip=T)


def step(y1=-30.0, y2=20.0, xs=16.0, g=21.0, tip=124.0, a_out=126.0, roles=('b', 'a', 'c')):
    tri, T = tail_poly((xs, 0), (0, 1), g, tip, a_out)
    shape = union(O.pts(), tri)
    cuts = [stroke([(-300, y1), (xs, y1), (xs, 300)], g),
            stroke([(xs, y2), (300, y2)], g),
            stroke([(xs, y1), (xs, y2), (300, y2)], g)]
    pcs = cut(shape, cuts)
    dome, speaker, share = roles
    out = []
    for poly in pcs:
        if contains(poly, (0, -95)):
            out.append((poly, dome))
        elif centroid(poly)[0] < xs:
            out.append((poly, speaker))
        else:
            out.append((poly, share))
    return out, [O], dict(tip=T)


def rot(p, deg, c=(0.0, 0.0)):
    a = math.radians(deg)
    x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * math.cos(a) - y * math.sin(a), c[1] + x * math.sin(a) + y * math.cos(a))


def step2(y1=-30.0, y2=20.0, xs=16.0, g=21.0, tip=124.0, a_out=126.0, roles=('b', 'a', 'c'), tilt=0.0,
          tail_side=-1):
    """Step with the whole cut system tilted by `tilt` degrees about (xs, 0)."""
    piv = (xs, 0.0)
    R = lambda p: rot(p, tilt, piv)
    u = rot((0, 1), tilt)
    tri, T = tail_poly(R((xs, 0)), u, g, tip, a_out, side=tail_side)
    shape = union(O.pts(), tri)
    L1 = [R((-300, y1)), R((xs, y1)), R((xs, 300))]
    L2 = [R((xs, y2)), R((300, y2))]
    L3 = [R((xs, y1)), R((xs, y2)), R((300, y2))]
    cuts = [stroke(L1, g), stroke(L2, g), stroke(L3, g)]
    pcs = cut(shape, cuts)
    dome, speaker, share = roles
    out = []
    for poly in pcs:
        cx, cy = centroid(poly)
        lx, ly = rot((cx, cy), -tilt, piv)
        if ly < y1 or (lx > xs and ly < y2):
            out.append((poly, dome))
        elif lx < xs:
            out.append((poly, speaker))
        else:
            out.append((poly, share))
    return out, [O], dict(tip=T)


def spine(jx=22.0, jy=-18.0, stem=110.0, up=-90.0, g=21.0, tip=124.0, a_out=126.0, branches=(), roles=None):
    """Bent spine from the tail (stem, then up) plus branches [(t, angle)]: t>0 measured up the
    up-branch from J, t<0 measured down the stem from J. roles: [(test_point, role)]."""
    J = (jx, jy)
    us = unit(stem)
    tri, T = tail_poly(J, us, g, tip, a_out)
    shape = union(O.pts(), tri)
    cuts = [stroke([ray(J, stem, 400), J, ray(J, up, 400)], g)]
    for t, a in branches:
        B = ray(J, up, t) if t >= 0 else ray(J, stem, -t)
        cuts.append(stroke([B, ray(B, a, 400)], g))
        if t == 0:
            cuts.append(stroke([ray(J, stem, 400), J, ray(J, a, 400)], g))
            cuts.append(stroke([ray(J, up, 400), J, ray(J, a, 400)], g))
    pcs = cut(shape, cuts)
    out = []
    for poly in pcs:
        r = 'a'
        for pt, role in (roles or []):
            if contains(poly, pt):
                r = role
        out.append((poly, r))
    return out, [O], dict(tip=T)


def step_inv(y1=10.0, y2=30.0, xs=-10.0, g=21.0, tipx=-30.0, tipy=124.0, a1=95.0, a2=130.0,
             roles=('a', 'b', 'c')):
    """Inverted step: a vertical cut drops from the top to a stepped line; the bottom piece carries a
    free tail. roles: (bottom with tail, top-left, top-right)."""
    T = (tipx, tipy)
    shape = union(O.pts(), [O.at(a1), T, O.at(a2), (0, 0)])
    cuts = [stroke([(-300, y1), (xs, y1), (xs, -300)], g),
            stroke([(xs, y2), (300, y2)], g),
            stroke([(xs, -300), (xs, y1), (xs, y2), (300, y2)], g)]
    pcs = cut(shape, cuts)
    bottom, tl, tr = roles
    out = []
    for poly in pcs:
        cx, cy = centroid(poly)
        if contains(poly, (0, 95)):
            out.append((poly, bottom))
        elif cx < xs:
            out.append((poly, tl))
        else:
            out.append((poly, tr))
    return out, [O], dict(tip=T)


def a_for(x):
    """Angle (deg) of the lower-half circle point with this x."""
    return math.degrees(math.acos(x / 100))
