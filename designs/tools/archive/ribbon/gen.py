#!/usr/bin/env python3
"""Generate the dee-ribbon upper/lower templates (Cologne-C construction applied to D and d).

Construction shared by both cases (measured from the Cologne C):
  - one uniform round-capped monoline stroke, width W
  - the letter's bowl is drawn twice: an OUTER line and an INNER line, G apart (centre to centre)
  - where the bowl meets the stem, the two lines are joined by a rounded hairpin of radius rh
    (a little under G/2, so the channel pinches into the hook as in the C, the inner line
    easing out to meet it), and the stem runs tangent to the hairpins' outer points
  - on the stressed side of the bowl (away from the stem) a third line M -- the outer bowl
    shifted toward the stem by dM -- peels off the outer line and swings in to kiss the inner
    line, leaving the Cologne crescent between the two
Usage: gen.py params.json [outdir]
"""
import math, sys, json

def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s

def P(x, y):
    return f'{f(x)} {f(y)}'

def header(ink_vec):
    x1, y1, x2, y2 = ink_vec
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Divi">
  <title>Divi</title>
  <defs>
    <linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%TILE_A%"/>
      <stop offset="1" stop-color="%TILE_B%"/>
    </linearGradient>
    <linearGradient id="ink" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%INK_A%"/>
      <stop offset="1" stop-color="%INK_B%"/>
    </linearGradient>
  </defs>
  <rect id="tile" width="256" height="256" fill="url(#tile-g)"/>
