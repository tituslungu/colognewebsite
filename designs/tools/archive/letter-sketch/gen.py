"""Generates the letter-1 (Obelus D) and letter-2 (Fraction) concept files.
Every coordinate is computed here; the SVGs are plain paths/rects/circles."""
import os, sys, math, json
sys.path.insert(0, os.path.dirname(__file__))
from glyphs import f, P, rr_right, rr_right_ccw, circle, rect, pill
REPO = json.loads(sys.argv[1]).get('root', '/Users/titus/repos/colognewebsite/designs/logos') if len(sys.argv) > 1 else '/Users/titus/repos/colognewebsite/designs/logos'
SAGE='#6FAF8E'; SAGE_L='#8CC4A5'; SAGE_D='#3E7A5B'; DEEP='#24382E'; CH='#2D2D2D'; OFF='#FAFAF8'; WHITE='#FFFFFF'
OPT = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}

def svg(vb_w, vb_h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(vb_w)} {f(vb_h)}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')
def write(cid, name, s):
    d = os.path.join(REPO, cid); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, name), 'w').write(s)

# ---------- shared caps, Helvetica Neue Bold proportions (measured) ----------
K = dict(stem=0.22, hor=0.185, Dw=0.885, Vw=0.884, Vstroke=0.225, Vflat=0.25,
         gDI=0.32, gIV=0.275, gVI=0.254)
def cap_I(x, base, H, wt=1.0):
    s = K['stem']*H*wt
    return rect(x, base-H, s, H), s
def cap_D(x, base, H, bowl=0.5, wt=1.0):
    """D with round bowl. bowl = outer right-corner radius / H (0.5 = semicircle)."""
    s = K['stem']*H*wt; sh = K['hor']*H*wt; w = K['Dw']*H
    r = bowl*H; y0 = base-H
    outer = rr_right(x, y0, w, H, r)
    sr = s*0.98                     # bowl stroke at its widest = stem
    iw = w - s - sr; ih = H - 2*sh
    ir = min(ih/2, r - (sh+sr)/2)    # keeps the bowl stroke even through the curve
    inner = rr_right_ccw(x+s, y0+sh, iw, ih, ir)
    return outer + ' ' + inner, w
def cap_V(x, base, H, wt=1.0):
    w = K['Vw']*H; a = K['Vstroke']*H*wt; flat = K['Vflat']*H*wt; y0 = base-H
    dx = (w/2 - flat/2)/H
    xl, xr = x+a, x+w-a
    yv = y0 + (xr-xl)/(2*dx)
    d = f'M{P(x,y0)} H{f(x+a)} L{P(x+w/2,yv)} L{P(x+w-a,y0)} H{f(x+w)} L{P(x+w/2+flat/2,base)} H{f(x+w/2-flat/2)} Z'
    return d, w

def wordmark(x, base, H, bowl=0.5):
    """Horizontal DIVI with the site's +0.12em tracking, as one path string. Returns (d, width)."""
    parts = []; cx = x
    d, w = cap_D(cx, base, H, bowl); parts.append(d); cx += w + K['gDI']*H
    d, w = cap_I(cx, base, H); parts.append(d); cx += w + K['gIV']*H
    d, w = cap_V(cx, base, H); parts.append(d); cx += w + K['gVI']*H
    d, w = cap_I(cx, base, H); parts.append(d); cx += w
    return ' '.join(parts), cx - x

# ================= letter-1: Obelus D =================
L1 = dict(bowl=0.5, w=0.885, cl=0.07, t=0.125, dr=0.09, doff=0.25, bl=0.47, ox=0.50)
L1.update(OPT.get('l1', {}))
def obelus(x0, y0, H, knock=True):
    """Returns (d_shape, d_divide) for a D of height H at x0,y0.
    knock=True: one evenodd path with the ÷ cut out. Else: D and ÷ as separate paths."""
    w = L1['w']*H; r = L1['bowl']*H; cl = L1['cl']*H
    D = rr_right(x0, y0, w, H, r, cl)
    cx = x0 + L1['ox']*w; cy = y0 + H/2
    t = L1['t']*H; bl = L1['bl']*H; dr = L1['dr']*H; off = L1['doff']*H
    dv = [pill(cx-bl/2, cy-t/2, bl, t, ccw=knock), circle(cx, cy-off, dr, ccw=knock), circle(cx, cy+off, dr, ccw=knock)]
    return D, ' '.join(dv), w
