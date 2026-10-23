import math, os
os.chdir('s3')
def D(name, H=160, aw=0.36, g=18, d=26, dotx_f=0.5, cut=(0,256), tile="#2D2D2D", fill="#6FAF8E", shift=3, rc=12, two=None, dots=True):
    r=H/2; a=aw*H; W=a+r
    x0=128-W/2+shift; y0=128-H/2; xs=x0+a; cy=128
    dpath=f"M{x0+rc} {y0} H{xs} A{r} {r} 0 0 1 {xs} {y0+H} H{x0+rc} A{rc} {rc} 0 0 1 {x0} {y0+H-rc} V{y0+rc} A{rc} {rc} 0 0 1 {x0+rc} {y0} Z"
    dotx=x0+W*dotx_f; hh=(H-g)/2
    cx0,cx1=cut
    cutrect=f'<rect x="{cx0}" y="{cy-g/2}" width="{cx1-cx0}" height="{g}" rx="{g/2 if cx1-cx0<200 else 0}" fill="#000"/>'
    dd=f'<circle cx="{dotx}" cy="{cy-g/2-hh/2}" r="{d/2}" fill="#000"/><circle cx="{dotx}" cy="{cy+g/2+hh/2}" r="{d/2}" fill="#000"/>' if dots else ''
    t=f'<rect width="256" height="256" fill="{tile}"/>' if tile else ''
    body=f'<path d="{dpath}" fill="{fill}" mask="url(#m)"/>'
    if two:
        body=f'<g mask="url(#m)"><path d="{dpath}" fill="{two[1]}"/><rect x="0" y="0" width="256" height="128" fill="{two[0]}" clip-path="url(#c)"/></g><clipPath id="c"><path d="{dpath}"/></clipPath>'
    open(name,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{t}<mask id="m"><rect width="256" height="256" fill="#fff"/>{cutrect}{dd}</mask>{body}</svg>')
D('a-mid.svg')
D('b-stemdots.svg', dotx_f=0.36)
D('c-small.svg', d=22, g=16)
D('d-stencil.svg', cut=(128-3-40,128-3+46), g=18)
D('e-cutleft.svg', cut=(0,170))
D('f-cutright.svg', cut=(96,256))
D('g-twotone.svg', two=("#FAFAF8","#6FAF8E"))
D('h-nodots.svg', dots=False, g=20)
D('i-white.svg', fill="#FAFAF8")
D('j-lighttile.svg', tile="#ECEBE8", fill="#2D2D2D")
D('k-light-sage.svg', tile="#FAFAF8", fill="#6FAF8E")
D('l-bigdot.svg', d=34, g=20)
