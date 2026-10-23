import sys
sys.argv = ['x', '/dev/null']
import gen
gen.FIT = gen.fit_d()
# 1000px font size => scale 1, baseline 900
d, il, ir = gen.wordmark_paths(1.0, 100, 900)
html = f'''<!doctype html><html><body style="margin:0;background:#fff">
<div style="position:absolute;left:100px;top:0;font:700 1000px/1 'Helvetica Neue';letter-spacing:.12em;color:#e33;white-space:nowrap;height:1000px">
<span id=t style="position:absolute;left:0;top:0;line-height:1000px">DIVI</span></div>
<svg style="position:absolute;left:0;top:0" width="3000" height="1100" viewBox="0 0 3000 1100"><path d="{d}" fill="rgba(0,0,0,.55)"/></svg>
</body></html>'''
open('overlay.html', 'w').write(html)
