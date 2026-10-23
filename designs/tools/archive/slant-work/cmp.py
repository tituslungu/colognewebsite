"""compare variants: python3 cmp.py out.html  (variants defined by modules passed via VARS)"""
from build import *
def sheet(variants, out, icon_rad=100):
    rows=[]
    for name, prims in variants:
        Tm=fitT(prims,224,(128,128)); x0,y0,x1,y1=bbox(prims); c=((x0+x1)/2,(y0+y1)/2); s=icon_rad/maxrad(prims,c)
        Ti=(s,128-c[0]*s,128-c[1]*s)
        light={'table':SAGE,'diner':CHAR,'a':'#3E7A5B','b':'#8CC4A5'}; dark={'table':SAGE,'diner':OFF,'a':'#3E7A5B','b':'#8CC4A5'}
        mono={'table':WHITE,'diner':WHITE,'a':WHITE,'b':WHITE}
        m=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#FAFAF8"/>{body(prims,light,Tm)}</svg>'
        t=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#2D2D2D"/>{body(prims,dark,Ti)}</svg>'
        mo=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#2D2D2D"/>{body(prims,mono,Tm)}</svg>'
        rows.append(f'<div class="row"><div class="n">{name}</div><div class="b">{m}</div><div class="b r">{t}</div><div class="b">{mo}</div>'
                    f'<div class="s40 r">{t}</div><div class="s16">{t}</div><div class="s16">{m}</div><div class="s32">{t}</div></div>')
    html='''<!doctype html><meta charset=utf-8><style>body{margin:0;padding:16px;background:#f2f3f1;font:600 13px Helvetica}
    .row{display:flex;gap:14px;align-items:center;margin-bottom:12px}.n{width:110px}
    .b svg{width:150px;height:150px;display:block}.r svg{border-radius:50%}
    .s40 svg{width:40px;height:40px;display:block}.s16 svg{width:16px;height:16px;display:block;border-radius:3px}
    .s32 svg{width:32px;height:32px;display:block;border-radius:6px}</style>'''+''.join(rows)
    open(out,'w').write(html)
