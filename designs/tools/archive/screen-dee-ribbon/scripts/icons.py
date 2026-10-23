import sys, re, urllib.request, urllib.parse, os, ssl
out = sys.argv[1]
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', 'Accept': 'text/html,*/*'}
ctx = ssl.create_default_context()
def get(u):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=20, context=ctx)
    return r.geturl(), r.read()
for site in sys.argv[2:]:
    try:
        base, html = get('https://' + site + '/')
        html = html.decode('utf-8', 'ignore')
        links = re.findall(r'<link[^>]+>', html, re.I)
        cands = []
        for l in links:
            rel = re.search(r'rel=["\']([^"\']+)', l, re.I)
            href = re.search(r'href=["\']([^"\']+)', l, re.I)
            if rel and href and 'icon' in rel.group(1).lower():
                sz = re.search(r'sizes=["\'](\d+)', l)
                score = int(sz.group(1)) if sz else (150 if 'apple' in rel.group(1).lower() else (500 if href.group(1).endswith('.svg') else 16))
                cands.append((score, urllib.parse.urljoin(base, href.group(1).replace('&amp;','&'))))
        cands.sort(reverse=True)
        if not cands:
            print(site, 'no icon links'); continue
        u = cands[0][1]
        _, data = get(u)
        ext = '.svg' if (u.split('?')[0].endswith('.svg') or data.lstrip()[:5] in (b'<svg ', b'<?xml')) else '.png' if data[:4] == b'\x89PNG' else '.ico' if data[:4] == b'\x00\x00\x01\x00' else '.webp' if data[8:12] == b'WEBP' else '.bin'
        fn = os.path.join(out, site + ext)
        open(fn, 'wb').write(data)
        print(site, 'ok', u, ext, len(data))
    except Exception as e:
        print(site, 'ERR', str(e)[:80])
