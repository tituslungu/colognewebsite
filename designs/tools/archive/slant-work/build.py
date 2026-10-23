"""Primitive-based logo builder. Geometry in design units; output with clean absolute coords."""
import math, os
from geo import f
from word import wordmark, CAP

SAGE='#6FAF8E'; CHAR='#2D2D2D'; OFF='#FAFAF8'; WHITE='#FFFFFF'

def C(cx, cy, r, role): return ('c', (cx, cy), r, role)
def P(pts, radii, role): return ('p', list(pts), radii, role)

def rot(p, c, a):
    t=math.radians(a); co, si = math.cos(t), math.sin(t)
    dx, dy = p[0]-c[0], p[1]-c[1]
    return (c[0]+dx*co-dy*si, c[1]+dx*si+dy*co)

def fillet(pts, radii):
    """return list of (a, b, center, r, sweep) per vertex for rounded polygon"""
    n=len(pts); rs = radii if isinstance(radii,(list,tuple)) else [radii]*n; out=[]
    for i in range(n):
        p0=pts[i-1]; p1=pts[i]; p2=pts[(i+1)%n]; r=rs[i]
        v1=(p0[0]-p1[0],p0[1]-p1[1]); v2=(p2[0]-p1[0],p2[1]-p1[1])
        l1=math.hypot(*v1); l2=math.hypot(*v2)
        u1=(v1[0]/l1,v1[1]/l1); u2=(v2[0]/l2,v2[1]/l2)
        ang=math.acos(max(-1,min(1,u1[0]*u2[0]+u1[1]*u2[1])))
        if not r: out.append((p1,p1,None,0,0)); continue
        t=r/math.tan(ang/2); h=r/math.sin(ang/2)
        a=(p1[0]+u1[0]*t,p1[1]+u1[1]*t); b=(p1[0]+u2[0]*t,p1[1]+u2[1]*t)
        bis=(u1[0]+u2[0],u1[1]+u2[1]); bl=math.hypot(*bis); c=(p1[0]+bis[0]/bl*h,p1[1]+bis[1]/bl*h)
        cross=u1[0]*u2[1]-u1[1]*u2[0]
        out.append((a,b,c,r,1 if cross<0 else 0))
    return out

def xf(p, T): s,tx,ty=T; return (p[0]*s+tx, p[1]*s+ty)

def prim_d(pr, T=(1,0,0)):
    s=T[0]
    if pr[0]=='c':
        (cx,cy),r=xf(pr[1],T),pr[2]*s
        return f"M{f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx-r)} {f(cy)}Z"
    pts=[xf(p,T) for p in pr[1]]; radii=pr[2]
    radii=[r*s for r in radii] if isinstance(radii,(list,tuple)) else radii*s
    d=[]
    for a,b,c,r,sw in fillet(pts,radii):
        if r==0: d.append(("L" if d else "M")+f"{f(a[0])} {f(a[1])}")
        else:
            d.append(("L" if d else "M")+f"{f(a[0])} {f(a[1])}")
            d.append(f"A{f(r)} {f(r)} 0 0 {sw} {f(b[0])} {f(b[1])}")
    return "".join(d)+"Z"

def samples(pr):
    if pr[0]=='c':
        (cx,cy),r=pr[1],pr[2]; return [(cx+r*math.cos(k*math.pi/90), cy+r*math.sin(k*math.pi/90)) for k in range(180)]
    out=[]
    for a,b,c,r,sw in fillet(pr[1],pr[2]):
        if r==0: out.append(a); continue
        a0=math.atan2(a[1]-c[1],a[0]-c[0]); a1=math.atan2(b[1]-c[1],b[0]-c[0])
        da=a1-a0
        while da>math.pi: da-=2*math.pi
        while da<-math.pi: da+=2*math.pi
        for k in range(21): t=a0+da*k/20; out.append((c[0]+r*math.cos(t),c[1]+r*math.sin(t)))
    return out

def bbox(prims):
    pts=[p for pr in prims for p in samples(pr)]
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    return min(xs),min(ys),max(xs),max(ys)

def maxrad(prims, c):
    return max(math.hypot(p[0]-c[0],p[1]-c[1]) for pr in prims for p in samples(pr))

