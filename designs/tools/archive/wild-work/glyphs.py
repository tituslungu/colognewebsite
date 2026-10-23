import json, sys
from fontTools.ttLib import TTCollection
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
ttc = TTCollection('/System/Library/Fonts/HelveticaNeue.ttc')
for i, f in enumerate(ttc.fonts):
    name = f['name'].getDebugName(4)
    if name in ('Helvetica Neue Bold',):
        font = f; print(i, name)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
os2 = font['OS/2']
print('upm', upm, 'cap', getattr(os2,'sCapHeight',None))
out = {'upm': upm, 'cap': os2.sCapHeight, 'glyphs': {}}
for ch in 'DIV':
    gn = cmap[ord(ch)]
    g = gs[gn]
    bp = BoundsPen(gs); g.draw(bp)
    pen = SVGPathPen(gs)
    # flip y: font y-up -> svg y-down, baseline at 0
    tp = TransformPen(pen, (1,0,0,-1,0,0))
    g.draw(tp)
    out['glyphs'][ch] = {'name': gn, 'adv': g.width, 'bounds': bp.bounds, 'd': pen.getCommands()}
    print(ch, gn, g.width, bp.bounds)
# kerning
if 'kern' in font:
    print('kern table present')
if 'GPOS' in font:
    print('GPOS present')
json.dump(out, open('glyphs.json','w'), indent=1)
