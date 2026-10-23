import math
from sheetlib import *
from geo import *
items = []
def rimtable(table, diner, bg, gap=9):
    s = f'<circle cx="128" cy="134" r="70" fill="{table}"/>'
    for ang, r in ((-130, 34), (-20, 26), (95, 20)):
        a = math.radians(ang); cx = 128 + 78*math.cos(a); cy = 134 + 78*math.sin(a)
        s += f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{r+gap}" fill="{bg}"/><circle cx="{f(cx)}" cy="{f(cy)}" r="{r}" fill="{diner}"/>'
    return s
items.append(('Round table, unequal diners at the rim', svg(rimtable(C['sage'], C['char'], '#fafaf8')), tile(rimtable(C['sage'], '#fff', C['char']))))
def tally_slash(bar, slash, bg, disc=None):
    s = f'<circle cx="128" cy="128" r="100" fill="{disc}"/>' if disc else ''
    for x in (84, 112, 140, 168):
        s += f'<rect x="{x-10}" y="68" width="20" height="120" rx="10" fill="{bar}"/>'
    # slash as division slash with gap ring
    s += f'<g transform="rotate(-62 128 128)"><rect x="40" y="{128-10-8}" width="176" height="36" rx="18" fill="{bg}"/><rect x="48" y="118" width="160" height="20" rx="10" fill="{slash}"/></g>'
    return s
items.append(('Tally with a division slash', svg(tally_slash(C['char'], C['sage'], '#fafaf8')), tile(tally_slash('#fff', C['sage'], C['char']))))
sheet(items, '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/wild-work/sk7.html')
