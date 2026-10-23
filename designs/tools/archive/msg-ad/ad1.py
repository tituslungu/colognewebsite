"""Art-direction variants for message-1 (receipt bubble)."""
import sys, os, math
sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/msg-sketch')
import gen
from gen import f, divide, divide_holes
HERE = os.path.dirname(os.path.abspath(__file__))
CH, SAGE, OW, W = '#2D2D2D', '#6FAF8E', '#FAFAF8', '#FFFFFF'
def svg(b): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{b}</svg>\n'
def emit(name, d, dv):
    cx, cy, t = dv
    open(f'{HERE}/{name}.tile.svg','w').write(svg(f'<rect width="256" height="256" fill="{CH}"/><path fill="{OW}" d="{d}"/>{divide(cx,cy,t,SAGE)}'))
    open(f'{HERE}/{name}.mark.svg','w').write(svg(f'<path fill="{CH}" d="{d}"/>{divide(cx,cy,t,SAGE)}'))
    open(f'{HERE}/{name}.mono.svg','w').write(svg(f'<path fill="{W}" fill-rule="evenodd" d="{d}{divide_holes(cx,cy,t)}"/>'))
def bottom(name, **kw):
    p = dict(gen.M1); p.update(kw)
    d, g = gen.m1_outline(p)
    cx, cy = gen.m1_divide_centre(g, p)
    cy += kw.get('dy', 0)
    print(name, 'W', g['W'], 'bbox', g['bbox'], 'maxr', round(g['maxr'],1), 'div', cx, cy)
    emit(name, d, (cx, cy, p['t']))
bottom('m1-a-current')
bottom('m1-b-r14-t11', rc=14, t=11.5, body=104, top=58)
bottom('m1-c-4teeth', teeth=4, td=15, rc=18, t=12, body=96, top=60, cx=134)
bottom('m1-e-7fine', teeth=7, td=9, rc=12, t=12, body=100, top=62, cx=133)

# d: torn edge on top, clean rounded bottom with the tail at bottom-left
def top_torn(name, teeth=5, td=12, rc=24, body=100, cx=133, yT=70, t=12, tail=34, out=0):
    n = teeth
    Wd = 2 * n * td
    xL, xR = cx - Wd/2, cx + Wd/2
    yB = yT + body
    d = [f'M{f(xL)} {f(yT)}']
    x = xL
    for _ in range(n):
        d.append(f'L{f(x+td)} {f(yT-td)}'); d.append(f'L{f(x+2*td)} {f(yT)}'); x += 2*td
    d.append(f'V{f(yB-rc)}A{f(rc)} {f(rc)} 0 0 1 {f(xR-rc)} {f(yB)}')
    d.append(f'H{f(xL+tail)}L{f(xL-out)} {f(yB+tail)}Z')
    emit(name, ''.join(d), (cx, (yT - td/2 + yB)/2, t))
top_torn('m1-d-toptorn')
