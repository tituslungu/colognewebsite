import sys, math; sys.path.insert(0, '.')
import ad2
from ad2 import emit, f, pt
def kink(name, R=84, g=20, cx=129, cy=116, a=128, drop=28, lean=0):
    h = g/2; yc = math.sqrt(R*R-h*h)
    B = pt(cx, cy, R, a); tip = (cx-h-lean, cy+R+drop)
    L = (f'M{f(cx-h)} {f(cy-yc)}A{f(R)} {f(R)} 0 0 0 {f(B[0])} {f(B[1])}L{f(tip[0])} {f(tip[1])}'
         + (f'L{f(cx-h)} {f(cy+yc)}' if lean else '') + 'Z')
    Rr = f'M{f(cx+h)} {f(cy-yc)}A{f(R)} {f(R)} 0 0 1 {f(cx+h)} {f(cy+yc)}Z'
    emit(name, L, Rr)
kink('m2-k0-final')
kink('m2-k1-lean10', lean=10, a=132, cx=130)
kink('m2-k2-lean18', lean=18, a=134, cx=131)
kink('m2-k3-lean18-a124', lean=18, a=124, cx=131)
