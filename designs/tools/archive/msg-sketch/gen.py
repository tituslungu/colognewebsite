"""SUPERSEDED: the art-direction pass builds the final message-1/message-2 files with
../msg-ad/build.py (which imports the ÷ and DIVI wordmark helpers from here).
Running build() below would overwrite them with the old geometry.

Generates the message-1 (receipt bubble) and message-2 (split bubble) logo SVGs.

All geometry is computed here so every file shares the same construction.
Usage: python3 gen.py [outdir-root]   (default: the repo's designs/logos)
"""
import json
import math
import os
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else '/Users/titus/repos/colognewebsite/designs/logos'
HERE = os.path.dirname(os.path.abspath(__file__))

CHARCOAL = '#2D2D2D'
SAGE = '#6FAF8E'
OFFWHITE = '#FAFAF8'
WHITE = '#FFFFFF'


def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def svg(body, vb='0 0 256 256', title='Divi'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


# ---------------------------------------------------------------- divide sign
# Proportions taken from the ÷ on the QR tile in the onboarding animation:
# bar 17 x 3 (round caps), dots 4.4 across, dot centres 6.5 from the bar.
def divide(cx, cy, t, fill):
    L = t * 17 / 3
    r = t * 2.2 / 3
    off = t * 6.5 / 3
    return (f'<rect x="{f(cx - L / 2)}" y="{f(cy - t / 2)}" width="{f(L)}" height="{f(t)}" rx="{f(t / 2)}" fill="{fill}"/>'
            f'<circle cx="{f(cx)}" cy="{f(cy - off)}" r="{f(r)}" fill="{fill}"/>'
            f'<circle cx="{f(cx)}" cy="{f(cy + off)}" r="{f(r)}" fill="{fill}"/>')


def divide_holes(cx, cy, t):
    """The same ÷ as subpaths, for knocking out of a shape with evenodd."""
    L = t * 17 / 3
    r = t * 2.2 / 3
    off = t * 6.5 / 3
    h = t / 2
    x0, x1 = cx - L / 2, cx + L / 2
    bar = (f'M{f(x0 + h)} {f(cy - h)}H{f(x1 - h)}A{f(h)} {f(h)} 0 0 1 {f(x1 - h)} {f(cy + h)}'
           f'H{f(x0 + h)}A{f(h)} {f(h)} 0 0 1 {f(x0 + h)} {f(cy - h)}Z')

    def dot(y):
        return f'M{f(cx - r)} {f(y)}A{f(r)} {f(r)} 0 1 0 {f(cx + r)} {f(y)}A{f(r)} {f(r)} 0 1 0 {f(cx - r)} {f(y)}Z'
    return bar + dot(cy - off) + dot(cy + off)


# ------------------------------------------------------- message-1: receipt bubble
# A chat bubble whose bottom edge is the torn edge of a receipt. Every tooth is a
# 90-degree notch (45-degree sides); the bubble's tail is the first tooth grown
# three times deeper, its inner edge on the same 45 degrees, leaning out a little.
# cx is the body's centre; it sits right of 128 so the whole shape, tail
# included, is centred in the tile.
M1 = dict(teeth=5, td=12.0, tail=3.0, out=10.0, rc=24.0, body=100.0, cx=133.0, top=62.0, t=13.0)


def m1_outline(p=M1):
    td, n = p['td'], p['teeth']
    Dt = p['tail'] * td
    out = p.get('out', 0.0)
    W = 2 * n * td + td + Dt - out  # keeps the tail's inner edge at 45 degrees
    xL = p['cx'] - W / 2
    xR = p['cx'] + W / 2
    yT = p['top']
    yV = yT + p['body']
    yTip = yV + td
    rc = p['rc']
    d = [f'M{f(xL + rc)} {f(yT)}', f'H{f(xR - rc)}', f'A{f(rc)} {f(rc)} 0 0 1 {f(xR)} {f(yT + rc)}', f'V{f(yTip)}']
    x = xR
    for _ in range(n):
        d.append(f'L{f(x - td)} {f(yV)}')
        d.append(f'L{f(x - 2 * td)} {f(yTip)}')
        x -= 2 * td
    d.append(f'L{f(x - td)} {f(yV)}')
    x -= td
    d.append(f'L{f(xL - out)} {f(yV + Dt)}')  # tail tip, 45 degrees from the last valley
    if out:
        d.append(f'L{f(xL)} {f(yV - p.get("rise", 0.0))}')
    d.append(f'V{f(yT + rc)}')
    d.append(f'A{f(rc)} {f(rc)} 0 0 1 {f(xL + rc)} {f(yT)}Z')
    pts = [(xL - out, yV + Dt), (xR, yTip), (xL + rc - rc * math.cos(math.pi / 4), yT + rc - rc * math.sin(math.pi / 4)),
           (xR - rc + rc * math.cos(math.pi / 4), yT + rc - rc * math.sin(math.pi / 4))]
    geo = dict(xL=xL, xR=xR, yT=yT, yV=yV, yTip=yTip, W=W, tailTip=(xL - out, yV + Dt),
               bbox=(xL - out, yT, xR, yV + Dt),
               maxr=max(math.hypot(a - 128, b - 128) for a, b in pts))
    return ''.join(d), geo


def m1_divide_centre(geo, p=M1):
    # Optical centre of the body: halfway between the top and the middle of the teeth.
    return p['cx'], (geo['yT'] + geo['yV'] + p['td'] / 2) / 2


# --------------------------------------------------------- message-2: split bubble
# A round chat bubble cut in two by one vertical gap. The right half is a D; the
# left half keeps the tail. The tail is a square corner: the bubble is a circle
# whose lower-left quarter is a square, so the whole mark is built from one
# circle, one square corner and one gap.
M2 = dict(R=80.0, g=17.0, cx=133.0, cy=117.0, tail='tri', rel=(-0.97, 1.14), a1=116.0, a2=152.0)


def m2_halves(p=M2):
    R, g, cx, cy = p['R'], p['g'], p['cx'], p['cy']
    h = g / 2
    yc = math.sqrt(R * R - h * h)
    if p['tail'] == 'corner':
        # Left half: from the cut's top, round over the top-left quarter, down the
        # straight left side to the square corner, along the flat bottom to the cut.
        # Starting the straight side at the circle's leftmost point keeps it tangent.
        k = p.get('cornerR', 0.0)
        left = (f'M{f(cx - h)} {f(cy - yc)}A{f(R)} {f(R)} 0 0 0 {f(cx - R)} {f(cy)}'
                + (f'V{f(cy + R - k)}A{f(k)} {f(k)} 0 0 0 {f(cx - R + k)} {f(cy + R)}' if k else f'V{f(cy + R)}')
                + f'H{f(cx - h)}Z')
        tip = (cx - R, cy + R)
    else:
        # Classic tail off the lower-left. The outer edge is tangent to the circle
        # (so the left side runs straight into the tip); the inner edge meets the
        # circle at angle a1, making a crisp notch.
        a1 = math.radians(p.get('a1', 100))
        tip = p['tip'] if 'tip' in p else (cx + p['rel'][0] * R, cy + p['rel'][1] * R)
        dx, dy = tip[0] - cx, tip[1] - cy
        dist = math.hypot(dx, dy)
        phi = math.atan2(dy, dx)
        a2 = math.radians(p['a2']) if 'a2' in p else phi + math.acos(R / dist)
        A = (cx + R * math.cos(a1), cy + R * math.sin(a1))
        B = (cx + R * math.cos(a2), cy + R * math.sin(a2))
        left = (f'M{f(cx - h)} {f(cy - yc)}A{f(R)} {f(R)} 0 0 0 {f(B[0])} {f(B[1])}'
                f'L{f(tip[0])} {f(tip[1])}L{f(A[0])} {f(A[1])}'
                f'A{f(R)} {f(R)} 0 0 0 {f(cx - h)} {f(cy + yc)}Z')
    right = f'M{f(cx + h)} {f(cy - yc)}A{f(R)} {f(R)} 0 0 1 {f(cx + h)} {f(cy + yc)}Z'
    ext = [math.hypot(tip[0] - 128, tip[1] - 128), math.hypot(cx - 128, cy - 128) + R]
    bbox = (min(tip[0], cx - R), cy - R, cx + R, max(tip[1], cy + R))
    return left, right, dict(tip=tip, maxr=max(ext), bbox=bbox)


# ----------------------------------------------------------------- DIVI wordmark
# Constructed to Helvetica Neue Bold's proportions (cap height 714, stems 157,
# D bars 132, tracking +0.12em), measured from the rendered face, then drawn as
# plain geometry so the lockup has no font dependency.
CAP = 714.0
STEM = 157.0
TRACK = 120.0


def fit_d():
    prof = json.load(open(os.path.join(HERE, 'd-profile.json')))
    outer, inner = [], []
    for h, runs in prof:
        if 357 <= h <= 700 and runs:
            outer.append((h, runs[-1][1]))
            if len(runs) == 2:
                inner.append((h, runs[1][0]))

    def cubic(p0, p1, p2, p3, t):
        u = 1 - t
        return tuple(u**3 * a + 3 * u * u * t * b + 3 * u * t * t * c + t**3 * d for a, b, c, d in zip(p0, p1, p2, p3))

    def err(ctrl, samples, top, xr, ymid=357.0):
        xa, k1, k2 = ctrl
        p0, p1, p2, p3 = (xa, top), (xa + k1 * (xr - xa), top), (xr, ymid + k2 * (top - ymid)), (xr, ymid)
        pts = [cubic(p0, p1, p2, p3, i / 60) for i in range(61)]
        e = 0.0
        for h, x in samples:
            # x of curve at height h (curve is monotone in y)
            best = min(pts, key=lambda q: abs(q[1] - h))
            e += (best[0] - x) ** 2
        return e

    def search(samples, top, xr, lo):
        best = None
        for xa in range(lo, lo + 260, 8):
            for k1 in [i / 20 for i in range(4, 20)]:
                for k2 in [i / 20 for i in range(4, 20)]:
                    e = err((xa, k1, k2), samples, top, xr)
                    if best is None or e < best[0]:
                        best = (e, xa, k1, k2)
        e, xa, k1, k2 = best
        for _ in range(3):  # refine
            for dxa in (-4, -2, 0, 2, 4):
                for dk1 in (-.02, 0, .02):
                    for dk2 in (-.02, 0, .02):
                        c = (xa + dxa, k1 + dk1, k2 + dk2)
                        ee = err(c, samples, top, xr)
                        if ee < e:
                            e, (xa, k1, k2) = ee, c
        return xa, k1, k2, math.sqrt(e / len(samples))

    o = search(outer, CAP, 701.0, 300)
    i = search(inner, CAP - 132.0, 544.0, 226)
    return o, i


def wordmark_paths(scale, ox, baseline):
    """Return a single path d for DIVI with the cap height = 714*scale."""
    (oxa, ok1, ok2, oe), (ixa, ik1, ik2, ie) = FIT
    X = lambda u: ox + u * scale
    Y = lambda v: baseline - v * scale
    out = []

    def D(x0):
        top, mid, ib, it = CAP, 357.0, 132.0, CAP - 132.0
        xr, ixr = 701.0, 544.0
        a = [f'M{f(X(x0 + 69))} {f(Y(0))}', f'V{f(Y(top))}', f'H{f(X(x0 + oxa))}',
             f'C{f(X(x0 + oxa + ok1 * (xr - oxa)))} {f(Y(top))} {f(X(x0 + xr))} {f(Y(mid + ok2 * (top - mid)))} {f(X(x0 + xr))} {f(Y(mid))}',
             f'C{f(X(x0 + xr))} {f(Y(mid - ok2 * (top - mid)))} {f(X(x0 + oxa + ok1 * (xr - oxa)))} {f(Y(0))} {f(X(x0 + oxa))} {f(Y(0))}Z',
             # counter, drawn the other way round so it cuts out under nonzero too
             f'M{f(X(x0 + 69 + STEM))} {f(Y(ib))}', f'H{f(X(x0 + ixa))}',
             f'C{f(X(x0 + ixa + ik1 * (ixr - ixa)))} {f(Y(ib))} {f(X(x0 + ixr))} {f(Y(mid - ik2 * (it - mid)))} {f(X(x0 + ixr))} {f(Y(mid))}',
             f'C{f(X(x0 + ixr))} {f(Y(mid + ik2 * (it - mid)))} {f(X(x0 + ixa + ik1 * (ixr - ixa)))} {f(Y(it))} {f(X(x0 + ixa))} {f(Y(it))}',
             f'H{f(X(x0 + 69 + STEM))}Z']
        return ''.join(a)

    def I(x0):
        return f'M{f(X(x0 + 69))} {f(Y(0))}V{f(Y(CAP))}H{f(X(x0 + 69 + STEM))}V{f(Y(0))}Z'

    def V(x0):
        pts = [(-6.5, CAP), (154.6, CAP), (315.5, 217.0), (476.4, CAP), (637.5, CAP), (401.5, 0.0), (224.5, 0.0)]
        return 'M' + 'L'.join(f'{f(X(x0 + a))} {f(Y(b))}' for a, b in pts) + 'Z'

    x = 0.0
    out.append(D(x)); x += 741 + TRACK
    out.append(I(x)); x += 295 + TRACK
    out.append(V(x)); x += 630 + TRACK
    out.append(I(x))
    ink_left = ox + 69 * scale
    ink_right = ox + (x + 69 + STEM) * scale
    return ''.join(out), ink_left, ink_right


FIT = None


def fill_box(content, bbox, margin=6.0):
    """Scale and centre artwork so its bounding box fills the 256 square."""
    x0, y0, x1, y1 = bbox
    k = (256 - 2 * margin) / max(x1 - x0, y1 - y0)
    tx = 128 - k * (x0 + x1) / 2
    ty = 128 - k * (y0 + y1) / 2
    return f'<g transform="translate({f(tx)} {f(ty)}) scale({k:.5f})">{content}</g>'


def write(folder, name, content):
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, name), 'w') as fh:
        fh.write(content)


