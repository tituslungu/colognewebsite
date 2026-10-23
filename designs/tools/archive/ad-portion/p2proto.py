import os, math, json, sys
P='/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-portion/proto/'
TILE='<rect width="256" height="256" fill="#2D2D2D"/>'
def rrect(x0,y0,x1,y1,r):
    return f"M{x0+r},{y0}H{x1-r}A{r},{r} 0 0 1 {x1},{y0+r}V{y1-r}A{r},{r} 0 0 1 {x1-r},{y1}H{x0+r}A{r},{r} 0 0 1 {x0},{y1-r}V{y0+r}A{r},{r} 0 0 1 {x0+r},{y0}Z"
def gen(s):
    x0,y0,x1,y1,r=s['box']
    bub=rrect(x0,y0,x1,y1,r)+'M'+'L'.join(f'{a},{b}' for a,b in s['tail'])+'Z'
    cx=(x0+x1)/2
    lines=[]
    for (y,deg) in s['cuts']:
        t=math.tan(math.radians(deg))
        lines.append(((cx-600, y+t*600),(cx+600, y-t*600)))  # +deg: rises to the right
    far=[((-2000,-2000),(2000,-2000))]+lines+[((-2000,2000),(2000,2000))]
    regs=[[a[0],a[1],b[1],b[0]] for a,b in zip(far,far[1:])]
    def build(mode,tile=False,sc=1):
        m={'mark':lambda c:c,'app':lambda c:'#FAFAF8' if c=='#2D2D2D' else c,'mono':lambda c:'#FFFFFF','site':lambda c:'#FFFFFF' if c=='#2D2D2D' else ('#8CC4A5' if c=='#6FAF8E' else c)}[mode]
        cl=''.join(f'<clipPath id="c{i}"><path d="M'+'L'.join(f'{p[0]},{p[1]}' for p in rg)+'Z"/></clipPath>' for i,rg in enumerate(regs))
        strokes=''.join(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="#000" stroke-width="{s["gap"]}"/>' for a,b in lines)
        parts=''.join(f'<path fill="{m(s["colors"][i])}" d="{bub}" clip-path="url(#c{i})"/>' for i in range(len(regs)))
        tr=f'transform="translate(128 128) scale({sc}) translate(-128 -128)"'
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{TILE if tile else ""}<defs>{cl}<mask id="m" maskUnits="userSpaceOnUse" x="-500" y="-500" width="1300" height="1300"><rect x="-500" y="-500" width="1300" height="1300" fill="#fff"/>{strokes}</mask></defs><g {tr}><g mask="url(#m)">{parts}</g></g></svg>'
    d=P+s['name']+'/'; os.makedirs(d,exist_ok=True)
    for f,a in [('mark.svg',('mark',)),('mark-mono.svg',('mono',)),('app-icon.svg',('app',True,s.get('appScale',0.8))),('site-icon.svg',('site',))]:
        open(d+f,'w').write(build(*a))
for s in json.load(open(sys.argv[1])): gen(s)
