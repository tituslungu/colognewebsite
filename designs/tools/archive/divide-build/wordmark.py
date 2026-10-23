# Outline "DIVI" in Helvetica Neue Bold, tracked +0.12em, as an SVG path.
import sys
sys.path.insert(0, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/pylib')
from fontTools.ttLib import TTCollection
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

_font = TTCollection('/System/Library/Fonts/HelveticaNeue.ttc').fonts[1]
_gs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
UPM = _font['head'].unitsPerEm
CAP = getattr(_font['OS/2'], 'sCapHeight', 714) or 714

def glyph_bounds(ch):
    g = _gs[_cmap[ord(ch)]]; bp = BoundsPen(_gs); g.draw(bp); return bp.bounds, g.width

def word_path(text='DIVI', cap_px=100.0, x=0.0, baseline=0.0, tracking=0.12, trim=True):
    """Return (path_d, width_px). cap_px = rendered cap height. The left side bearing of the
    first glyph and the trailing tracking are trimmed so the ink starts at x."""
    s = cap_px / CAP
    em_px = UPM * s
    pen = SVGPathPen(_gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    cur = 0.0
    first_lsb = glyph_bounds(text[0])[0][0] if trim else 0
    ink_right = 0
    for i, ch in enumerate(text):
        g = _gs[_cmap[ord(ch)]]
        (xmin, ymin, xmax, ymax), adv = glyph_bounds(ch)
        ox = x + (cur - first_lsb) * s
        tp = TransformPen(pen, (s, 0, 0, -s, ox, baseline))
        g.draw(tp)
        ink_right = ox + xmax * s
        cur += adv + tracking * UPM
    return pen.getCommands(), ink_right - x

if __name__ == '__main__':
    print('UPM', UPM, 'CAP', CAP)
    for ch in 'DIV':
        b, adv = glyph_bounds(ch); print(ch, b, adv, 'w/cap=%.3f' % ((b[2]-b[0])/CAP))
    d, w = word_path(cap_px=100)
    print('DIVI width at cap 100:', round(w, 2))
