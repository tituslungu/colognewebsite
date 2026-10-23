"""Build designs/e-loop/divi-loop.svg: a seamless, infinitely looping version of
assets/img/divi-web-charcoal-sage.svg.

Timeline (absolute seconds, new cycle D = 20s):
  0 .. 17.4   the original story, untouched (every keyframe rescaled by 17.4/D so
              its absolute time is unchanged)
  17.1        tagline finishes (as in the original)
  17.1 .. 19.0 extra hold on the finished DIVI page
  19.0 .. 19.6 DIVI page (pg4) fades out
  19.3 .. 20.0 phone scene (ph) + page 1 caption/pill (pg0) fade back in
  20.0 == 0   identical state, so the wrap is invisible
"""
import re
import sys

SRC = '/Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg'
DST = '/Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg'
STILL = '/Users/titus/repos/colognewebsite/designs/e-loop/divi-still.svg'

OLD_D = 17.4
D = 20.0
K = OLD_D / D

# Reduced motion: hold one explanatory frame ("03 Tap what you had", items
# ticked, "Your share $36.00", hand already gone). Absolute time in seconds.
REDUCED_T = 10.55


def pct(x):
    # old% has 3 decimals and K = 0.87 has 2, so 5 decimals is exact (no drift)
    s = f'{x:.5f}'.rstrip('0').rstrip('.')
    return s + '%'


s = open(SRC, encoding='utf-8').read()
a, b = s.index('<style>') + len('<style>'), s.index('</style>')
css = s[a:b]

kf_re = re.compile(r'@keyframes ([\w-]+)\{((?:[\d.]+%\{[^}]*\})+)\}')
stop_re = re.compile(r'([\d.]+)%\{([^}]*)\}')


def stops_of(body):
    return [(float(p), v) for p, v in stop_re.findall(body)]


def render(name, stops):
    return '@keyframes %s{%s}' % (name, ''.join(f'{pct(p)}{{{v}}}' for p, v in stops))


# Tails replacing the 100% stop for the elements visible across the wrap.
TAILS = {
    # page-1 caption + progress pill: fade back in with the phone
    'pg0': [(96.5, 'opacity:0'), (100.0, 'opacity:1')],
    # the whole phone scene
    'ph': [(96.5, 'opacity:0'), (100.0, 'opacity:1')],
    # DIVI wordmark page: hold, then fade out before the wrap
    'pg4': [(95.0, 'opacity:1'), (98.0, 'opacity:0'), (100.0, 'opacity:0')],
}

names = []


def rewrite(m):
    name, body = m.group(1), m.group(2)
    names.append(name)
    stops = stops_of(body)
    assert stops[0][0] == 0 and stops[-1][0] == 100, name
    scaled = [(0.0 if p == 0 else 100.0 if p == 100 else p * K, v) for p, v in stops]
    out = []
    if name in TAILS:
        out.append(render(name, scaled[:-1] + TAILS[name]))
    else:
        out.append(render(name, scaled))
    if name == 'pg0':
        # The page-1 screen INSIDE the phone group: it must already be opaque
        # when the phone fades back in, otherwise the phone's white screen
        # would flash through. It snaps back while the phone group is at
        # opacity 0 (ph is 0 from 75.5% to 96.5%), so the snap is invisible.
        out.append(render('pg0s', scaled[:-1] + [(85.0, 'opacity:0'), (90.0, 'opacity:1'), (100.0, 'opacity:1')]))
    return ''.join(out)


css2, n_kf = kf_re.subn(rewrite, css)
assert n_kf == len(names) and n_kf > 0

# Every animation: one common duration, infinite.
decl_re = re.compile(r'animation:([\w-]+) 17\.4s (cubic-bezier\([^)]*\)) 1 forwards;')
css2, n_decl = decl_re.subn(lambda m: f'animation:{m.group(1)} {D:g}s {m.group(2)} infinite;', css2)
assert n_decl == n_kf, (n_decl, n_kf)
assert '17.4s' not in css2 and 'forwards' not in css2

# Inner page-1 screen uses its own keyframes (same easing/duration), placed
# right after the .pg0 rule.
pg0_rule = re.search(r'\.pg0\{animation:[^}]*\}', css2).group(0)
css2 = css2.replace(pg0_rule, pg0_rule + '.ph .pg0{animation-name:pg0s;}', 1)

# Reduced motion: freeze on one explanatory frame instead of moving.
freeze = f'*{{animation-play-state:paused!important;animation-delay:-{REDUCED_T:g}s!important;}}'
loop_css = css2 + '@media (prefers-reduced-motion:reduce){' + freeze + '}'

out = s[:a] + loop_css + s[b:]
open(DST, 'w', encoding='utf-8').write(out)
print('keyframes', n_kf, 'decls', n_decl, 'bytes', len(out), file=sys.stderr)

# Still variant (same frame, always frozen) for pages that pick the source
# with <picture><source media="(prefers-reduced-motion: reduce)">, because the
# media query inside an SVG loaded by <img> is not reliably evaluated against
# the viewer's setting.
still = s[:a] + css2 + freeze + s[b:]
open(STILL, 'w', encoding='utf-8').write(still)
print('still bytes', len(still), file=sys.stderr)
