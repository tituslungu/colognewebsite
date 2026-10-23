import json, glob, os, sys, urllib.parse, re
src, out = sys.argv[1], sys.argv[2]
want = ["Splitwise","tricount","Splid","Tab - The simple","Plates by Splitwise","Split Pay","Settle Up - Group","SplitIt: Group","Divi Money","Divvy: Group","BILL Spend","Divvy | ","Split – Pay","splyt","SplitTab","sunday","Zendesk Support","Zendesk Chat","Intercom Conversations","Crisp","Messenger","WhatsApp","Telegram","Signal - Private","Google Chat","Microsoft Teams","Slack","Marco","Diners Club International","Mercury | Bank","Ramp","Slash Banking","KakaoTalk","Rakuten Viber","LINE","Monzo","Chime","Venmo","Cash App","PayPal - Pay","Revolut: send","Splitit Go","Slice - Order","Divvy Bikes"]
seen = {}
for f in sorted(glob.glob(os.path.join(src,'*.json'))):
    for r in json.load(open(f)).get('results',[]):
        n = r.get('trackName',''); s = r.get('sellerName','')
        key = n + ' | ' + s
        for w in want:
            if (key.startswith(w) or (w.endswith('| ') and key.startswith(w))) and key not in seen:
                seen[key] = r.get('artworkUrl512','').replace('512x512bb','256x256bb')
with open(out,'w') as o:
    for k,u in seen.items():
        slug = re.sub(r'[^a-z0-9]+','-',k.lower())[:40].strip('-')
        o.write(f"{slug}\t{k}\t{u}\n")
print(len(seen))
