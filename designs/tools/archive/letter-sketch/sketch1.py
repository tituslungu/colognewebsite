import os, math
OUT = os.path.join(os.path.dirname(__file__), 's1')
SAGE='#6FAF8E'; CH='#2D2D2D'; W='#FFFFFF'; OFF='#FAFAF8'; DEEP='#24382E'
def svg(body, bg=None):
    b = f'<rect width="256" height="256" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{b}{body}</svg>'
def dpath(x0,y0,w,h,r,c=0):
    # D: square-ish left, right corners radius r
    xs = x0+w-r
    return (f'M{x0+c},{y0} H{xs} A{r},{r} 0 0 1 {x0+w},{y0+r} V{y0+h-r} A{r},{r} 0 0 1 {xs},{y0+h} '
            f'H{x0+c} A{c},{c} 0 0 1 {x0},{y0+h-c} V{y0+c} A{c},{c} 0 0 1 {x0+c},{y0} Z')
def save(n, s): open(os.path.join(OUT,n),'w').write(s)

# S1 obelus D, slit fully across, 2 dots, charcoal tile
x0,y0,w,h = 70,60,124,136
r = 62; t=18; dr=13
cy = y0+h/2
mask = f'''<mask id="m"><rect width="256" height="256" fill="#fff"/>
<rect x="0" y="{cy-t/2}" width="256" height="{t}" fill="#000"/>
<circle cx="{x0+w*0.47}" cy="{y0+ (h/2-t/2)/2 + 2}" r="{dr}" fill="#000"/>
<circle cx="{x0+w*0.47}" cy="{y0+h-(h/2-t/2)/2 - 2}" r="{dr}" fill="#000"/></mask>'''
save('s1-obelus-cut.svg', svg(f'<defs>{mask}</defs><path d="{dpath(x0,y0,w,h,r,6)}" fill="{SAGE}" mask="url(#m)"/>', CH))
# S2 obelus internal: slit from inside stem to inside bowl
mask2 = f'''<mask id="m"><rect width="256" height="256" fill="#fff"/>
<rect x="{x0+26}" y="{cy-t/2}" width="{w-52}" height="{t}" rx="{t/2}" fill="#000"/>
<circle cx="{x0+w*0.47+0}" cy="{cy-36}" r="{dr}" fill="#000"/>
<circle cx="{x0+w*0.47}" cy="{cy+36}" r="{dr}" fill="#000"/></mask>'''
save('s2-obelus-inner.svg', svg(f'<defs>{mask2}</defs><path d="{dpath(x0,y0,w,h,r,6)}" fill="{SAGE}" mask="url(#m)"/>', CH))
# S3 split D halves offset
mask3t = f'<clipPath id="t"><rect x="0" y="0" width="256" height="{cy-t/2}"/></clipPath><clipPath id="b"><rect x="0" y="{cy+t/2}" width="256" height="256"/></clipPath>'
save('s3-split-offset.svg', svg(f'<defs>{mask3t}</defs><path d="{dpath(x0-6,y0,w,h,r,6)}" fill="{W}" clip-path="url(#t)"/><path d="{dpath(x0+6,y0,w,h,r,6)}" fill="{SAGE}" clip-path="url(#b)"/>', CH))
# S4 tittle d (lowercase, ascender split off as sage dot)
sw=34; Ro=50; cx=114; by=192 # baseline
cyb = by-Ro
stx = cx+Ro-sw
asc_top = 52
dot_d = 38
gap = 14
stem_top = asc_top + dot_d + gap
ring = f'<path fill-rule="evenodd" d="M{cx-Ro},{cyb} a{Ro},{Ro} 0 1 0 {2*Ro},0 a{Ro},{Ro} 0 1 0 {-2*Ro},0 Z M{cx-Ro+sw},{cyb} a{Ro-sw},{Ro-sw} 0 1 0 {2*(Ro-sw)},0 a{Ro-sw},{Ro-sw} 0 1 0 {-2*(Ro-sw)},0 Z" fill="{W}"/>'
stem = f'<rect x="{stx}" y="{stem_top}" width="{sw}" height="{by-stem_top}" fill="{W}"/>'
dot = f'<circle cx="{stx+sw/2}" cy="{asc_top+dot_d/2}" r="{dot_d/2}" fill="{SAGE}"/>'
save('s4-tittle-d.svg', svg(ring+stem+dot, CH))
# S5 I + V -> angular D
bx=72; bw=30; top=64; bot=192
chev = f'<path d="M{bx+bw+10},{top} L{bx+bw+10+34},{top} L{196},{(top+bot)/2} L{bx+bw+10+34},{bot} L{bx+bw+10},{bot} L{bx+bw+10+0},{bot} L{160},{(top+bot)/2} Z" fill="{SAGE}"/>'
save('s5-i-plus-v.svg', svg(f'<rect x="{bx}" y="{top}" width="{bw}" height="{bot-top}" fill="{W}"/>'+chev, CH))
# S6 segmented D outline (bowl in 3 shares)
st=26
d6 = dpath(x0+st/2,y0+st/2,w-st,h-st,r-st/2,4)
save('s6-segment-d.svg', svg(f'<path d="{d6}" fill="none" stroke="{W}" stroke-width="{st}" stroke-dasharray="none"/>'
  f'<line x1="{x0+w-60}" y1="{y0+30}" x2="{x0+w+20}" y2="{y0-20}" stroke="{CH}" stroke-width="10"/>'
  f'<line x1="{x0+w-40}" y1="{cy}" x2="{x0+w+30}" y2="{cy}" stroke="{CH}" stroke-width="10"/>'
  f'<line x1="{x0+w-60}" y1="{y0+h-30}" x2="{x0+w+20}" y2="{y0+h+20}" stroke="{CH}" stroke-width="10"/>', CH))
# S7 D outline with check in counter
save('s7-d-check.svg', svg(f'<path d="{d6}" fill="none" stroke="{W}" stroke-width="{st}"/>'
  f'<path d="M{x0+36},{cy+2} l18,18 l34,-38" fill="none" stroke="{SAGE}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>', CH))
# S8 D bubble (tail from stem bottom)
save('s8-d-bubble.svg', svg(f'<path d="{dpath(x0,y0,w,h-8,r,0)}" fill="{SAGE}"/><path d="M{x0},{y0+h-40} V{y0+h+14} L{x0+36},{y0+h-8} Z" fill="{SAGE}"/>'
  f'<rect x="{x0+30}" y="{cy-12}" width="{w-70}" height="14" rx="7" fill="{CH}"/>', CH))
# S9 lowercase "divi" dots = typing indicator idea, monogram 'i·i'? -> just the d with ÷ bowl
print('ok')
