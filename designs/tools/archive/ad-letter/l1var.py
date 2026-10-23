import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from glyphs import f, P, rr_right, circle, pill
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
for n in os.listdir(OUT): os.remove(os.path.join(OUT, n))
SAGE='#6FAF8E'; CH='#2D2D2D'; WHITE='#FFFFFF'
def svg(body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{body}</svg>\n'
def obelus(x0, y0, H, p):
    w = p['w']*H; r = 0.5*H; cl = p['cl']*H
    D = rr_right(x0, y0, w, H, r, cl)
    cx = x0 + p['ox']*H; cy = y0 + H/2
    t = p['t']*H; bl = p['bl']*H; dr = p['dr']*H; off = p['doff']*H
    dv = ' '.join([pill(cx-bl/2, cy-t/2, bl, t, ccw=True), circle(cx, cy-off, dr, ccw=True), circle(cx, cy+off, dr, ccw=True)])
    return D + ' ' + dv, w
def place(H, p, box=256):
    w = p['w']*H; return (box-w)/2 + p.get('nudge', 0.02)*H, (box-H)/2
base = dict(w=0.885, cl=0.07, t=0.125, dr=0.09, doff=0.25, bl=0.47, ox=0.4425)
V = json.loads(sys.argv[2])
for name, over in V.items():
    p = dict(base); p.update(over)
    H = 188; x, y = place(H, p); d, _ = obelus(x, y, H, p)
    open(f'{OUT}/{name}-mark.svg','w').write(svg(f'<path fill="{SAGE}" fill-rule="evenodd" d="{d}"/>'))
    H = 200; x, y = place(H, p); d, _ = obelus(x, y, H, p)
    open(f'{OUT}/{name}-mono.svg','w').write(svg(f'<path fill="{WHITE}" fill-rule="evenodd" d="{d}"/>'))
    H = p.get('appH', 160); x, y = place(H, p); d, _ = obelus(x, y, H, p)
    open(f'{OUT}/{name}-app.svg','w').write(svg(f'<rect width="256" height="256" fill="{CH}"/><path fill="{SAGE}" fill-rule="evenodd" d="{d}"/>'))
print('ok')
