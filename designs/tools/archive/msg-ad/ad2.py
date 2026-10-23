"""Art-direction variants for message-2 (split bubble): where the tail lives."""
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
CH, SAGE, OW, W = '#2D2D2D', '#6FAF8E', '#FAFAF8', '#FFFFFF'


def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{body}</svg>\n'


def pt(cx, cy, R, a):
    a = math.radians(a)
    return (cx + R * math.cos(a), cy + R * math.sin(a))


def halves(cx, cy, R, g, left_tail=None, right_tail=None):
    """left_tail / right_tail: (a_far, tip, a_near) with angles in degrees (90 = straight down).
    a_far is the end of the arc coming from the top, a_near the start of the arc going to
    the cut's bottom. a_near may be 'cut' meaning the tail's second edge ends at the cut."""
    h = g / 2
    yc = math.sqrt(R * R - h * h)
    top_l, bot_l = (cx - h, cy - yc), (cx - h, cy + yc)
    top_r, bot_r = (cx + h, cy - yc), (cx + h, cy + yc)
    if left_tail:
        a_far, tip, a_near = left_tail
        B = pt(cx, cy, R, a_far)
        L = f'M{f(top_l[0])} {f(top_l[1])}A{f(R)} {f(R)} 0 0 0 {f(B[0])} {f(B[1])}L{f(tip[0])} {f(tip[1])}'
        if a_near == 'cut':
            L += 'Z'
        else:
            A = pt(cx, cy, R, a_near)
            L += f'L{f(A[0])} {f(A[1])}A{f(R)} {f(R)} 0 0 0 {f(bot_l[0])} {f(bot_l[1])}Z'
    else:
        L = f'M{f(top_l[0])} {f(top_l[1])}A{f(R)} {f(R)} 0 0 0 {f(bot_l[0])} {f(bot_l[1])}Z'
    if right_tail:
        a_far, tip, a_near = right_tail
        B = pt(cx, cy, R, a_far)
        Rr = f'M{f(top_r[0])} {f(top_r[1])}A{f(R)} {f(R)} 0 0 1 {f(B[0])} {f(B[1])}L{f(tip[0])} {f(tip[1])}'
        if a_near == 'cut':
            Rr += 'Z'
        else:
            A = pt(cx, cy, R, a_near)
            Rr += f'L{f(A[0])} {f(A[1])}A{f(R)} {f(R)} 0 0 1 {f(bot_r[0])} {f(bot_r[1])}Z'
    else:
        Rr = f'M{f(top_r[0])} {f(top_r[1])}A{f(R)} {f(R)} 0 0 1 {f(bot_r[0])} {f(bot_r[1])}Z'
    return L, Rr


def emit(name, L, Rr, lfill=OW, rfill=SAGE, tile=CH, markl=CH):
    open(os.path.join(HERE, name + '.tile.svg'), 'w').write(svg(f'<rect width="256" height="256" fill="{tile}"/><path fill="{lfill}" d="{L}"/><path fill="{rfill}" d="{Rr}"/>'))
    open(os.path.join(HERE, name + '.mark.svg'), 'w').write(svg(f'<path fill="{markl}" d="{L}"/><path fill="{rfill}" d="{Rr}"/>'))
    open(os.path.join(HERE, name + '.mono.svg'), 'w').write(svg(f'<path fill="{W}" d="{L}{Rr}"/>'))


R, g = 80.0, 17.0
h = g / 2
# a: as delivered
cx, cy = 133.0, 117.0
emit('m2-a-current', *halves(cx, cy, R, g, left_tail=(152, (cx - .97 * R, cy + 1.14 * R), 116)))
# b: tail moved to the D, bottom-right (a "sent" message)
cx, cy = 123.0, 117.0
emit('m2-b-right', *halves(cx, cy, R, g, right_tail=(28, (cx + .97 * R, cy + 1.14 * R), 64)))
# c: tail grows out of the bottom of the cut, its inner edge flush with the gap, straight down
cx, cy = 128.0, 114.0
emit('m2-c-cutdown', *halves(cx, cy, R, g, left_tail=(118, (cx - h, cy + R + 30), 'cut')))
# d: tail from the bottom of the cut, pointing down-left at 45 degrees
cx, cy = 132.0, 116.0
emit('m2-d-cut45', *halves(cx, cy, R, g, left_tail=(128, (cx - h - 30, cy + R + 26), 'cut')))
# e: the D's stem runs on down into the tail (sent-side, flush with the gap)
cx, cy = 128.0, 114.0
emit('m2-e-dstem', *halves(cx, cy, R, g, right_tail=(62, (cx + h, cy + R + 30), 'cut')))
# f: D's stem tail angled down-right
cx, cy = 124.0, 116.0
emit('m2-f-dstem45', *halves(cx, cy, R, g, right_tail=(52, (cx + h + 30, cy + R + 26), 'cut')))
# zz: reference -- the delivered silhouette unsplit, white on green, to judge the chat-app likeness
cx, cy = 133.0, 117.0
L, Rr = halves(cx, cy, R, 0.0, left_tail=(152, (cx - .97 * R, cy + 1.14 * R), 116))
emit('zz-ref-unsplit', L, Rr, lfill=W, rfill=W, tile='#3DBE5A', markl='#3DBE5A')
