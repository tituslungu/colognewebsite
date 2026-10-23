import sys, json, urllib.request, re
# usage: lookup.py out.json id1,id2,...
out, ids = sys.argv[1], sys.argv[2]
d = json.load(urllib.request.urlopen('https://itunes.apple.com/lookup?id=' + ids, timeout=30))
res = []
for r in d['results']:
    res.append({'label': r.get('trackName','')[:38] + ' / ' + r.get('sellerName','')[:22], 'url': r.get('artworkUrl512') or r.get('artworkUrl100'), 'store': r.get('trackViewUrl','').split('?')[0]})
    print(r.get('trackId'), '|', r.get('trackName'), '|', r.get('sellerName'), '|', r.get('trackViewUrl','').split('?')[0])
json.dump(res, open(out, 'w'), indent=1)
