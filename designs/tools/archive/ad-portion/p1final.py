"""Writes the final portion-1 files into the concept folder."""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from p1geo import build, svg
from p1variants import scaled

DIR = '/Users/titus/repos/colognewebsite/designs/logos/portion-1/'
CH, SAGE, SAGE_L, OFF, WHITE = '#2D2D2D', '#6FAF8E', '#8CC4A5', '#FAFAF8', '#FFFFFF'

# Master geometry in the 256 frame. Cut positions solved for shares of 20 / 36 / 44 %.
M = dict(cx=130, cy=117, R=96, a0=20, x0=80.78, a1=8, x1=144.5, g=16,
         rf=5, rq=5, rt=4, tail_len=42, q_off=18)
APP_S, APP_GAP = 0.86, 15
SITE_S = 1.06


def write(name, text):
    open(os.path.join(DIR, name), 'w').write(text)


def main():
    g = build(M)
    write('mark.svg', svg(g, [CH, CH, SAGE]))
    write('mark-mono.svg', svg(g, [WHITE, WHITE, WHITE]))

    A = scaled(M, APP_S, 128, 128, 128, 128, g=APP_GAP)
    ga = build(A)
    write('app-icon.svg', svg(ga, [OFF, OFF, SAGE], tile=CH))

    S = scaled(M, SITE_S, 128, 128, 128, 128)
    gs = build(S)
    write('site-icon.svg', svg(gs, [WHITE, WHITE, SAGE_L]))

    # Lockup: circle centred on the cap-height middle line (caps run y 0..100).
    word = WORD
    RL, pad, space = 72, 20, 46
    s = RL / M['R']
    cxl = pad + RL
    L = scaled(M, s, M['cx'], M['cy'], cxl, 50)
    gl = build(L)
    d_start = cxl + RL + space
    dx = d_start - 222
    word_shifted = shift_x(word, dx)
    tip_y = gl['ext']['T'][1]
    x_end = 527.74 + dx + pad
    y0 = 50 - RL - pad
    y1 = tip_y + 4 + pad
    vb = '0 %s %s %s' % (fmt(y0), fmt(x_end), fmt(y1 - y0))
    for name, mark_cols, word_col in (('lockup.svg', [CH, CH, SAGE], CH),
                                      ('lockup-reverse.svg', [WHITE, WHITE, SAGE], WHITE)):
        body = svg(gl, mark_cols, vb=vb, extra='<path fill="%s" d="%s"/>' % (word_col, word_shifted))
        write(name, body)
    print('areas', g['areas'], 'app maxdist %.1f' % ga['maxdist']((128, 128)),
          'site maxdist %.1f' % gs['maxdist']((128, 128)), 'lockup vb', vb)


def fmt(x): return ('%.2f' % x).rstrip('0').rstrip('.')


def shift_x(d, dx):
    out = []
    for cmd, args in re.findall(r'([MLQZ])([^MLQZ]*)', d):
        nums = [float(n) for n in re.findall(r'-?\d+(?:\.\d+)?', args)]
        for i in range(0, len(nums), 2):
            nums[i] += dx
        out.append(cmd + ' '.join(fmt(n) for n in nums))
    return ''.join(out)


# Helvetica Neue Bold "DIVI", tracked +0.12em, cap height 100, D starting at x=222
# (outlines carried over from the designer's lockup).
WORD = 'M243.99 81.51L243.99 18.49L259.68 18.49Q267.8 18.49 273.33 20.8Q278.86 23.11 282.22 27.45Q285.59 31.79 287.06 37.89Q288.53 43.98 288.53 51.54Q288.53 59.8 286.43 65.55Q284.32 71.29 280.82 74.86Q277.32 78.43 272.84 79.97Q268.36 81.51 263.6 81.51ZM222 0L222 100L265.14 100Q276.62 100 285.1 96.15Q293.57 92.3 299.24 85.57Q304.91 78.85 307.71 69.61Q310.52 60.36 310.52 49.44Q310.52 36.97 307.08 27.73Q303.65 18.49 297.56 12.32Q291.47 6.16 283.13 3.08Q274.8 0 265.14 0ZM342.59 0L342.59 100L364.58 100L364.58 0ZM447.21 100L480.4 0L457.71 0L435.17 70.31L434.89 70.31L412.62 0L390.07 0L422.42 100ZM505.75 0L505.75 100L527.74 100L527.74 0Z'

if __name__ == '__main__':
    main()