def l1_files():
    cid = 'letter-1'; T = 'Divi'
    # optical: the flat stem carries more mass than the bowl, so nudge right
    def place(H, box=256, nudge=0.02):
        w = L1['w']*H
        return (box-w)/2 + nudge*H, (box-H)/2
    # mark: sage D, ÷ cut through (works on white, charcoal, deep sage)
    H = 188; x0, y0 = place(H)
    D, dv, _ = obelus(x0, y0, H)
    write(cid, 'mark.svg', svg(256, 256, f'<path fill="{SAGE}" fill-rule="evenodd" d="{D} {dv}"/>', T))
    write(cid, 'mark-mono.svg', svg(256, 256, f'<path fill="{WHITE}" fill-rule="evenodd" d="{D} {dv}"/>', T))
    # app icon: charcoal tile; D sized to clear the inscribed circle
    Ha = OPT.get('appH', 160); x0, y0 = place(Ha)
    D, dv, _ = obelus(x0, y0, Ha)
    style = OPT.get('appStyle', 'sageD')
    if style == 'sageD':
        body = f'<rect width="256" height="256" fill="{CH}"/><path fill="{SAGE}" fill-rule="evenodd" d="{D} {dv}"/>'
    elif style == 'whiteD':
        D2, dv2, _ = obelus(x0, y0, Ha, knock=False)
        body = f'<rect width="256" height="256" fill="{CH}"/><path fill="{OFF}" d="{D2}"/><path fill="{SAGE}" d="{dv2}"/>'
    elif style == 'sageTile':
        body = f'<rect width="256" height="256" fill="{SAGE}"/><path fill="{WHITE}" fill-rule="evenodd" d="{D} {dv}"/>'
    elif style == 'offTile':
        D2, dv2, _ = obelus(x0, y0, Ha, knock=False)
        body = f'<rect width="256" height="256" fill="{OFF}"/><path fill="{CH}" d="{D2}"/><path fill="{SAGE}" d="{dv2}"/>'
    write(cid, 'app-icon.svg', svg(256, 256, body, T))
    # site icon: no tile, sits on the darkened photo
    site = OPT.get('l1site', 'mono')
    Hs = 200; x0, y0 = place(Hs)
    D, dv, _ = obelus(x0, y0, Hs)
    if site == 'mono':
        write(cid, 'site-icon.svg', svg(256, 256, f'<path fill="{WHITE}" fill-rule="evenodd" d="{D} {dv}"/>', T))
    elif site == 'sage':
        write(cid, 'site-icon.svg', svg(256, 256, f'<path fill="{SAGE}" fill-rule="evenodd" d="{D} {dv}"/>', T))
    elif site == 'app':
        p = os.path.join(REPO, cid, 'site-icon.svg')
        if os.path.exists(p): os.remove(p)
    # lockups. Cap height of the word = 100; symbol a step taller so it reads as a symbol.
    capH = 100; symH = OPT.get('lockSymH', 1.32)*capH
    pad = 0
    D, dv, sw = obelus(0, 0, symH)
    gap = OPT.get('lockGap', 0.62)*capH
    base = symH/2 + capH/2          # word centred on the symbol
    wm, ww = wordmark(sw + gap, base, capH, bowl=0.5)
    W = sw + gap + ww
    write(cid, 'lockup.svg', svg(W, symH, f'<path fill="{SAGE}" fill-rule="evenodd" d="{D} {dv}"/><path fill="{CH}" fill-rule="evenodd" d="{wm}"/>', 'Divi'))
    write(cid, 'lockup-reverse.svg', svg(W, symH, f'<path fill="{SAGE}" fill-rule="evenodd" d="{D} {dv}"/><path fill="{WHITE}" fill-rule="evenodd" d="{wm}"/>', 'Divi'))
    # integrated wordmark: the symbol stands in for the D
    D, dv, sw = obelus(0, 0, capH)
    x = sw + K['gDI']*capH
    parts = []
    d, w = cap_I(x, capH, capH); parts.append(d); x += w + K['gIV']*capH
    d, w = cap_V(x, capH, capH); parts.append(d); x += w + K['gVI']*capH
    d, w = cap_I(x, capH, capH); parts.append(d); x += w
    write(cid, 'wordmark.svg', svg(x, capH, f'<path fill="{SAGE}" fill-rule="evenodd" d="{D} {dv}"/><path fill="{CH}" d="{" ".join(parts)}"/>', 'Divi'))

