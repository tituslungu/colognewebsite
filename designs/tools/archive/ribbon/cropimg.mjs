// node cropimg.mjs src.png out.png x y w h scale  (pixel coords of src)
import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright'); const fs = require('fs');
const [,, src, out, x, y, w, h, s] = process.argv.map((v,i)=>i>3?+v:v);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w*s, height: h*s } });
fs.writeFileSync(out + '.html', `<body style="margin:0;overflow:hidden"><img id=i src="file://${src}" style="position:absolute;image-rendering:pixelated"></body>`);
await p.goto('file://' + out + '.html');
await p.evaluate(([x,y,s]) => { const i = document.getElementById('i'); i.style.width = i.naturalWidth*s + 'px'; i.style.left = -x*s + 'px'; i.style.top = -y*s + 'px'; }, [x,y,s]);
await p.waitForTimeout(100); await p.screenshot({ path: out }); await b.close();