def body(prims, colors, T=(1,0,0)):
    # merge same-colour prims into one path
    groups={}
    order=[]
    for pr in prims:
        col=colors[pr[3]]
        if col not in groups: groups[col]=[]; order.append(col)
        groups[col].append(prim_d(pr,T))
    return ''.join(f'<path fill="{c}" d="{"".join(groups[c])}"/>' for c in order)

def svgdoc(inner, vb, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{label}">\n'
            f'<title>{label}</title>\n{inner}\n</svg>\n')

def fitT(prims, box, center, offset=(0,0)):
    """scale+translate so bbox max side = box, bbox centre at center (+offset in output units)"""
    x0,y0,x1,y1=bbox(prims); s=box/max(x1-x0,y1-y0)
    cx,cy=(x0+x1)/2,(y0+y1)/2
    return (s, center[0]+offset[0]-cx*s, center[1]+offset[1]-cy*s)

def write_concept(cid, prims, *, mark_box=224, icon_rad=100, icon_off=(0,0), mark_off=(0,0),
                  site='tile', lock_h=None, lock_gap=None, lock_cap=100, lock_dy=0, label='Divi',
                  diner_light=CHAR, diner_dark=OFF, tile=CHAR, table=SAGE, extra=None):
    d=f'/Users/titus/repos/colognewebsite/designs/logos/{cid}'
    os.makedirs(d, exist_ok=True)
    light={'table':table,'diner':diner_light}; dark={'table':table,'diner':diner_dark}
    mono={'table':WHITE,'diner':WHITE}
    if extra: light.update(extra.get('light',{})); dark.update(extra.get('dark',{})); mono.update({k:WHITE for k in extra.get('light',{})})
    # mark
    Tm=fitT(prims, mark_box, (128,128), mark_off)
    open(f'{d}/mark.svg','w').write(svgdoc(body(prims,light,Tm),'0 0 256 256',f'{label} mark'))
    open(f'{d}/mark-reverse.svg','w').write(svgdoc(body(prims,dark,Tm),'0 0 256 256',f'{label} mark, for dark backgrounds'))
    open(f'{d}/mark-mono.svg','w').write(svgdoc(body(prims,mono,Tm),'0 0 256 256',f'{label} mark, white'))
    # app icon: fit by max radius from bbox centre
    x0,y0,x1,y1=bbox(prims); c=((x0+x1)/2,(y0+y1)/2); R=maxrad(prims,c); s=icon_rad/R
    Ti=(s,128+icon_off[0]-c[0]*s,128+icon_off[1]-c[1]*s)
    open(f'{d}/app-icon.svg','w').write(svgdoc(f'<rect width="256" height="256" fill="{tile}"/>'+body(prims,dark,Ti),'0 0 256 256',f'{label} app icon'))
    if site=='mono':
        open(f'{d}/site-icon.svg','w').write(svgdoc(body(prims,mono,Tm),'0 0 256 256',f'{label} site icon'))
    elif site=='reverse':
        open(f'{d}/site-icon.svg','w').write(svgdoc(body(prims,dark,Tm),'0 0 256 256',f'{label} site icon'))
    elif site=='tile':
        if os.path.exists(f'{d}/site-icon.svg'): os.remove(f'{d}/site-icon.svg')
    # lockups
    capH=lock_cap; markH=lock_h or capH*1.5
    x0,y0,x1,y1=bbox(prims); s=markH/(y1-y0)
    pad=8
    Tl=(s, pad-x0*s, pad+ (capH*1.0) - (y0+y1)/2*s + 0*lock_dy)
    # vertical: centre mark on cap-height middle; baseline at pad+ (markH+capH)/2 region
    top=pad; midY=top+max(markH,capH)/2
    Tl=(s, pad-x0*s, midY-(y0+y1)/2*s+lock_dy)
    mw=(x1-x0)*s; gap=lock_gap if lock_gap is not None else capH*0.62
    base=midY+capH/2
    wd,right=wordmark(pad+mw+gap, base, capH)
    W=right+pad; H=max(markH,capH)+2*pad
    vb=f'0 0 {f(W)} {f(H)}'
    open(f'{d}/lockup.svg','w').write(svgdoc(body(prims,light,Tl)+f'<path fill="{CHAR}" d="{wd}"/>',vb,label))
    darkL=dict(dark); darkL['diner']=WHITE
    open(f'{d}/lockup-reverse.svg','w').write(svgdoc(body(prims,darkL,Tl)+f'<path fill="{WHITE}" d="{wd}"/>',vb,f'{label}, for dark backgrounds'))
    return d