# ================= letter-2: Fraction (DI over VI) =================
L2 = dict(gap=0.26, rowgap=0.21, bar=0.16, over=0.10, bowl=0.5, wt=1.12)
L2.update(OPT.get('l2', {}))
def fraction(cx, cy, H, nudge=0.0):
    """DI / bar / VI centred on (cx,cy). Returns (letters_d, bar_d, (bw,bh))."""
    wt = L2['wt']; s = K['stem']*H*wt; colw = max(K['Dw'], K['Vw'])*H; g = L2['gap']*H
    bw = colw + g + s
    rg = L2['rowgap']*H; bt = L2['bar']*H
    bh = 2*H + 2*rg + bt
    x0 = cx - bw/2 + nudge*H; y0 = cy - bh/2
    top_base = y0 + H; bot_base = y0 + bh
    parts = []
    d, _ = cap_D(x0 + (colw - K['Dw']*H)/2, top_base, H, L2['bowl'], wt); parts.append(d)
    d, _ = cap_I(x0 + colw + g, top_base, H, wt); parts.append(d)
    d, _ = cap_V(x0 + (colw - K['Vw']*H)/2, bot_base, H, wt); parts.append(d)
    d, _ = cap_I(x0 + colw + g, bot_base, H, wt); parts.append(d)
    ov = L2['over']*H
    bar = pill(x0 - ov, y0 + H + rg, bw + 2*ov, bt)
    return ' '.join(parts), bar, (bw + 2*ov, bh)
def l2_files():
    cid = 'letter-2'; T = 'Divi'
    nud = OPT.get('l2nudge', 0.03)   # D and V carry the mass on the left; nudge the block right
    # mark: the round badge is the symbol (it is how people meet Divi in a chat list)
    Ha = OPT.get('l2appH', 72)
    L, B, _ = fraction(128, 128, Ha, nud)
    badge = f'<circle cx="128" cy="128" r="128" fill="{CH}"/><path fill="{OFF}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/>'
    write(cid, 'mark.svg', svg(256, 256, badge, T))
    # mono: the fraction alone in white (on the photo / charcoal the disc is not needed)
    H = OPT.get('l2markH', 84)
    L, B, _ = fraction(128, 128, H, nud)
    write(cid, 'mark-mono.svg', svg(256, 256, f'<path fill="{WHITE}" fill-rule="evenodd" d="{L} {B}"/>', T))
    # app icon: charcoal tile, block kept inside the inscribed circle (corner distance ~107 of 128)
    Ha = OPT.get('l2appH', 72)
    L, B, _ = fraction(128, 128, Ha, nud)
    write(cid, 'app-icon.svg', svg(256, 256, f'<rect width="256" height="256" fill="{CH}"/><path fill="{OFF}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/>', T))
    # favicon: square tabs are never circle-cropped, so the block can fill the tile
    Hf = OPT.get('l2favH', 90)
    L, B, _ = fraction(128, 128, Hf, nud*0.5)
    write(cid, 'favicon.svg', svg(256, 256, f'<rect width="256" height="256" fill="{CH}"/><path fill="{OFF}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/>', T))
    # site icon
    site = OPT.get('l2site', 'badge')
    if site == 'white':
        Hs = OPT.get('l2siteH', 92)
        L, B, _ = fraction(128, 128, Hs, nud)
        write(cid, 'site-icon.svg', svg(256, 256, f'<path fill="{WHITE}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/>', T))
    else:
        L, B, _ = fraction(128, 128, Ha, nud)
        write(cid, 'site-icon.svg', svg(256, 256, f'<circle cx="128" cy="128" r="128" fill="{CH}"/><path fill="{OFF}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/>', T))
    # lockup: the round badge (how people meet Divi in a chat list) + horizontal DIVI
    capH = 100; Dc = OPT.get('l2badge', 2.5)*capH; Rc = Dc/2
    Hb = Dc*Ha/256
    L, B, _ = fraction(Rc, Rc, Hb, nud)
    gap = OPT.get('l2lockGap', 0.55)*capH
    wm, ww = wordmark(Dc + gap, Rc + capH/2, capH, bowl=L2['bowl'])
    W = Dc + gap + ww
    for name, ink in (('lockup.svg', CH), ('lockup-reverse.svg', WHITE)):
        disc = CH if ink == CH else '#3A3A3A'
        body = (f'<circle cx="{f(Rc)}" cy="{f(Rc)}" r="{f(Rc)}" fill="{disc}"/>'
                f'<path fill="{OFF}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/>'
                f'<path fill="{ink}" fill-rule="evenodd" d="{wm}"/>')
        write(cid, name, svg(W, Dc, body, 'Divi'))
    # stacked lockup: the fraction is itself a complete wordmark
    Hk = 100
    L, B, (bw, bh) = fraction(0, 0, Hk, 0)
    write(cid, 'wordmark-stacked.svg', svg(bw, bh, f'<g transform="translate({f(bw/2)} {f(bh/2)})"><path fill="{CH}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/></g>', 'Divi'))
    write(cid, 'wordmark-stacked-reverse.svg', svg(bw, bh, f'<g transform="translate({f(bw/2)} {f(bh/2)})"><path fill="{WHITE}" fill-rule="evenodd" d="{L}"/><path fill="{SAGE}" d="{B}"/></g>', 'Divi'))

which = OPT.get('only')
if which in (None, 'l1'): l1_files()
if which in (None, 'l2'): l2_files()
print('generated')
