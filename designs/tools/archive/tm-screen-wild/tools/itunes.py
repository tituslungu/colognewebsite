import sys, json, urllib.request, urllib.parse
# usage: itunes.py out.json term1 term2 ...  (limit 6 each)
out = sys.argv[1]
res = []
for term in sys.argv[2:]:
    lim = 6
    if '|' in term:
        term, lim = term.split('|'); lim = int(lim)
    url = 'https://itunes.apple.com/search?' + urllib.parse.urlencode({'term': term, 'entity': 'software', 'limit': lim, 'country': 'us'})
    try:
        d = json.load(urllib.request.urlopen(url, timeout=20))
    except Exception as e:
        print('ERR', term, e); continue
    for r in d['results']:
        res.append({'q': term, 'label': r.get('trackName','')[:40] + ' / ' + r.get('sellerName','')[:25], 'url': r.get('artworkUrl512') or r.get('artworkUrl100'), 'store': r.get('trackViewUrl','').split('?')[0]})
        print(term, '|', r.get('trackName'), '|', r.get('sellerName'), '|', r.get('trackViewUrl','').split('?')[0])
json.dump(res, open(out, 'w'), indent=1)
