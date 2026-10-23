"""Geometry kernel for the round-2 split-bubble concepts (bubble-4/5/6).

Shapes are built the way a designer would in a vector tool: a bubble (circle +
tail), knife cuts drawn as polylines with a fixed gap width, the cut strokes
subtracted, and the remaining connected pieces kept. Booleans run in pyclipper on
finely sampled polygons; on output every run of vertices that lies on one of the
construction circles is written back as a true SVG arc, straight runs as lines.
"""
import math
import sys

sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/pylib')
import pyclipper as pc  # noqa: E402

S = 1000.0          # clipper integer scale
N = 4096            # samples per full circle

CHARCOAL, SAGE, SAGE_L, SAGE_D, DEEP = '#2D2D2D', '#6FAF8E', '#8CC4A5', '#3E7A5B', '#24382E'
OFFWHITE, GRAY, WHITE = '#FAFAF8', '#ECEBE8', '#FFFFFF'


def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def _i(pts):
    return [(int(round(x * S)), int(round(y * S))) for x, y in pts]


def _o(pts):
    return [(x / S, y / S) for x, y in pts]


class Circle:
    def __init__(self, cx, cy, r):
        self.cx, self.cy, self.r = cx, cy, r

    def pts(self, n=N):
        return [(self.cx + self.r * math.cos(2 * math.pi * k / n), self.cy + self.r * math.sin(2 * math.pi * k / n)) for k in range(n)]

    def at(self, deg):
        a = math.radians(deg)
        return (self.cx + self.r * math.cos(a), self.cy + self.r * math.sin(a))

    def moved(self, k, tx, ty):
        return Circle(self.cx * k + tx, self.cy * k + ty, self.r * k)


def arc_pts(c, a0, a1, n=N):
    """Points on circle c from angle a0 to a1 (degrees, screen coords, y down)."""
    steps = max(2, int(abs(a1 - a0) / 360 * n))
    return [c.at(a0 + (a1 - a0) * i / steps) for i in range(steps + 1)]


def _norm(poly):
    q = _i(poly)
    return q if pc.Orientation(q) else q[::-1]


def _clip(op, subj, clip):
    p = pc.Pyclipper()
    for s in subj:
        p.AddPath(_norm(s), pc.PT_SUBJECT, True)
    for c in clip:
        p.AddPath(_norm(c), pc.PT_CLIP, True)
    return [_o(r) for r in p.Execute(op, pc.PFT_NONZERO, pc.PFT_NONZERO)]


def union(*polys):
    return _clip(pc.CT_UNION, list(polys), [])


def diff(subj, clip):
    return _clip(pc.CT_DIFFERENCE, subj, clip)


def inter(subj, clip):
    return _clip(pc.CT_INTERSECTION, subj, clip)


def stroke(points, width, end='butt'):
    """A knife cut: the polyline stroked at `width` with mitred joins."""
    o = pc.PyclipperOffset(miter_limit=20)
    et = {'butt': pc.ET_OPENBUTT, 'square': pc.ET_OPENSQUARE, 'round': pc.ET_OPENROUND}[end]
    o.AddPath(_i(points), pc.JT_MITER, et)
    return [_o(r) for r in o.Execute(width / 2 * S)]


def ext(p, q, by=200.0):
    """Point beyond q along p->q (to run a cut cleanly off the shape)."""
    dx, dy = q[0] - p[0], q[1] - p[1]
    L = math.hypot(dx, dy)
    return (q[0] + dx / L * by, q[1] + dy / L * by)


def cut(shape, cuts):
    """Subtract every cut stroke from shape; return pieces (outer contours)."""
    knife = []
    for c in cuts:
        knife += c
    return diff(shape, knife)


def area(poly):
    a = 0.0
    for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
        a += x0 * y1 - x1 * y0
    return a / 2


def centroid(poly):
    a = area(poly)
    cx = cy = 0.0
    for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
        k = x0 * y1 - x1 * y0
        cx += (x0 + x1) * k
        cy += (y0 + y1) * k
    return (cx / (6 * a), cy / (6 * a))


def contains(poly, pt):
    return pc.PointInPolygon(_i([pt])[0], _i(poly)) != 0


def which(pieces, pt):
    for i, p in enumerate(pieces):
        if contains(p, pt):
            return i
    return min(range(len(pieces)), key=lambda i: math.hypot(centroid(pieces[i])[0] - pt[0], centroid(pieces[i])[1] - pt[1]))


def move(poly, dx, dy):
    return [(x + dx, y + dy) for x, y in poly]


def xform(poly, k, tx, ty):
    return [(x * k + tx, y * k + ty) for x, y in poly]


