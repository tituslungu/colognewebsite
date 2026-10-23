"""Final builder for message-1 (torn receipt bubble) and message-2 (split bubble).

Art-direction pass. Reuses the ÷ (QR-tile proportions) and the DIVI wordmark
(fitted to Helvetica Neue Bold) from msg-sketch/gen.py; all mark geometry is here.
Usage: python3 build.py [outdir-root]   (default: the repo's designs/logos)
"""
import math
import os
import sys

sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/msg-sketch')
import gen  # noqa: E402
from gen import f, divide, divide_holes  # noqa: E402

ROOT = sys.argv[1] if len(sys.argv) > 1 else '/Users/titus/repos/colognewebsite/designs/logos'
CHARCOAL, SAGE, OFFWHITE, WHITE = '#2D2D2D', '#6FAF8E', '#FAFAF8', '#FFFFFF'


def svg(body, vb='0 0 256 256'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Divi">'
            f'<title>Divi</title>{body}</svg>\n')


def write(cid, name, content):
    d = os.path.join(ROOT, cid)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, name), 'w') as fh:
        fh.write(content)


def fill_box(content, bbox, margin=6.0):
    x0, y0, x1, y1 = bbox
    k = (256 - 2 * margin) / max(x1 - x0, y1 - y0)
    return f'<g transform="translate({f(128 - k * (x0 + x1) / 2)} {f(128 - k * (y0 + y1) / 2)}) scale({k:.5f})">{content}</g>'


# --------------------------------------------------- message-1: torn receipt bubble
# A receipt torn off at the top (five 90-degree teeth, 45-degree sides), square
# shoulders, one rounded corner at bottom-right and a 45-degree tail at bottom-left
# whose outer edge is the receipt's left side carried straight down. The sage ÷
# from the QR tile sits in the body. Every diagonal is 45 degrees.
M1 = dict(teeth=5, td=14.0, body=108.0, rc=26.0, tail=38.0, t=13.0, cx=130.0, cy=130.0)


def m1_geo(p=M1):
    n, td = p['teeth'], p['td']
    w = 2 * n * td
    yT = p['cy'] - (td + p['body'] + p['tail']) / 2 + td  # whole shape centred on cy
    xL, xR, yB = p['cx'] - w / 2, p['cx'] + w / 2, yT + p['body']
    rc, tl = p['rc'], p['tail']
    d = [f'M{f(xL)} {f(yT)}']
    x = xL
    for _ in range(n):
        d += [f'L{f(x + td)} {f(yT - td)}', f'L{f(x + 2 * td)} {f(yT)}']
        x += 2 * td
    d += [f'V{f(yB - rc)}', f'A{f(rc)} {f(rc)} 0 0 1 {f(xR - rc)} {f(yB)}', f'H{f(xL + tl)}', f'L{f(xL)} {f(yB + tl)}Z']
    # ÷ centred between the middle of the teeth and the bottom edge
    div = (p['cx'], (yT - td / 2 + yB) / 2, p['t'])
    return ''.join(d), div, dict(bbox=(xL, yT - td, xR, yB + tl), xL=xL, xR=xR, top=yT - td, yB=yB, yT=yT)


# --------------------------------------------------------- message-2: split bubble
# One circle, one vertical gap. The right piece is a D. The left piece keeps the
# speech tail: its straight edge (the cut) runs on past the circle to the tail's
# point, and the tail's outer edge meets the circle at 128 degrees, a definite
# corner, so the cut and the tail are one line.
M2 = dict(R=84.0, g=20.0, cx=129.0, cy=116.0, a=128.0, drop=28.0)


