from PIL import Image
import sys
ims=[Image.open(f) for f in sys.argv[2:]]
w=sum(i.width for i in ims); h=max(i.height for i in ims)
o=Image.new('RGB',(w+10*len(ims),h),'white'); x=0
for i in ims: o.paste(i,(x,0)); x+=i.width+10
o.save(sys.argv[1])
