import sys, os
from w1lib import *
from wordmark import wordmark_d
from check2 import bbox
from poly import f
C = dict(char='#2D2D2D', sage='#6FAF8E', white='#FFFFFF', off='#FAFAF8')
def lockup(rounded, stroke_ratio=1.08, gap_cap=0.40, dy=0, **kw):
    pcs, info = build(**kw)
    CAP = 100; stem = 22.0
    s = stem*stroke_ratio/info['h']/2  # stroke W -> stem*ratio
    P, I, A = place(pcs, info, rounded, 0, 0, fit=None)
    P, I = xform(P, I, s, 0, 0); A = [[(x*s, y*s) for x, y in Q] for Q in A]
    x0, y0, x1, y1 = bbox(A)
    pad = 16; base = 0
    # vertical: centre of check bbox on cap middle + dy
    ty = -CAP/2 - (y0+y1)/2 + dy; tx = pad - x0
    P, I = xform(P, I, 1, tx, ty); A = [[(x+tx, y+ty) for x, y in Q] for Q in A]
    x0, y0, x1, y1 = bbox(A)
    wd, ww = wordmark_d(x1 + gap_cap*CAP, 0, CAP)
    top = min(y0, -CAP) - pad; bot = max(y1, 0) + pad; W = x1 + gap_cap*CAP + ww + pad
    vb = f'0 {f(top)} {f(W)} {f(bot-top)}'
    return vb, d_of(P, I, rounded), wd, (x1-x0, y1-y0)
if __name__ == '__main__':
    html = '<body style="margin:0;background:#eee;display:grid;gap:20px;padding:20px">'
    for r, kw in ((False, dict(gap=13, cuts=((-24, 0), (38, 0)))), (True, dict(gap=13, cuts=((-34, 0), (40, 0))))):
        vb, cd, wd, dims = lockup(r, **kw)
        for bg, ink in ((C['off'], C['char']), (C['char'], C['white'])):
            html += f'<div style="background:{bg};padding:30px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" height="140"><path fill="{C["sage"]}" d="{cd}"/><path fill="{ink}" d="{wd}"/></svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" height="40"><path fill="{C["sage"]}" d="{cd}"/><path fill="{ink}" d="{wd}"/></svg></div>'
        print(dims)
    open(sys.argv[1], 'w').write(html)
