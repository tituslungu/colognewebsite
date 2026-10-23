import sys, os, subprocess
cid = sys.argv[1]
d = '/Users/titus/repos/colognewebsite/designs/logos/' + cid
def u(n): return 'file://' + os.path.join(d, n)
html = f'''<!doctype html><html><body style="margin:0;background:#f2f3f1;display:flex;gap:20px;padding:20px;align-items:center;flex-wrap:wrap;width:1400px">
<div style="position:relative;width:512px;height:512px"><img src="{u('app-icon.svg')}" width=512 height=512>
<svg style="position:absolute;inset:0" viewBox="0 0 256 256" width=512 height=512><circle cx=128 cy=128 r=127.5 fill=none stroke="#e33" stroke-width=.5 /><circle cx=128 cy=128 r=104 fill=none stroke="#e33" stroke-dasharray="2 2" stroke-width=.4 /><line x1=128 y1=0 x2=128 y2=256 stroke="#39f" stroke-width=.3 /><line x1=0 y1=128 x2=256 y2=128 stroke="#39f" stroke-width=.3 /></svg></div>
<div style="background:#fafaf8;border:1px solid #ddd;position:relative"><img src="{u('mark.svg')}" width=512 height=512><svg style="position:absolute;inset:0" viewBox="0 0 256 256" width=512 height=512><line x1=128 y1=0 x2=128 y2=256 stroke="#39f" stroke-width=.3 /><line x1=0 y1=128 x2=256 y2=128 stroke="#39f" stroke-width=.3 /><rect x=.5 y=.5 width=255 height=255 fill=none stroke="#39f" stroke-width=.3 /></svg></div>
<div style="display:flex;gap:12px;align-items:center"><img src="{u('lockup.svg')}" height=150 style="background:#fafaf8;padding:10px"><img src="{u('lockup-reverse.svg')}" height=150 style="background:#2d2d2d;padding:10px"></div>
<div style="background:#2d2d2d;padding:10px"><img src="{u('site-icon.svg')}" width=160></div><div style="background:#2d2d2d;padding:10px"><img src="{u('mark-mono.svg')}" width=160></div>
</body></html>'''
out = f'/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/ad-bubble/big-{cid}'
open(out + '.html', 'w').write(html)
subprocess.run(['node', '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/r2b/shot.mjs', out + '.html', out + '.png', '1440'], check=True)
print(out + '.png')
