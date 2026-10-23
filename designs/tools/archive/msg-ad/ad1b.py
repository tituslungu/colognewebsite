import sys, os, math
sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/msg-sketch')
from gen import f, divide, divide_holes
HERE = os.path.dirname(os.path.abspath(__file__))
CH, SAGE, OW, W = '#2D2D2D', '#6FAF8E', '#FAFAF8', '#FFFFFF'
def svg(b): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{b}</svg>\n'
def emit(name, d, dv):
    cx, cy, t = dv
    open(f'{HERE}/{name}.tile.svg','w').write(svg(f'<rect width="256" height="256" fill="{CH}"/><path fill="{OW}" d="{d}"/>{divide(cx,cy,t,SAGE)}'))
    open(f'{HERE}/{name}.mark.svg','w').write(svg(f'<path fill="{CH}" d="{d}"/>{divide(cx,cy,t,SAGE)}'))
    open(f'{HERE}/{name}.mono.svg','w').write(svg(f'<path fill="{W}" fill-rule="evenodd" d="{d}{divide_holes(cx,cy,t)}"/>'))
def top_torn(name, teeth=5, td=12, rc=24, body=100, t=12, tail=34, out=0, cx=None, cy=128, dx=0):
    n = teeth; Wd = 2*n*td
    total_h = td + body + tail
    yT = cy - total_h/2 + td            # bbox centred vertically on cy
    if cx is None: cx = 128 + out/2 + dx
    xL, xR = cx - Wd/2, cx + Wd/2; yB = yT + body
    d = [f'M{f(xL)} {f(yT)}']; x = xL
    for _ in range(n):
        d.append(f'L{f(x+td)} {f(yT-td)}'); d.append(f'L{f(x+2*td)} {f(yT)}'); x += 2*td
    d.append(f'V{f(yB-rc)}A{f(rc)} {f(rc)} 0 0 1 {f(xR-rc)} {f(yB)}')
    if out:
        d.append(f'H{f(xL+tail-out)}L{f(xL-out)} {f(yB+tail)}L{f(xL)} {f(yB - out)}Z')
    else:
        d.append(f'H{f(xL+tail)}L{f(xL)} {f(yB+tail)}Z')
    dcy = (yT - td/2 + yB)/2
    corners = [(xL, yT), (xR, yT), (xL-out, yB+tail)]
    print(name, 'W', Wd, 'H', total_h, 'yT', round(yT,1), 'maxr', round(max(math.hypot(a-128,b-128) for a,b in corners),1))
    emit(name, ''.join(d), (cx, dcy, t))
top_torn('m1-d1', teeth=5, td=12, body=100, t=12, tail=34)
top_torn('m1-d2', teeth=5, td=14, body=108, rc=26, t=13, tail=38)
top_torn('m1-d3', teeth=6, td=12, body=106, rc=24, t=13, tail=36)
top_torn('m1-d4', teeth=5, td=14, body=108, rc=26, t=13, tail=40, out=8)
top_torn('m1-d5', teeth=4, td=17, body=106, rc=26, t=13, tail=38)
