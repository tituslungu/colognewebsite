import re
src=open('/Users/titus/repos/colognewebsite/index.html').read()
p=re.findall(r'<path d="([^"]+)"/>', src)
rep=[x for x in p if x.startswith('M12 5V1')][0]
wa=[x for x in p if x.startswith('M17.472')][0]
im1=[x for x in p if x.startswith('M20 2H4')][0]
im2=[x for x in p if x.startswith('M7 9h2')][0]
t=open('template.html').read()
t=t.replace('{{REPLAY}}',rep).replace('{{WA}}',wa).replace('{{IM1}}',im1).replace('{{IM2}}',im2)
assert '{{' not in t
open('/Users/titus/repos/colognewebsite/designs/b-split/index.html','w').write(t)
print('built')
