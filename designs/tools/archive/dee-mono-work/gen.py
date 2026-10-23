# Parametric generator for the dee-mono letters. Prints template SVG text.
import math, sys, json

def f(v): 
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return s

TILE = '''    <linearGradient id="tile-g" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%TILE_A%"/>
      <stop offset="1" stop-color="%TILE_B%"/>
    </linearGradient>'''

def wrap(title, comment, d, w, ink):
    x1, y1, x2, y2 = ink
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <title>{title}</title>
  <!-- {comment} -->
  <defs>
{TILE}
    <linearGradient id="ink" x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="%INK_A%"/>
      <stop offset="1" stop-color="%INK_B%"/>
    </linearGradient>
  </defs>
  <rect id="tile" width="256" height="256" fill="url(#tile-g)"/>
  <path d="{d}" fill="none" stroke="url(#ink)" stroke-width="{f(w)}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''

def upper(w=24, R=79, gap=16, rc=25, cx=None, cy=128, dx=0, dy=0, stem_rise=0, end_deg=0, ink=None):
    # stem x so that the gap between stem and the bowl's end cap = gap (bowl ends at apex when end_deg=0)
    # circle centre (cx, cy); stem at sx; end point at angle end_deg past apex toward the right (positive = stops earlier)
    if cx is None: cx = 128 + 10  # placeholder, recomputed by centring below
    sx = cx - w - gap
    st = cy - R - stem_rise
    # corner circle
    ccx = sx + rc
    ccy = cy + math.sqrt((R - rc) ** 2 - (cx - ccx) ** 2)
    k = R / (R - rc)
    px, py = cx + (ccx - cx) * k, cy + (ccy - cy) * k
    a = math.radians(end_deg)
    ex, ey = cx + R * math.sin(a), cy - R * math.cos(a)
    T = lambda x, y: (x + dx, y + dy)
    p = [T(sx, st), T(sx, ccy), T(px, py), T(ex, ey)]
    d = f"M{f(p[0][0])} {f(p[0][1])}V{f(p[1][1])}A{f(rc)} {f(rc)} 0 0 0 {f(p[2][0])} {f(p[2][1])}A{f(R)} {f(R)} 0 1 0 {f(p[3][0])} {f(p[3][1])}"
    return d, dict(sx=sx + dx, st=st + dy, cx=cx + dx, cy=cy + dy, left=sx - w / 2 + dx, right=cx + R + w / 2 + dx, top=min(st, cy - R) - w / 2 + dy, bottom=cy + R + w / 2 + dy)

def lower(w=24, r=48, gap=16, stem_top=48, by=156, bx=128, ink=None):
    sx = bx + r
    xe = sx - w - gap
    ye = by - math.sqrt(r * r - (xe - bx) ** 2)
    d = f"M{f(sx)} {f(stem_top)}V{f(by)}A{f(r)} {f(r)} 0 1 1 {f(xe)} {f(ye)}"
    return d, dict(left=bx - r - w / 2, right=sx + w / 2, top=stem_top - w / 2, bottom=by + r + w / 2)

if __name__ == '__main__':
    kind = sys.argv[1]; params = json.loads(sys.argv[2]); ink = params.pop('ink'); out = sys.argv[3]
    if kind == 'upper':
        d, m = upper(**params)
        t = wrap('Divi - minimal D (uppercase)', 'COMMENT', d, params.get('w', 24), ink)
    else:
        d, m = lower(**params)
        t = wrap('Divi - minimal d (lowercase)', 'COMMENT', d, params.get('w', 24), ink)
    open(out, 'w').write(t)
    print(out, d, json.dumps({k: round(v, 2) for k, v in m.items()}))
