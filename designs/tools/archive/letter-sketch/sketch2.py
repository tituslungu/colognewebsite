import os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
from glyphs import *
OUT = os.path.join(os.path.dirname(__file__), 's2')
for n in os.listdir(OUT): os.remove(os.path.join(OUT,n))
SAGE='#6FAF8E'; CH='#2D2D2D'; W='#FFFFFF'; OFF='#FAFAF8'; DEEP='#24382E'; LS='#8CC4A5'
def svg(body, bg=None):
    b = f'<rect width="256" height="256" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{b}{body}</svg>'
def save(n, s): open(os.path.join(OUT,n),'w').write(s)

def obelus_D(cx, cy, H, w, r, bar_t, bar_l, dot_r, dot_off, shift=0, cl=4, through=False):
    x0 = cx - w/2; y0 = cy - H/2
    d = rr_right(x0, y0, w, H, r, cl)
    ox = cx + shift
    if through:
        return d, (x0, y0, w, H)
    d += ' ' + pill(ox - bar_l/2, cy - bar_t/2, bar_l, bar_t, ccw=True)
    d += ' ' + circle(ox, cy - dot_off, dot_r, ccw=True) + ' ' + circle(ox, cy + dot_off, dot_r, ccw=True)
    return d, (x0,y0,w,H)

# A: round bowl
for name, r, w in [('a-round', 68, 124), ('b-helv', 52, 124), ('c-wide', 70, 136)]:
    H = 140
    d,_ = obelus_D(128+2, 128, H, w, r if r<=H/2 else H/2, 18, 62, 12.5, 34, shift=4)
    save(f'L1{name}-charcoal.svg', svg(f'<path fill-rule="evenodd" d="{d}" fill="{SAGE}"/>', CH))
d,_ = obelus_D(130, 128, 140, 124, 68, 18, 62, 12.5, 34, shift=4)
save('L1a-round-white.svg', svg(f'<path fill-rule="evenodd" d="{d}" fill="{CH}"/>', OFF))
save('L1a-round-sagetile.svg', svg(f'<path fill-rule="evenodd" d="{d}" fill="{W}"/>', SAGE))
save('L1a-round-deep.svg', svg(f'<path fill-rule="evenodd" d="{d}" fill="{SAGE}"/>', DEEP))

# L2a tall tittle d
sw=30; Ro=46; cx=112; by=196
cyb=by-Ro; stx=cx+Ro-sw
dot=sw+4; gap=12; asc=196-176
top=by-176
ring = circle(cx,cyb,Ro) + ' ' + circle(cx,cyb,Ro-sw,ccw=True)
stem = rect(stx, top+dot+gap, sw, by-(top+dot+gap))
save('L2a-tittle-d.svg', svg(f'<path fill-rule="evenodd" d="{ring} {stem}" fill="{W}"/><circle cx="{stx+sw/2}" cy="{top+dot/2}" r="{dot/2}" fill="{SAGE}"/>', CH))

# L2b fraction DI / VI
H=58; s=13; gapx=10
Dd, Dw = cap_D(0,0,H,s,50,24)
Vd, Vw = cap_V(0,0,H,s*1.05,56)
colw = 56; Iw = s
tot = colw + gapx + Iw
x0 = 128 - tot/2
top_base = 128 - 10; bot_base = 128 + 10 + H
def place(d, dx, dy): 
    import re
    # translate by wrapping
    return f'<path d="{d}" transform="translate({f(dx)} {f(dy)})"/>'
body = f'<g fill="{W}">' + place(Dd, x0+(colw-50)/2, top_base) + place(rect(0,-H,s,H), x0+colw+gapx, top_base)
body += place(Vd, x0, bot_base) + place(rect(0,-H,s,H), x0+colw+gapx, bot_base) + '</g>'
body += f'<rect x="{x0-4}" y="{128-3.5}" width="{tot+8}" height="7" rx="3.5" fill="{SAGE}"/>'
save('L2b-fraction.svg', svg(body, CH))

# L2c i-check-i
H=96; s=24; base=180
i1x=62; i2x=170
body = f'<g fill="{W}"><rect x="{i1x}" y="{base-H}" width="{s}" height="{H}" rx="0"/><rect x="{i2x}" y="{base-H}" width="{s}" height="{H}"/></g>'
body += f'<circle cx="{i1x+s/2}" cy="{base-H-30}" r="{s/2+1}" fill="{SAGE}"/><circle cx="{i2x+s/2}" cy="{base-H-30}" r="{s/2+1}" fill="{SAGE}"/>'
body += f'<path d="M{i1x+s+18} {base-58} L{128-2} {base-12} L{i2x-14} {base-H-8}" fill="none" stroke="{W}" stroke-width="{s}" stroke-linecap="butt" stroke-linejoin="miter"/>'
save('L2c-i-check-i.svg', svg(body, CH))

# L2d plate d: bowl = plate ring, sage dot in counter
sw=28; Ro=52; cx=114; by=194; cyb=by-Ro; stx=cx+Ro-sw; top=by-172
ring = circle(cx,cyb,Ro) + ' ' + circle(cx,cyb,Ro-sw,ccw=True)
save('L2d-plate-d.svg', svg(f'<path fill-rule="evenodd" d="{ring} {rect(stx, top, sw, by-top)}" fill="{W}"/><circle cx="{cx}" cy="{cyb}" r="11" fill="{SAGE}"/>', CH))

# L2e lowercase d with i dot right of ascender ("di" ligature: d stem then i sharing a tittle?)
# skip
print('ok')