def m2_geo(p=M2):
    R, h, cx, cy = p['R'], p['g'] / 2, p['cx'], p['cy']
    yc = math.sqrt(R * R - h * h)
    a = math.radians(p['a'])
    B = (cx + R * math.cos(a), cy + R * math.sin(a))
    tip = (cx - h, cy + R + p['drop'])
    left = (f'M{f(cx - h)} {f(cy - yc)}A{f(R)} {f(R)} 0 0 0 {f(B[0])} {f(B[1])}'
            f'L{f(tip[0])} {f(tip[1])}Z')
    right = f'M{f(cx + h)} {f(cy - yc)}A{f(R)} {f(R)} 0 0 1 {f(cx + h)} {f(cy + yc)}Z'
    return left, right, dict(bbox=(cx - R, cy - R, cx + R, tip[1]), tip=tip, B=B)


# ------------------------------------------------------------------ lockups
def lockup(cid, art, mark_top, mark_bottom, mark_left, mark_right, body_top, body_bottom, size, gap):
    """Mark beside DIVI. The mark's main body (body_top..body_bottom) is `size` x cap
    height and centred on the caps; anything below it (the tail) hangs like a descender."""
    C = 100.0
    s = C / gen.CAP
    pad = 24.0
    k = C * size / (body_bottom - body_top)
    cap_top = pad
    baseline = cap_top + C
    ty = cap_top + C / 2 - (body_top + body_bottom) / 2 * k
    tx = pad - mark_left * k
    word, il, ir = gen.wordmark_paths(s, 0, baseline)
    wx = tx + mark_right * k + gap * C - il
    width = ir + wx + pad
    top = min(cap_top, ty + mark_top * k) - pad
    bottom = max(baseline, ty + mark_bottom * k) + pad
    vb = f'0 {f(top)} {f(width)} {f(bottom - top)}'
    for name, a, b, wcol in [('lockup.svg', CHARCOAL, SAGE, CHARCOAL), ('lockup-reverse.svg', OFFWHITE, SAGE, WHITE)]:
        body = (f'<g transform="translate({f(tx)} {f(ty)}) scale({k:.5f})">{art(a, b)}</g>'
                f'<path fill="{wcol}" transform="translate({f(wx)} 0)" d="{word}"/>')
        write(cid, name, svg(body, vb))


def build():
    gen.FIT = gen.fit_d()

    # message-1
    d1, (dx, dy, t), g1 = m1_geo()
    art1 = lambda body, div: f'<path fill="{body}" d="{d1}"/>{divide(dx, dy, t, div)}'
    write('message-1', 'mark.svg', svg(art1(CHARCOAL, SAGE)))
    write('message-1', 'app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/>' + art1(OFFWHITE, SAGE)))
    write('message-1', 'mark-mono.svg', svg(f'<path fill="{WHITE}" fill-rule="evenodd" d="{d1}{divide_holes(dx, dy, t)}"/>'))
    write('message-1', 'site-icon.svg', svg(fill_box(art1(OFFWHITE, SAGE), g1['bbox'])))
    x0, y0, x1, y1 = g1['bbox']
    lockup('message-1', art1, y0, y1, x0, x1, g1['top'], g1['yB'], size=1.3, gap=0.5)
    print('m1', {k: (tuple(round(v, 1) for v in val) if isinstance(val, tuple) else round(val, 1)) for k, val in g1.items()}, 'div', dx, dy)

    # message-2
    L, Rr, g2 = m2_geo()
    art2 = lambda l, r: f'<path fill="{l}" d="{L}"/><path fill="{r}" d="{Rr}"/>'
    write('message-2', 'mark.svg', svg(art2(CHARCOAL, SAGE)))
    write('message-2', 'app-icon.svg', svg(f'<rect width="256" height="256" fill="{CHARCOAL}"/>' + art2(OFFWHITE, SAGE)))
    write('message-2', 'mark-mono.svg', svg(f'<path fill="{WHITE}" d="{L}{Rr}"/>'))
    write('message-2', 'site-icon.svg', svg(fill_box(art2(OFFWHITE, SAGE), g2['bbox'])))
    x0, y0, x1, y1 = g2['bbox']
    lockup('message-2', art2, y0, y1, x0, x1, M2['cy'] - M2['R'], M2['cy'] + M2['R'], size=1.3, gap=0.5)
    print('m2', g2)


if __name__ == '__main__':
    build()
