from fontTools.ttLib import TTCollection
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
_font = TTCollection('/System/Library/Fonts/HelveticaNeue.ttc').fonts[1]
assert _font['name'].getDebugName(4) == 'Helvetica Neue Bold'
_gs = _font.getGlyphSet(); _cmap = _font.getBestCmap()
CAP = 714; TRACK = 120  # 0.12em at 1000 upm
def _fmt(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.'); return '0' if s == '-0' else s
class _P(SVGPathPen):
    def __init__(self, gs): super().__init__(gs, ntos=_fmt)
def layout(text='DIVI'):
    x = 0; out = []
    for ch in text:
        g = _gs[_cmap[ord(ch)]]; out.append((ch, x)); x += g.width + TRACK
    return out
def ink_extent(text='DIVI'):
    lay = layout(text)
    from fontTools.pens.boundsPen import BoundsPen
    xmin = None; xmax = None
    for ch, x in lay:
        bp = BoundsPen(_gs); _gs[_cmap[ord(ch)]].draw(bp)
        a, b = x + bp.bounds[0], x + bp.bounds[2]
        xmin = a if xmin is None else min(xmin, a); xmax = b if xmax is None else max(xmax, b)
    return xmin, xmax
def wordmark_d(left, baseline, cap, text='DIVI'):
    """Path data for the tracked wordmark whose ink starts at x=left, baseline y, cap height `cap` (in output units)."""
    s = cap / CAP; xmin, xmax = ink_extent(text)
    pen = _P(_gs); d = ''
    for ch, x in layout(text):
        tp = TransformPen(pen, (s, 0, 0, -s, left + (x - xmin) * s, baseline))
        _gs[_cmap[ord(ch)]].draw(tp)
    return pen.getCommands(), (xmax - xmin) * s
if __name__ == '__main__':
    d, w = wordmark_d(0, 100, 100); print(w); print(d[:200])
