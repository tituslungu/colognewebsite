// Preview-only helper shared by the design options; not part of the final site.
// Picks the colour tone from ?tone= (gray | white | sage) before first paint and
// adds a small switcher. Pages that mark <html data-footer-variants> also get
// ?footer= (charcoal | light) on the white tone; pages that mark
// <html data-button-variants> also get ?buttons= (a style key) and
// ?order= (imessage-first | whatsapp-first); a page may set its defaults with
// data-buttons / data-order on <html>, which the parameters override.
// ?shot=1 hides the switcher.
(function () {
  var TONES = ['gray', 'white', 'sage'];
  var FOOTERS = ['charcoal', 'light'];
  var params = new URLSearchParams(location.search);
  var root = document.documentElement;
  var tone = TONES.indexOf(params.get('tone')) >= 0 ? params.get('tone') : 'gray';
  var footer = FOOTERS.indexOf(params.get('footer')) >= 0 ? params.get('footer') : '';
  root.dataset.tone = tone;
  if (footer) root.dataset.footer = footer;
  var buttons = params.get('buttons') || '';
  var order = ['imessage-first', 'whatsapp-first'].indexOf(params.get('order')) >= 0 ? params.get('order') : '';
  if (/^[a-z-]+$/.test(buttons)) root.dataset.buttons = buttons;
  if (order) root.dataset.order = order;
  if (params.has('shot')) return;

  document.addEventListener('DOMContentLoaded', function () {
    var css = document.createElement('style');
    css.textContent =
      '.preview-bar{position:fixed;top:10px;right:10px;z-index:9999;display:flex;flex-wrap:wrap;' +
      'justify-content:flex-end;gap:4px;max-width:calc(100vw - 80px);' +
      'font:600 11px/1 "Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:.04em}' +
      '.preview-bar .grp{display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(20,20,20,.62);' +
      '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
      '.preview-bar span{color:#9a9a9a;padding:6px 4px 6px 8px}' +
      '.preview-bar a{color:#ddd;text-decoration:none;padding:6px 9px;border-radius:999px}' +
      '.preview-bar a[aria-current]{background:#f0efed;color:#2d2d2d}' +
      '.preview-bar a.all{color:#9fd3b6}';
    document.head.appendChild(css);

    function link(href, text, current, cls) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      if (current) a.setAttribute('aria-current', 'true');
      if (cls) a.className = cls;
      return a;
    }

    var bar = document.createElement('nav');
    bar.className = 'preview-bar';
    bar.setAttribute('aria-label', 'Design preview');

    var tones = document.createElement('div');
    tones.className = 'grp';
    TONES.forEach(function (t) {
      tones.appendChild(link('?tone=' + t, t.charAt(0).toUpperCase() + t.slice(1), t === tone && !footer));
    });
    tones.appendChild(link('../index.html', 'All options', false, 'all'));
    bar.appendChild(tones);

    if (tone === 'white' && root.hasAttribute('data-footer-variants')) {
      var foot = document.createElement('div');
      foot.className = 'grp';
      var label = document.createElement('span');
      label.textContent = 'Footer';
      foot.appendChild(label);
      foot.appendChild(link('?tone=white', 'White', !footer));
      foot.appendChild(link('?tone=white&footer=charcoal', 'Charcoal', footer === 'charcoal'));
      foot.appendChild(link('?tone=white&footer=light', 'Light gray', footer === 'light'));
      bar.appendChild(foot);
    }
    // Button colour and order pickers; the page lists its styles in data-button-variants="key:Label,key:Label".
    var variants = root.getAttribute('data-button-variants');
    if (variants) {
      var keep = function (extra) {
        var q = new URLSearchParams(location.search);
        q.delete('shot');
        Object.keys(extra).forEach(function (k) { if (extra[k]) q.set(k, extra[k]); else q.delete(k); });
        return '?' + q.toString();
      };
      var btn = document.createElement('div');
      btn.className = 'grp';
      var bl = document.createElement('span');
      bl.textContent = 'Buttons';
      btn.appendChild(bl);
      // The first listed style is the page's default: picking it drops ?buttons.
      var list = variants.split(',').map(function (pair) { return pair.split(':'); });
      var current = root.dataset.buttons || list[0][0];
      list.forEach(function (kv, i) {
        btn.appendChild(link(keep({ buttons: i === 0 ? '' : kv[0] }), kv[1], current === kv[0]));
      });
      bar.appendChild(btn);
      var ord = document.createElement('div');
      ord.className = 'grp';
      var ol = document.createElement('span');
      ol.textContent = 'Order';
      ord.appendChild(ol);
      var imFirst = root.dataset.order === 'imessage-first';
      ord.appendChild(link(keep({ order: 'imessage-first' }), 'iMessage first', imFirst));
      ord.appendChild(link(keep({ order: 'whatsapp-first' }), 'WhatsApp first', !imFirst));
      bar.appendChild(ord);
    }
    document.body.appendChild(bar);
  });
})();
