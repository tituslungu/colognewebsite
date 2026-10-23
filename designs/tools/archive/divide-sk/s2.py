import math
def splitD(name, H=168, aw=0.3, g=18, d=28, dotfx=None, tile="#2D2D2D", fill="#6FAF8E", shift=4, rc=0, extra=''):
    r=H/2; a=aw*H; W=a+r
    x0=128-W/2+shift; y0=128-H/2; xs=x0+a; cy=128
    if rc:
        dpath=f"M{x0+rc} {y0} H{xs} A{r} {r} 0 0 1 {xs} {y0+H} H{x0+rc} A{rc} {rc} 0 0 1 {x0} {y0+H-rc} V{y0+rc} A{rc} {rc} 0 0 1 {x0+rc} {y0} Z"
    else:
        dpath=f"M{x0} {y0} H{xs} A{r} {r} 0 0 1 {xs} {y0+H} H{x0} Z"
    dotx = xs if dotfx is None else x0+W*dotfx
    hh=(H-g)/2
    t=f'<rect width="256" height="256" fill="{tile}"/>' if tile else ''
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{t}
<mask id="m"><rect width="256" height="256" fill="#fff"/><rect x="0" y="{cy-g/2}" width="256" height="{g}" fill="#000"/>
<circle cx="{dotx}" cy="{cy-g/2-hh/2}" r="{d/2}" fill="#000"/><circle cx="{dotx}" cy="{cy+g/2+hh/2}" r="{d/2}" fill="#000"/></mask>
<path d="{dpath}" fill="{fill}" mask="url(#m)"/>{extra}</svg>'''
    open(name,'w').write(svg)
splitD('1a-dots-bowlcentre.svg')
splitD('1b-dots-mid.svg', dotfx=0.5)
splitD('1c-wide.svg', H=160, aw=0.42, dotfx=0.5, shift=3)
splitD('1d-biggap.svg', g=24, d=30, dotfx=0.5)
splitD('1e-sagetile.svg', tile="#6FAF8E", fill="#FAFAF8", dotfx=0.5)
splitD('1f-lighttile.svg', tile="#FAFAF8", fill="#2D2D2D", dotfx=0.5)
splitD('1g-deeptile.svg', tile="#24382E", fill="#8CC4A5", dotfx=0.5)
splitD('1h-rc.svg', dotfx=0.5, rc=14)

def plates(name, pr=34, rim=True, food=('dot','wave'), bar="#6FAF8E", bw=140, bt=20, gap=None, tile="#2D2D2D", plate="#FAFAF8", foodc="#6FAF8E"):
    cy1=128-bt/2-(gap if gap else 18)-pr; cy2=256-cy1
    out=f'<rect width="256" height="256" fill="{tile}"/>'
    for cy,f in ((cy1,food[0]),(cy2,food[1])):
        out+=f'<circle cx="128" cy="{cy}" r="{pr}" fill="{plate}"/>'
        if rim: out+=f'<circle cx="128" cy="{cy}" r="{pr*0.66:.1f}" fill="none" stroke="#2D2D2D" stroke-opacity=".14" stroke-width="{max(2,pr*0.06):.1f}"/>'
        if f=='dot': out+=f'<circle cx="128" cy="{cy}" r="{pr*0.28:.1f}" fill="{foodc}"/>'
        if f=='dotoff': out+=f'<circle cx="{128+pr*0.22:.1f}" cy="{cy+pr*0.14:.1f}" r="{pr*0.26:.1f}" fill="{foodc}"/>'
        if f=='wave':
            w=pr*0.62; x=128-w/2; amp=pr*0.2
            out+=f'<path d="M{x:.1f} {cy+amp*0.3:.1f} q{w/4:.1f} {-amp*1.6:.1f} {w/2:.1f} 0 t{w/2:.1f} 0" fill="none" stroke="{foodc}" stroke-width="{pr*0.17:.1f}" stroke-linecap="round"/>'
    out+=f'<rect x="{128-bw/2}" y="{128-bt/2}" width="{bw}" height="{bt}" rx="{bt/2}" fill="{bar}"/>'
    open(name,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{out}</svg>')
plates('2a-plates-dotwave.svg')
plates('2b-plates-big.svg', pr=40, bt=22, bw=150, gap=14)
plates('2c-plates-norim.svg', pr=38, rim=False, food=('dot','dot'), gap=14)
plates('2d-plates-whitebar.svg', pr=38, bar="#FAFAF8", gap=14, food=('dotoff','wave'))
plates('2e-plates-sagebg.svg', pr=38, tile="#3E7A5B", bar="#FAFAF8", gap=14, foodc="#6FAF8E")
plates('2f-plates-nofood.svg', pr=38, food=(None,None), gap=14)
