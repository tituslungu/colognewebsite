import json, os
from geo import f
G = json.load(open(os.path.join(os.path.dirname(__file__), 'glyphs.json')))
CAP = 714
def glyph_d(ch, s, ox, oy):
    """ox = pen x (font units origin) in output; oy = baseline y in output"""
    T = lambda p: (ox + p[0]*s, oy - p[1]*s)
    d = []; cur = None
    for op, args in G[ch]['rec']:
        if op == 'moveTo':
            x, y = T(args[0]); d.append(f"M{f(x)} {f(y)}"); cur = args[0]
        elif op == 'lineTo':
            x, y = T(args[0]); d.append(f"L{f(x)} {f(y)}"); cur = args[0]
        elif op == 'qCurveTo':
            pts = list(args); on = pts[-1]; offs = pts[:-1]
            for i, c in enumerate(offs):
                if i < len(offs) - 1:
                    n = offs[i+1]; e = ((c[0]+n[0])/2, (c[1]+n[1])/2)
                else:
                    e = on
                cx, cy = T(c); ex, ey = T(e); d.append(f"Q{f(cx)} {f(cy)} {f(ex)} {f(ey)}")
        elif op == 'closePath':
            d.append('Z')
    return ''.join(d)
def wordmark(x, baseline, cap_px, track=0.12):
    """DIVI with Helvetica Neue Bold outlines; x = left of D's ink. returns (d, right_ink_x)"""
    s = cap_px / CAP
    pen = x - 69*s  # D lsb 69
    ds = []
    for i, ch in enumerate('DIVI'):
        ds.append(glyph_d(ch, s, pen, baseline))
        if i < 3: pen += (G[ch]['adv'] + 1000*track) * s
    right = pen + 226*s  # I right ink
    return ''.join(ds), right
