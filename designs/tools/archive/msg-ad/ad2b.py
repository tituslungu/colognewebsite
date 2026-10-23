import sys; sys.path.insert(0, '.')
from ad2 import *
def cut(name, R, g, cy, a_far, drop, lean=0.0, cx=128.0):
    h = g / 2
    emit(name, *halves(cx, cy, R, g, left_tail=(a_far, (cx - h - lean, cy + R + drop), 'cut')))
cut('m2-c1', 80, 17, 114, 118, 30)
cut('m2-c2', 80, 17, 116, 126, 26)
cut('m2-c3', 84, 18, 114, 122, 30)
cut('m2-c4', 84, 18, 114, 135, 30)
cut('m2-c5', 84, 18, 114, 124, 28, lean=10)
