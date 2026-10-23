import sys, math; sys.path.insert(0, '.')
from ad2 import halves, emit
def cut(name, R, g, cy, a_far, drop, cx=128.0):
    h = g / 2
    tip = (cx - h, cy + R + drop)
    if a_far == 'tan':
        d = math.hypot(tip[0]-cx, tip[1]-cy); phi = math.degrees(math.atan2(tip[1]-cy, tip[0]-cx))
        a_far = phi + math.degrees(math.acos(R/d))
    print(name, round(a_far,1))
    emit(name, *halves(cx, cy, R, g, left_tail=(a_far, tip, 'cut')))
cut('m2-g1-a124-g18', 84, 18, 114, 124, 28, cx=130)
cut('m2-g2-a128-g20', 84, 20, 114, 128, 28, cx=130)
cut('m2-g3-a128-g20-d34', 84, 20, 112, 128, 34, cx=130)
cut('m2-g4-tan-g20', 84, 20, 114, 'tan', 28, cx=130)
