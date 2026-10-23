import re, sys
src_path = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/review-b/original-index.html'
css_path = '/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad/review-b/new.css'
out_path = '/Users/titus/repos/colognewebsite/designs/b-split/index.html'
html = open(src_path).read()
css = open(css_path).read()

svgs = re.findall(r'<svg viewBox="0 0 24 24".*?</svg>', html, re.S)
assert len(svgs) == 3, len(svgs)
replay_svg, wa_svg, im_svg = svgs

head, rest = html.split('<style>', 1)
_, rest = rest.split('</style>', 1)
html = head + '<style>\n' + css + '    </style>' + rest

body_start = html.index('    <main class="lower">')
body_end = html.index('    </footer>') + len('    </footer>')

body = f'''    <main class="lower">
      <div class="stage">
        <div class="split">
          <div class="unit">
            <div class="frame">
              <img
                id="anim"
                data-check="anim"
                src="../../assets/img/divi-web-charcoal-sage.svg"
                alt="How Divi works: snap the receipt, everyone scans, tap what you had, settle up."
                width="530"
                height="655"
              />
            </div>
            <button class="replay" id="replay" type="button" data-check="replay">
              {replay_svg}
              Replay
            </button>
          </div>
          <div class="pitch">
            <span class="rule" aria-hidden="true"></span>
            <h2 class="prompt" data-check="prompt">Text us to split your bill</h2>
          </div>
        </div>
      </div>

      <div class="actions">
        <div class="buttons">
          <a class="btn btn-wa" data-check="whatsapp" href="https://wa.me/14785004378" target="_blank" rel="noopener noreferrer">
            {wa_svg}
            <span><span class="long">Text Through </span>WhatsApp</span>
          </a>
          <a class="btn btn-im" data-check="imessage" href="sms:+14785004378">
            {im_svg}
            <span><span class="long">Text Through </span>iMessage</span>
          </a>
        </div>
        <p class="hint" data-check="hint">Text us and we'll send you a link to start splitting — no download required.</p>
      </div>
    </main>

    <footer class="footer" data-check="footer">
      <div class="footer-group">
        <span class="copyright" data-check="copyright">&copy; 2026 Divi. All rights reserved.</span>
        <a class="email" data-check="email" href="mailto:hello@justdivi.com">hello@justdivi.com</a>
      </div>
      <div class="footer-group">
        <a data-check="tos" href="/tos">Terms of Service</a>
        <a data-check="privacy" href="/privacy">Privacy Policy</a>
      </div>
    </footer>'''
html = html[:body_start] + body + html[body_end:]
open(out_path, 'w').write(html)

# verify icon paths are byte-identical to the live index.html
live = open('/Users/titus/repos/colognewebsite/index.html').read()
for s in svgs:
    for d in re.findall(r' d="([^"]+)"', s):
        print('path in live index.html:', d in live, d[:30])
