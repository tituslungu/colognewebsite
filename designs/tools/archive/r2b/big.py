# big.py <concept-id>: one large proof of app-icon + mark + mono, with a 1px grid of the inscribed circle
import sys, os
cid = sys.argv[1]
d = '/Users/titus/repos/colognewebsite/designs/logos/' + cid
def u(n): return 'file://' + os.path.join(d, n)
html = f'''<!doctype html><html><body style="margin:0;background:#f2f3f1;display:flex;gap:20px;padding:20px;align-items:center">
<div style="position:relative;width:512px;height:512px"><img src="{u('app-icon.svg')}" width=512 height=512>
<svg style="position:absolute;inset:0" viewBox="0 0 256 256" width=512 height=512><circle cx=128 cy=128 r=127.5 fill=none stroke="#e33" stroke-width=.5 /><circle cx=128 cy=128 r=104 fill=none stroke="#e33" stroke-dasharray="2 2" stroke-width=.4 /><line x1=128 y1=0 x2=128 y2=256 stroke="#39f" stroke-width=.3 /><line x1=0 y1=128 x2=256 y2=128 stroke="#39f" stroke-width=.3 /></svg></div>
<div style="background:#fafaf8;border:1px solid #ddd"><img src="{u('mark.svg')}" width=400 height=400></div>
<div style="display:grid;gap:12px"><img src="{u('lockup.svg')}" height=120 style="background:#fafaf8;padding:10px"><img src="{u('lockup-reverse.svg')}" height=120 style="background:#2d2d2d;padding:10px"><div style="background:#2d2d2d;padding:10px;width:fit-content"><img src="{u('mark-mono.svg')}" width=120></div></div>
</body></html>'''
open(f'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/big-{cid}.html','w').write(html)
