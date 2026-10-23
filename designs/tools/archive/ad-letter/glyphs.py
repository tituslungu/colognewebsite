# Geometric bold caps + lowercase used across the letter concepts. All coords are absolute numbers.
import math
def f(v): 
    v = round(v, 2)
    return ('%d' % v) if v == int(v) else ('%g' % v)
def P(*pts): return ' '.join(f(p) for p in pts)

def rr_right(x0, y0, w, h, r, cl=0):
    """Rect whose right corners are rounded by r (r<=h/2) and left corners by cl. Clockwise."""
    xs = x0 + w - r
    d = f'M{P(x0+cl, y0)} H{f(xs)} A{f(r)} {f(r)} 0 0 1 {P(x0+w, y0+r)} '
    if h - 2*r > 0.01: d += f'V{f(y0+h-r)} '
    d += f'A{f(r)} {f(r)} 0 0 1 {P(xs, y0+h)} H{f(x0+cl)} '
    if cl: d += f'A{f(cl)} {f(cl)} 0 0 1 {P(x0, y0+h-cl)} V{f(y0+cl)} A{f(cl)} {f(cl)} 0 0 1 {P(x0+cl, y0)} Z'
    else: d += f'H{f(x0)} V{f(y0)} Z'
    return d
def rr_right_ccw(x0, y0, w, h, r):
    """Same outline drawn counter-clockwise (for counters)."""
    xs = x0 + w - r
    d = f'M{P(x0, y0)} V{f(y0+h)} H{f(xs)} A{f(r)} {f(r)} 0 0 0 {P(x0+w, y0+h-r)} '
    if h - 2*r > 0.01: d += f'V{f(y0+r)} '
    d += f'A{f(r)} {f(r)} 0 0 0 {P(xs, y0)} Z'
    return d
def circle(cx, cy, r, ccw=False):
    s = 0 if ccw else 1
    return f'M{P(cx-r, cy)} A{f(r)} {f(r)} 0 1 {s} {P(cx+r, cy)} A{f(r)} {f(r)} 0 1 {s} {P(cx-r, cy)} Z'
def rect(x, y, w, h, ccw=False):
    if ccw: return f'M{P(x,y)} V{f(y+h)} H{f(x+w)} V{f(y)} Z'
    return f'M{P(x,y)} H{f(x+w)} V{f(y+h)} H{f(x)} Z'
def pill(x, y, w, h, ccw=False):
    r = h/2
    if ccw: return f'M{P(x+r,y)} A{f(r)} {f(r)} 0 0 0 {P(x+r,y+h)} H{f(x+w-r)} A{f(r)} {f(r)} 0 0 0 {P(x+w-r,y)} Z'
    return f'M{P(x+r,y)} H{f(x+w-r)} A{f(r)} {f(r)} 0 0 1 {P(x+w-r,y+h)} H{f(x+r)} A{f(r)} {f(r)} 0 0 1 {P(x+r,y)} Z'

# ---- caps (H = cap height, s = vertical stem, sh = horizontal stroke) ----
def cap_I(x, base, H, s):
    return rect(x, base-H, s, H), s
def cap_D(x, base, H, s, w, r, sh=None, sr=None):
    """Outer: rr_right(w,H,r). Counter inset s on left, sh top/bottom, sr on the bowl."""
    sh = sh or s*0.88; sr = sr or s*1.0
    y0 = base-H
    outer = rr_right(x, y0, w, H, r)
    ih = H - 2*sh; iw = w - s - sr
    ir = max(1, min(r - (sr+sh)/2, ih/2))
    inner = rr_right_ccw(x+s, y0+sh, iw, ih, ir)
    return outer + ' ' + inner, w
def cap_V(x, base, H, s, w, flat=None):
    """V with diagonal stroke of perpendicular thickness ~s, flat bottom."""
    y0 = base-H
    # half-angle of the V
    ang = math.atan2(w/2, H)
    a = s / math.cos(ang)           # horizontal width of a diagonal stroke
    flat = flat if flat is not None else a*0.62
    # outer left edge from (x, y0) to (x+w/2-flat/2, base)
    # inner vertex: intersection of inner edges
    xl_in = x + a; xr_in = x + w - a
    # inner edges are parallel to outer ones; outer left line passes (x,y0) & (x+w/2-flat/2, base)
    dx = (w/2 - flat/2) / H         # slope dx/dy
    # inner left: x = xl_in + dx*(y-y0); inner right: x = xr_in - dx*(y-y0) -> meet at y where equal
    yv = y0 + (xr_in - xl_in) / (2*dx)
    xv = x + w/2
    d = f'M{P(x,y0)} H{f(x+a)} L{P(xv,yv)} L{P(x+w-a,y0)} H{f(x+w)} L{P(x+w/2+flat/2,base)} H{f(x+w/2-flat/2)} Z'
    return d, w