def build():
    global FIT
    FIT = fit_d()
    print('D fit outer', FIT[0], 'inner', FIT[1])

    # ---------------- message-1
    d1, g1 = m1_outline()
    dcx, dcy = m1_divide_centre(g1)
    t = M1['t']
    print('m1 geo', {k: (round(v, 1) if isinstance(v, float) else v) for k, v in g1.items()}, 'divide at', dcx, dcy)
    out = os.path.join(ROOT, 'message-1')
    write(out, 'mark.svg', svg(f'<path fill="{CHARCOAL}" d="{d1}"/>{divide(dcx, dcy, t, SAGE)}', title='Divi'))
    write(out, 'app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{d1}"/>{divide(dcx, dcy, t, SAGE)}', title='Divi'))
    write(out, 'mark-mono.svg', svg(f'<path fill="{WHITE}" fill-rule="evenodd" d="{d1}{divide_holes(dcx, dcy, t)}"/>', title='Divi'))
    write(out, 'site-icon.svg', svg(fill_box(f'<path fill="{OFFWHITE}" d="{d1}"/>{divide(dcx, dcy, t, SAGE)}', g1['bbox'], SITE_MARGIN), title='Divi'))

    # ---------------- message-2
    L, Rr, g2 = m2_halves()
    print('m2 geo', g2)
    out = os.path.join(ROOT, 'message-2')
    write(out, 'mark.svg', svg(f'<path fill="{CHARCOAL}" d="{L}"/><path fill="{SAGE}" d="{Rr}"/>', title='Divi'))
    write(out, 'app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/><path fill="{OFFWHITE}" d="{L}"/><path fill="{SAGE}" d="{Rr}"/>', title='Divi'))
    write(out, 'mark-mono.svg', svg(f'<path fill="{WHITE}" d="{L}{Rr}"/>', title='Divi'))
    write(out, 'site-icon.svg', svg(fill_box(f'<path fill="{OFFWHITE}" d="{L}"/><path fill="{SAGE}" d="{Rr}"/>', g2['bbox'], SITE_MARGIN), title='Divi'))

    # ---------------- lockups
    lockups(d1, g1, (dcx, dcy, t), L, Rr)


