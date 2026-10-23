"""letter-1 (Obelus D), art-directed pass. Every coordinate is computed here.
System (H = height of the D):
  D        width 0.885H (Helvetica Neue Bold D), semicircular bowl r = 0.5H, stem-side corners 0.07H
  divide   bar 0.40H x 0.12H (round ends), dots d = 0.19H, dot-to-bar gap 0.085H -> dot centres +-0.24H
           centred at x = 0.4425H (middle of the D's box). Bar leaves 0.24H of solid on both sides.
  16px     separate pixel-snapped optical size (favicon.svg)."""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from glyphs import f, P, rr_right, circle, pill, rect
OUT = sys.argv[1] if len(sys.argv) > 1 else '/Users/titus/repos/colognewebsite/designs/logos/letter-1'
OPT = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
os.makedirs(OUT, exist_ok=True)
SAGE='#6FAF8E'; CH='#2D2D2D'; WHITE='#FFFFFF'
def svg(w, h, body): return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" role="img" aria-label="Divi">'
                             f'<title>Divi</title>{body}</svg>\n')
def write(name, s): open(os.path.join(OUT, name), 'w').write(s)

S = dict(w=0.885, cl=0.07, t=0.12, dr=0.095, doff=0.24, bl=0.40, ox=0.4425)
S.update(OPT.get('S', {}))
def obelus(x0, y0, H):
    w = S['w']*H
    D = rr_right(x0, y0, w, H, 0.5*H, S['cl']*H)
    cx = x0 + S['ox']*H; cy = y0 + H/2
    t = S['t']*H; bl = S['bl']*H; dr = S['dr']*H; off = S['doff']*H
    dv = ' '.join([pill(cx-bl/2, cy-t/2, bl, t, ccw=True), circle(cx, cy-off, dr, ccw=True), circle(cx, cy+off, dr, ccw=True)])
    return D + ' ' + dv, w
NUDGE = OPT.get('nudge', 0.02)   # flat stem is heavier than the bowl: shift right of the box centre
def centred(H, box=256):
    return (box - S['w']*H)/2 + NUDGE*H, (box - H)/2

# --- symbol, transparent
H = OPT.get('markH', 188); x, y = centred(H); d, _ = obelus(x, y, H)
write('mark.svg', svg(256, 256, f'<path fill="{SAGE}" fill-rule="evenodd" d="{d}"/>'))
write('mark-mono.svg', svg(256, 256, f'<path fill="{WHITE}" fill-rule="evenodd" d="{d}"/>'))
# --- site icon: white, a little larger in its box (no tile on the photo)
H = OPT.get('siteH', 204); x, y = centred(H); d, _ = obelus(x, y, H)
siteFill = OPT.get('siteFill', WHITE)
write('site-icon.svg', svg(256, 256, f'<path fill="{siteFill}" fill-rule="evenodd" d="{d}"/>'))
# --- app icon / avatar: charcoal tile, sage D, divide cut through to the tile (mirrors the QR-code tile)
H = OPT.get('appH', 168); x, y = centred(H); d, _ = obelus(x, y, H)
write('app-icon.svg', svg(256, 256, f'<rect width="256" height="256" fill="{CH}"/><path fill="{SAGE}" fill-rule="evenodd" d="{d}"/>'))

# --- favicon: 16px optical size on a 16-unit pixel grid (1 px = 16 units)
u = 16
def px(v): return v*u
# D: x 3..14 (11 px), y 2..14 (12 px); bowl radius 6 px; stem corners 1 px
fx0, fy0, fw, fh = 3, 2, 11, 12
D = rr_right(px(fx0), px(fy0), px(fw), px(fh), px(6), px(1))
# divide on the grid: dots 2x2 px at x 7..9; bar 2 px tall y 7..9, x 5..11; 1 px gaps; 2 px solid above/below
fb = OPT.get('favBar', (5, 11))
bar = pill(px(fb[0]), px(7), px(fb[1]-fb[0]), px(2), ccw=True)
dotR = px(1.1)
dots = circle(px(8), px(5), dotR, ccw=True) + ' ' + circle(px(8), px(11), dotR, ccw=True)
write('favicon.svg', svg(256, 256, f'<rect width="256" height="256" rx="{px(3)}" fill="{CH}"/><path fill="{SAGE}" fill-rule="evenodd" d="{D} {bar} {dots}"/>'))

# --- lockup: the symbol IS the D of the wordmark (D÷IVI). Helvetica Neue Bold caps, +0.12em tracking.
K = dict(stem=0.22, Vw=0.884, Vstroke=0.225, Vflat=0.25, gDI=0.32, gIV=0.275, gVI=0.254)
def cap_I(x, base, H): s = K['stem']*H; return rect(x, base-H, s, H), s
def cap_V(x, base, H):
    w = K['Vw']*H; a = K['Vstroke']*H; flat = K['Vflat']*H; y0 = base-H
    dx = (w/2 - flat/2)/H; xl, xr = x+a, x+w-a; yv = y0 + (xr-xl)/(2*dx)
    return f'M{P(x,y0)} H{f(x+a)} L{P(x+w/2,yv)} L{P(x+w-a,y0)} H{f(x+w)} L{P(x+w/2+flat/2,base)} H{f(x+w/2-flat/2)} Z', w
cap = 100; pad = OPT.get('lockPad', 0)
d, sw = obelus(pad, pad, cap)
xx = pad + sw + OPT.get('gDI', K['gDI'])*cap; parts = []
dd, w = cap_I(xx, pad+cap, cap); parts.append(dd); xx += w + K['gIV']*cap
dd, w = cap_V(xx, pad+cap, cap); parts.append(dd); xx += w + K['gVI']*cap
dd, w = cap_I(xx, pad+cap, cap); parts.append(dd); xx += w
W = xx + pad; Hh = cap + 2*pad
ivi = ' '.join(parts)
write('lockup.svg', svg(W, Hh, f'<path fill="{SAGE}" fill-rule="evenodd" d="{d}"/><path fill="{CH}" d="{ivi}"/>'))
write('lockup-reverse.svg', svg(W, Hh, f'<path fill="{SAGE}" fill-rule="evenodd" d="{d}"/><path fill="{WHITE}" d="{ivi}"/>'))
write('lockup-mono.svg', svg(W, Hh, f'<path fill="{WHITE}" fill-rule="evenodd" d="{d} {ivi}"/>'))
print('written to', OUT)