'''

def wrap(paths, W, vec):
    s = header(vec)
    s += f'  <g fill="none" stroke="url(#ink)" stroke-width="{f(W)}" stroke-linecap="round" stroke-linejoin="round">\n'
    for d in paths:
        s += f'    <path d="{d}"/>\n'
    return s + '  </g>\n</svg>\n'

def ink_vec(left, right, top, bottom, p):
    # Cologne C (measured): deep blue holds over the first ~10% of the letter's width, then runs
    # evenly to full cyan at ~86-90%. Here the axis is tilted a little so the deep end sits at the
    # lower left and the light end at the upper right.
    a = math.radians(p.get('angle', 20))
    dx, dy = math.cos(a), -math.sin(a)
    span = (right - left) * dx + (bottom - top) * -dy
    s0, s1 = p.get('from', 0.08) * span, p.get('reach', 0.9) * span
    return (left + dx * s0, bottom + dy * s0, left + dx * s1, bottom + dy * s1)


def upper(p):
    W, G = p['W'], p['G']
    rh = p.get('k', 1.0) * G / 2
    L = p.get('L', 0)                                        # length of the S ease into the hook
    yT, yB = p['top'] + W / 2, p['bottom'] - W / 2
    R = (yB - yT) / 2
    cy = (yT + yB) / 2
    xS = p['left'] + W / 2
    bx = p['right'] - W / 2 - R
    Ri = R - G
    x0 = xS + rh                                             # hook centre x
    xe = x0 + L
    def ease(xa, ya, xb, yb):
        if abs(ya - yb) < 1e-6: return f'H{f(xb)} '
        m = (xa + xb) / 2
        return f'C{P(m, ya)} {P(m, yb)} {P(xb, yb)} '
    loop = (f'M{P(xS, yT+rh)} A{f(rh)} {f(rh)} 0 0 1 {P(x0, yT)} H{f(bx)} '
            f'A{f(R)} {f(R)} 0 0 1 {P(bx, yB)} H{f(x0)} '
            f'A{f(rh)} {f(rh)} 0 0 1 {P(xS, yB-rh)} A{f(rh)} {f(rh)} 0 0 1 {P(x0, yB-2*rh)} '
            + ease(x0, yB - 2*rh, xe, yB - G) +
            f'H{f(bx)} A{f(Ri)} {f(Ri)} 0 0 0 {P(bx, yT+G)} H{f(xe)} '
            + ease(xe, yT + G, x0, yT + 2*rh) +
            f'A{f(rh)} {f(rh)} 0 0 1 {P(xS, yT+rh)} Z')
    paths = [loop, f'M{P(xS, yT+rh)} V{f(yB-rh)}']
    D = p.get('dM', G)
    RM = Ri + D
    mcx = bx - D
    u = (RM*RM - R*R - D*D) / (2*D)
    if u >= 0:
        sx, sy = bx + u, cy - math.sqrt(R*R - u*u)
    elif RM >= R:
        sx, sy = mcx + math.sqrt(RM*RM - R*R), yT
    else:
        sx, sy = mcx, cy - RM
    large = 1 if sx < mcx else 0
    paths.append(f'M{P(sx, sy)} A{f(RM)} {f(RM)} 0 {large} 1 {P(sx, 2*cy-sy)}')
    vec = ink_vec(p['left'], p['right'], p['top'], p['bottom'], p)
    return wrap(paths, W, vec), dict(R=R, bx=bx, xS=xS, rh=rh, Ri=Ri, RM=RM, M=(sx, sy))


def lower(p):
    W, G = p['W'], p['G']
    rh = p.get('k', 1.0) * G / 2
    base = p['bottom'] - W / 2
    R = p['bowlR']
    cy = base - R
    cx = p['cx']
    Ri = R - G
    th = math.radians(p['theta'])
    dl = math.radians(p.get('delta', 0))                   # angular length of the S ease
    def pt(r, a): return (cx + r * math.cos(a), cy + r * math.sin(a))
    def tan(a): return (-math.sin(a), math.cos(a))          # direction of increasing angle
    O1, O2 = pt(R, -th), pt(R, th)
    Hc2 = pt(R - rh, th)
    J1, J2 = pt(R - 2*rh, -th), pt(R - 2*rh, th)            # hook inner points
    I1, I2 = pt(Ri, -(th + dl)), pt(Ri, th + dl)            # where the inner arc proper starts
    def ease(a, b, aa, ab, sign):
        if dl == 0 and abs(R - 2*rh - Ri) < 1e-6: return ''
        if p.get('spiral'):
            # polar ease: radius goes from (R-2rh) at the hook to Ri with zero slope at both ends
            ra, rb = math.hypot(a[0]-cx, a[1]-cy), math.hypot(b[0]-cx, b[1]-cy)
            def rr(t): return ra + (rb - ra) * (3*t*t - 2*t*t*t)
            def dr(t): return (rb - ra) * (6*t - 6*t*t)
            n = 3; out = ''
            for i in range(n):
                t0, t1 = i / n, (i + 1) / n
                p0a, p1a = aa + (ab - aa) * t0, aa + (ab - aa) * t1
                hh = p1a - p0a
                def P_(t, ph): return (cx + rr(t)*math.cos(ph), cy + rr(t)*math.sin(ph))
                def D_(t, ph):  # d/dphi
                    drp = dr(t) / (ab - aa)
                    return (drp*math.cos(ph) - rr(t)*math.sin(ph), drp*math.sin(ph) + rr(t)*math.cos(ph))
                A0, A1 = P_(t0, p0a), P_(t1, p1a)
                d0, d1 = D_(t0, p0a), D_(t1, p1a)
                c1 = (A0[0] + d0[0]*hh/3, A0[1] + d0[1]*hh/3)
                c2 = (A1[0] - d1[0]*hh/3, A1[1] - d1[1]*hh/3)
                out += f'C{P(*c1)} {P(*c2)} {P(*A1)} '
            return out
        k = math.dist(a, b) * 0.45
        ta, tb = tan(aa), tan(ab)
        c1 = (a[0] + sign*k*ta[0], a[1] + sign*k*ta[1])
        c2 = (b[0] - sign*k*tb[0], b[1] - sign*k*tb[1])
        return f'C{P(*c1)} {P(*c2)} {P(*b)} '
    loop = (f'M{P(*O1)} A{f(R)} {f(R)} 0 1 0 {P(*O2)} '
            f'A{f(rh)} {f(rh)} 0 0 0 {P(*J2)} '
            + ease(J2, I2, th, th + dl, 1) +
            f'A{f(Ri)} {f(Ri)} 0 1 1 {P(*I1)} '
            + ease(I1, J1, -(th + dl), -th, 1) +
            f'A{f(rh)} {f(rh)} 0 0 0 {P(*O1)} Z')
    xS = Hc2[0] + rh + p.get('stem_off', 0) * W   # stem_off 0.5: hook band overlaps half the stem
    top = p['top'] + W / 2
    stem_bot = base if p.get('stem_to_base', True) else Hc2[1]
    paths = [loop, f'M{P(xS, top)} V{f(stem_bot)}']
    D = p.get('dM', G)
    RM = Ri + D
    mcx = cx + D
    u = (D*D - (RM*RM - R*R)) / (2*D)
    sx, sy = cx + u, cy - math.sqrt(max(R*R - u*u, 0))
    large = 1 if sx > mcx else 0
    paths.append(f'M{P(sx, sy)} A{f(RM)} {f(RM)} 0 {large} 0 {P(sx, 2*cy-sy)}')
    left = cx - R - W / 2
    vec = ink_vec(left, xS + W / 2, p['top'], p['bottom'], p)
    return wrap(paths, W, vec), dict(cx=cx, cy=cy, R=R, Ri=Ri, rh=rh, xS=xS, hook=Hc2, M=(sx, sy), RM=RM,
                                     left=left, right=xS + W/2, bowl_top=cy - R - W/2)


if __name__ == '__main__':
    Pm = json.load(open(sys.argv[1]))
    out = sys.argv[2] if len(sys.argv) > 2 else '/Users/titus/repos/colognewebsite/designs/logos/dee-ribbon'
    su, iu = upper(Pm['upper'])
    sl, il = lower(Pm['lower'])
    open(f'{out}/upper.tmpl.svg', 'w').write(su)
    open(f'{out}/lower.tmpl.svg', 'w').write(sl)
    r = lambda v: tuple(round(x, 1) for x in v) if isinstance(v, tuple) else round(v, 1)
    print('upper', {k: r(v) for k, v in iu.items()})
    print('lower', {k: r(v) for k, v in il.items()})