def lockups(d1, g1, dv, L2, R2):
    # Cap height 100 units. Mark scaled so its main body matches ~1.25x cap height.
    C = 100.0
    s = C / CAP
    pad = 24.0
    for cid, mark_body, mark_top, mark_bottom, mark_left, mark_right, art in [
        ('message-1', g1['yV'] + M1['td'] / 2 - g1['yT'], g1['yT'], g1['tailTip'][1], g1['xL'], g1['xR'],
         lambda fill_body, fill_div: f'<path fill="{fill_body}" d="{d1}"/>{divide(dv[0], dv[1], dv[2], fill_div)}'),
        ('message-2', 2 * M2['R'], M2['cy'] - M2['R'], M2['cy'] + M2['R'], M2['cx'] - M2['R'], M2['cx'] + M2['R'],
         lambda fill_l, fill_r: f'<path fill="{fill_l}" d="{L2}"/><path fill="{fill_r}" d="{R2}"/>'),
    ]:
        k = (C * LOCK[cid]['size']) / mark_body  # mark units -> lockup units
        mark_h = (mark_bottom - mark_top) * k
        # vertical: centre the mark's main body on the caps
        cap_top = pad + max(0.0, LOCK[cid]['rise'] * C)
        baseline = cap_top + C
        body_mid_lock = cap_top + C / 2
        body_mid_mark = mark_top + mark_body / 2
        ty = body_mid_lock - body_mid_mark * k
        tx = pad - mark_left * k
        mark_right_lock = tx + mark_right * k
        gap = LOCK[cid]['gap'] * C
        word, il, ir = wordmark_paths(s, 0, baseline)
        wx = mark_right_lock + gap - il
        width = ir + wx + pad
        bottom = max(baseline, ty + mark_bottom * k) + pad
        top = min(cap_top, ty + mark_top * k) - pad
        vb = f'0 {f(top)} {f(width)} {f(bottom - top)}'
        for name, a, b, wcol in [('lockup.svg', CHARCOAL if cid == 'message-2' else CHARCOAL, SAGE, CHARCOAL),
                                 ('lockup-reverse.svg', OFFWHITE, SAGE, WHITE)]:
            body = (f'<g transform="translate({f(tx)} {f(ty)}) scale({k:.5f})">{art(a, b)}</g>'
                    f'<path fill="{wcol}" transform="translate({f(wx)} 0)" d="{word}"/>')
            write(os.path.join(ROOT, cid), name, svg(body, vb=vb, title='Divi'))


SITE_MARGIN = 6.0

LOCK = {
    'message-1': dict(size=1.25, gap=0.62, rise=0.0),
    'message-2': dict(size=1.32, gap=0.55, rise=0.0),
}

if __name__ == '__main__':
    build()
