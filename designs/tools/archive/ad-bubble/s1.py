from forms import *
import ad
V = []
V.append(('F0 current', *fork()[:2]))
V.append(('F1 corner rotated -10', *fork(up=-100, side=-10)[:2]))
V.append(('F2 corner rotated +12 (opens)', *fork(up=-78, side=12)[:2]))
V.append(('F3 J further out (30,-28)', *fork(jx=30, jy=-28)[:2]))
V.append(('F4 branch 34 above bend, J(14,10)', *fork(jx=14, jy=10, branch_at=40)[:2]))
V.append(('F5 stem 118, J(18,-14)', *fork(jx=18, jy=-14, stem=118)[:2]))
V.append(('F6 current, cap = sage, mid = light', *fork(roles=('a','c','b'))[:2]))
V.append(('F7 current, cap = speaker colour', *fork(roles=('a','b','w'))[:2], dict(light={'w': CHARCOAL})))
print(ad.render(V, 's1'))
