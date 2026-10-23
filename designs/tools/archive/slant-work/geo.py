import math
def f(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s
def rot(px, py, cx, cy, a):
    t = math.radians(a); c, s = math.cos(t), math.sin(t)
    dx, dy = px - cx, py - cy
    return cx + dx * c - dy * s, cy + dx * s + dy * c
def rrect(cx, cy, w, h, r, a=0, radii=None):
    """rounded rect centred at cx,cy rotated a degrees (clockwise, SVG). radii=(tl,tr,br,bl) local."""
    rs = radii or (r, r, r, r)
    x0, y0, x1, y1 = cx - w/2, cy - h/2, cx + w/2, cy + h/2
    tl, tr, br, bl = rs
    pts = []  # sequence of ('L',x,y) or ('A',r,x,y)
    P = lambda x, y: rot(x, y, cx, cy, a)
    d = []
    x, y = P(x0 + tl, y0); d.append(f"M{f(x)} {f(y)}")
    x, y = P(x1 - tr, y0); d.append(f"L{f(x)} {f(y)}")
    if tr: x, y = P(x1, y0 + tr); d.append(f"A{f(tr)} {f(tr)} 0 0 1 {f(x)} {f(y)}")
    x, y = P(x1, y1 - br); d.append(f"L{f(x)} {f(y)}")
    if br: x, y = P(x1 - br, y1); d.append(f"A{f(br)} {f(br)} 0 0 1 {f(x)} {f(y)}")
    x, y = P(x0 + bl, y1); d.append(f"L{f(x)} {f(y)}")
    if bl: x, y = P(x0, y1 - bl); d.append(f"A{f(bl)} {f(bl)} 0 0 1 {f(x)} {f(y)}")
    x, y = P(x0, y0 + tl); d.append(f"L{f(x)} {f(y)}")
    if tl: x, y = P(x0 + tl, y0); d.append(f"A{f(tl)} {f(tl)} 0 0 1 {f(x)} {f(y)}")
    d.append("Z")
    return "".join(d)
def circ(cx, cy, r):
    return f"M{f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx-r)} {f(cy)}Z"
def svg(body, vb="0 0 256 256", bg=None):
    b = f'<rect width="256" height="256" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{b}{body}</svg>'
def path(d, fill):
    return f'<path fill="{fill}" d="{d}"/>'
