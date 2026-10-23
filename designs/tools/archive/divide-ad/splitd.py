import math, sys, json
def f(v): 
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0','') else s

def splitd(cx, cy, H, stem=0.385, rc=0.085, g=0.115, rd=0.085, dx=None, dy=0.265, rci=0.0, xshift=0.0):
    """Split D path. cx,cy: centre of bbox (before xshift). H: height. Fractions of H.
    stem: straight part length (bowl radius is H/2). rc: outer stem corner radius. g: cut gap.
    rd: dot radius. dx: dot x as fraction of width from left (None => arc centre + something). dy: dot centre offset from middle.
    rci: radius for the stem-side corners at the cut."""
    R = H/2; S = stem*H; W = S + R
    xL = cx - W/2 + xshift*H; xa = xL + S
    top = cy - H/2; bot = cy + H/2; h = g*H/2
    r = rc*H; ri = rci*H
    xe = xa + math.sqrt(R*R - h*h)
    p = []
    # top half
    if ri > 0:
        p.append(f"M{f(xL+ri)} {f(cy-h)}A{f(ri)} {f(ri)} 0 0 1 {f(xL)} {f(cy-h-ri)}")
    else:
        p.append(f"M{f(xL)} {f(cy-h)}")
    p.append(f"V{f(top+r)}A{f(r)} {f(r)} 0 0 1 {f(xL+r)} {f(top)}H{f(xa)}A{f(R)} {f(R)} 0 0 1 {f(xe)} {f(cy-h)}Z")
    # bottom half
    p.append(f"M{f(xL)} {f(cy+h) if ri==0 else f(cy+h+ri)}")
    if ri > 0:
        p[-1] = f"M{f(xL+ri)} {f(cy+h)}H{f(xe)}A{f(R)} {f(R)} 0 0 1 {f(xa)} {f(bot)}H{f(xL+r)}A{f(r)} {f(r)} 0 0 1 {f(xL)} {f(bot-r)}V{f(cy+h+ri)}A{f(ri)} {f(ri)} 0 0 1 {f(xL+ri)} {f(cy+h)}Z"
    else:
        p[-1] = f"M{f(xL)} {f(cy+h)}H{f(xe)}A{f(R)} {f(R)} 0 0 1 {f(xa)} {f(bot)}H{f(xL+r)}A{f(r)} {f(r)} 0 0 1 {f(xL)} {f(bot-r)}Z"
    rr = rd*H
    dxp = xL + (dx if dx is not None else 0.465)*W
    for sgn in (-1, 1):
        y = cy + sgn*dy*H
        p.append(f"M{f(dxp-rr)} {f(y)}a{f(rr)} {f(rr)} 0 1 0 {f(2*rr)} 0a{f(rr)} {f(rr)} 0 1 0 {f(-2*rr)} 0Z")
    return ''.join(p), dict(xL=xL, xR=xa+R, W=W, dotx=dxp)

def centroid_top(stem=0.385, g=0.115, N=1200):
    # numeric centroid of top half (H=1, xL=0) without corner rounding
    R=0.5; S=stem; h=g/2
    sx=sy=a=0.0
    for i in range(N):
        for j in range(N):
            x=(i+.5)/N*(S+R); y=(j+.5)/N*(0.5-h)  # y from top
            yy = 0.5 - y  # distance above centre
            inside = x<=S or ( (x-S)**2 + yy**2 <= R*R )
            if inside: sx+=x; sy+=y; a+=1
    return sx/a/(S+R), sy/a

def svg(paths, tile=None, fill='#6FAF8E', vb='0 0 256 256'):
    t = f'<rect width="256" height="256" fill="{tile}"/>' if tile else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><title>Divi</title>{t}<path fill="{fill}" fill-rule="evenodd" d="{paths}"/></svg>'

if __name__ == '__main__':
    print(centroid_top())
