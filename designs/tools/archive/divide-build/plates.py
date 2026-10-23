# Geometry for the "two plates" divide sign. All sizes in a 256 box, scaled by k.
import math
def f(v): return ('%.2f' % v).rstrip('0').rstrip('.')

def circle_d(cx, cy, r, ccw=False):
    s = 1 if ccw else 0  # direction flag lets a ring cut out of a disc under nonzero too
    return f"M{f(cx-r)} {f(cy)}a{f(r)} {f(r)} 0 1 {1-s if ccw else 0} {f(2*r)} 0a{f(r)} {f(r)} 0 1 {1-s if ccw else 0} {f(-2*r)} 0Z"

def wave_d(cx, cy, w, amp):
    # two half-waves: up then down, as quadratic curves (like the animation's plate)
    x = cx - w / 2
    return f"M{f(x)} {f(cy)}q{f(w/4)} {f(-2*amp)} {f(w/2)} 0t{f(w/2)} 0"

G = dict(R=36, s=63, bt=18, bl=160, rim=0.66, rimw=0.075, dot=0.29, ww=0.74, wamp=0.17, wst=0.2)

def parts(k=1.0, cx=128, cy=128, g=G):
    R = g['R']*k; s = g['s']*k; bt = g['bt']*k; bl = g['bl']*k
    P = dict(R=R, plates=[(cx, cy - s), (cx, cy + s)], bar=(cx - bl/2, cy - bt/2, bl, bt),
             rim_r=R*g['rim'], rim_w=R*g['rimw'], dot_r=R*g['dot'],
             wave=(R*g['ww']*g['rim']*1.0, R*g['wamp'], R*g['wst']))
    return P

def colour(P, tile=None, plate='#FAFAF8', food='#6FAF8E', bar='#6FAF8E', rim='#2D2D2D', rim_op=.14):
    out = f'<rect width="256" height="256" fill="{tile}"/>' if tile else ''
    (x1, y1), (x2, y2) = P['plates']
    for (x, y) in P['plates']:
        out += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["R"])}" fill="{plate}"/>'
        if rim: out += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["rim_r"])}" fill="none" stroke="{rim}" stroke-opacity="{rim_op}" stroke-width="{f(P["rim_w"])}"/>'
    out += f'<circle cx="{f(x1)}" cy="{f(y1)}" r="{f(P["dot_r"])}" fill="{food}"/>'
    w, amp, st = P['wave']
    out += f'<path d="{wave_d(x2, y2 + amp*0.15, w, amp)}" fill="none" stroke="{food}" stroke-width="{f(st)}" stroke-linecap="round"/>'
    bx, by, bl, bt = P['bar']
    out += f'<rect x="{f(bx)}" y="{f(by)}" width="{f(bl)}" height="{f(bt)}" rx="{f(bt/2)}" fill="{bar}"/>'
    return out

def solid(P, fill, rim=True, uid='m'):
    """One-colour version: plates are discs with the rim line and the food cut out."""
    (x1, y1), (x2, y2) = P['plates']
    w, amp, st = P['wave']
    m = f'<mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><rect width="256" height="256" fill="#fff"/>'
    if rim:
        for (x, y) in P['plates']:
            m += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["rim_r"])}" fill="none" stroke="#000" stroke-width="{f(P["rim_w"]*1.6)}"/>'
    m += f'<circle cx="{f(x1)}" cy="{f(y1)}" r="{f(P["dot_r"])}" fill="#000"/>'
    m += f'<path d="{wave_d(x2, y2 + amp*0.15, w, amp)}" fill="none" stroke="#000" stroke-width="{f(st)}" stroke-linecap="round"/></mask>'
    bx, by, bl, bt = P['bar']
    body = ''.join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(P["R"])}"/>' for (x, y) in P['plates'])
    return (m + f'<g fill="{fill}"><g mask="url(#{uid})">{body}</g>'
            f'<rect x="{f(bx)}" y="{f(by)}" width="{f(bl)}" height="{f(bt)}" rx="{f(bt/2)}"/></g>')
