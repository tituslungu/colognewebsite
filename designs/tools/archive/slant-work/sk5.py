# boolean sketches rendered with SVG masks (sketch only)
import math
from geo import f
def along(cx,cy,a,t,n=0):
    r=math.radians(a); return (cx+t*math.cos(r)-n*math.sin(r), cy+t*math.sin(r)+n*math.cos(r))
def rr(cx,cy,w,h,r,a): return f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{r}" transform="rotate({a} {cx} {cy})"/>'
def mk(a, L, H, rt, diners, R, ring, sc=1.0):
    # diners: (t, n) n = normal offset of centre (neg = above)
    holes=''.join(f'<circle cx="{x}" cy="{y}" r="{R+ring}" fill="#000"/>' for x,y in [along(128,128,a,t,n) for t,n in diners])
    m=f'<mask id="M{id(diners)}"><rect width="256" height="256" fill="#fff"/>{holes}</mask>'
    table=f'<g mask="url(#M{id(diners)})" fill="TABLE">{rr(128,128,L,H,rt,a)}</g>'
    dots=''.join(f'<circle cx="{x}" cy="{y}" r="{R}" fill="DINER"/>' for x,y in [along(128,128,a,t,n) for t,n in diners])
    return f'<defs>{m}</defs><g transform="translate(128 128) scale({sc}) translate(-128 -128)">{table}{dots}</g>'
def svg(inner, bg, tab, din):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="{bg}"/>{inner.replace("TABLE",tab).replace("DINER",din)}</svg>'
S=[]
S.append(('bite 2 +18', mk(18, 210, 84, 18, [(-50,-30),(50,30)], 28, 10)))
S.append(('bite 2 -18 TR/BL', mk(-18, 210, 84, 18, [(50,-30),(-50,30)], 28, 10)))
S.append(('cut-through 2', mk(-18, 216, 70, 16, [(40,-20),(-40,20)], 30, 10)))
S.append(('bite 3', mk(-18, 216, 80, 18, [(-62,-34),(4,34),(66,-34)], 25, 9)))
S.append(('cut-through 3', mk(-18, 220, 66, 16, [(-60,-22),(0,22),(62,-22)], 26, 9)))
S.append(('bite 5', mk(-18, 216, 84, 18, [(-64,-40),(0,-40),(64,-40),(-32,40),(32,40)], 21, 8)))
S.append(('bite 4 stagger', mk(-18, 214, 84, 18, [(-56,-38),(30,-38),(-28,38),(58,38)], 24, 8)))
rows=[]
for n,inner in S:
    a=svg(inner,'#FAFAF8','#6FAF8E','#2D2D2D'); b=svg(inner.replace('scale(1.0)','scale(0.76)'),'#2D2D2D','#6FAF8E','#FAFAF8'); c=svg(inner,'#2D2D2D','#fff','#fff')
    rows.append(f'<div class=row><div class=n>{n}</div><div class=b>{a}</div><div class="b r">{b}</div><div class=b>{c}</div><div class="s40 r">{b}</div><div class=s16>{b}</div><div class=s16>{a}</div><div class=s32>{b}</div></div>')
open('sk5.html','w').write('''<!doctype html><meta charset=utf-8><style>body{margin:0;padding:16px;background:#f2f3f1;font:600 13px Helvetica}
.row{display:flex;gap:14px;align-items:center;margin-bottom:12px}.n{width:110px}
.b svg{width:150px;height:150px;display:block}.r svg{border-radius:50%}
.s40 svg{width:40px;height:40px;display:block}.s16 svg{width:16px;height:16px;display:block;border-radius:3px}
.s32 svg{width:32px;height:32px;display:block;border-radius:6px}</style>'''+''.join(rows))
