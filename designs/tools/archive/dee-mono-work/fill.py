# fill.py tmpl colourway out
import sys
CW = {
 'blue': dict(TILE_A='#DEF8FB', TILE_B='#A6E5F7', INK_A='#1151FE', INK_B='#05DFF2'),
 'sage': dict(TILE_A='#FAFAF8', TILE_B='#ECEBE8', INK_A='#3E7A5B', INK_B='#8CC4A5'),
 'sage-dark': dict(TILE_A='#2D2D2D', TILE_B='#2D2D2D', INK_A='#6FAF8E', INK_B='#A8DCBD'),
 'charcoal': dict(TILE_A='#FFFFFF', TILE_B='#FFFFFF', INK_A='#2D2D2D', INK_B='#2D2D2D'),
 'white-sage': dict(TILE_A='#6FAF8E', TILE_B='#3E7A5B', INK_A='#FFFFFF', INK_B='#FFFFFF'),
}
s = open(sys.argv[1]).read()
for k, v in CW[sys.argv[2]].items(): s = s.replace('%' + k + '%', v)
open(sys.argv[3], 'w').write(s)
