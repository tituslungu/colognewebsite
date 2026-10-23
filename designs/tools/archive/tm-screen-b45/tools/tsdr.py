# Summarise a saved TSDR status HTML page. Usage: python3 -I tsdr.py <file>...
import re,sys
for f in sys.argv[1:]:
    t=open(f,errors='ignore').read()
    t=re.sub(r'<script.*?</script>','',t,flags=re.S); t=re.sub(r'<style.*?</style>','',t,flags=re.S)
    t=re.sub(r'<[^>]+>',' ',t); t=re.sub(r'(&nbsp;|\s)+',' ',t)
    def g(k,n):
        i=t.find(k); return t[i:i+n] if i>=0 else '-'
    print('==',f); print(g('Mark:',140)); print(g('Status:',160)); print(g('Description of Mark:',380)); print(g('Owner Name:',110)); print(g('For:',420)); print(g('International Class(es):',60)); print()