def bbox(polys):
    xs = [x for p in polys for x, _ in p]
    ys = [y for p in polys for _, y in p]
    return min(xs), min(ys), max(xs), max(ys)


def max_radius(polys, c=(128, 128)):
    return max(math.hypot(x - c[0], y - c[1]) for p in polys for x, y in p)


def to_path(poly, circles, tol=0.02):
    """Polygon -> SVG path data. Runs on a construction circle become arcs."""
    n = len(poly)
    # every circle each vertex lies on (a vertex can sit where two circles cross)
    on = [{ci for ci, c in enumerate(circles) if abs(math.hypot(x - c.cx, y - c.cy) - c.r) < tol}
          for x, y in poly]

    def candidates(i):
        j = (i + 1) % n
        (x0, y0), (x1, y1) = poly[i], poly[j]
        L = math.hypot(x1 - x0, y1 - y0)
        return sorted(ci for ci in on[i] & on[j] if L < max(6.0, 3.5 * 2 * math.pi * circles[ci].r / N))

    cands = [candidates(i) for i in range(n)]
    kinds = [c[0] if c else None for c in cands]
    # keep a run on one circle where an edge could belong to several
    for _ in range(2):
        for i in range(n):
            prev = kinds[i - 1]
            if len(cands[i]) > 1 and prev in cands[i]:
                kinds[i] = prev
    # start at a vertex where the edge kind changes, so no run wraps
    start = 0
    for i in range(n):
        if kinds[i] != kinds[i - 1]:
            start = i
            break
    order = list(range(start, n)) + list(range(0, start))
    segs = []  # (kind, [vertex indices])
    for i in order:
        k = kinds[i]
        j = (i + 1) % n
        if segs and segs[-1][0] == k and k is not None:
            segs[-1][1].append(j)
        else:
            segs.append((k, [i, j]))
    x0, y0 = poly[order[0]]
    d = [f'M{f(x0)} {f(y0)}']
    cur = (x0, y0)
    out = []

    def emit_lines(pts):
        # simplify collinear runs
        simp = []
        for p in pts:
            if len(simp) >= 2:
                (ax, ay), (bx, by) = simp[-2], simp[-1]
                cr = (bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax)
                if abs(cr) < 0.02 * math.hypot(bx - ax, by - ay) and (p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay) > 0:
                    simp[-1] = p
                    continue
            simp.append(p)
        return simp

    line_run = [cur]
    for k, idx in segs:
        if k is None:
            for j in idx[1:]:
                line_run.append(poly[j])
            continue
        c = circles[k]
        # signed sweep angle
        tot = 0.0
        for a, b in zip(idx, idx[1:]):
            pa, pb = poly[a], poly[b]
            t0 = math.atan2(pa[1] - c.cy, pa[0] - c.cx)
            t1 = math.atan2(pb[1] - c.cy, pb[0] - c.cx)
            tot += (t1 - t0 + math.pi) % (2 * math.pi) - math.pi
        end = poly[idx[-1]]
        if abs(tot) * c.r < 0.3:      # a sliver of arc between two straight edges: keep it straight
            line_run.append(end)
            continue
        for p in emit_lines(line_run)[1:]:
            out.append(f'L{f(p[0])} {f(p[1])}')
        large = 1 if abs(tot) > math.pi else 0
        sweep = 1 if tot > 0 else 0
        if abs(tot) > 2 * math.pi - 1e-3:
            raise ValueError('full circle run; split it')
        out.append(f'A{f(c.r)} {f(c.r)} 0 {large} {sweep} {f(end[0])} {f(end[1])}')
        line_run = [end]
    rest = emit_lines(line_run)[1:]
    # closing point equals start: drop it
    if rest and math.hypot(rest[-1][0] - x0, rest[-1][1] - y0) < 1e-6:
        rest = rest[:-1]
    for p in rest:
        out.append(f'L{f(p[0])} {f(p[1])}')
    s = d[0] + ''.join(out) + 'Z'
    return compact(s)


def compact(s):
    """Use H/V for axis-aligned lines."""
    import re
    toks = re.findall(r'[MLAZ][^MLAZ]*', s)
    res = []
    cx = cy = None
    for t in toks:
        c, args = t[0], t[1:].split()
        if c == 'M':
            cx, cy = args
            res.append(t)
        elif c == 'L':
            x, y = args
            if y == cy and x != cx:
                res.append('H' + x)
            elif x == cx and y != cy:
                res.append('V' + y)
            else:
                res.append(t)
            cx, cy = x, y
        elif c == 'A':
            cx, cy = args[-2], args[-1]
            res.append(t)
        else:
            res.append(t)
    return ''.join(res)


def svg(body, vb='0 0 256 256', title='Divi'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')
