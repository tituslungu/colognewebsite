import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/icon.png');
const r = await p.evaluate(async () => {
  const img = document.querySelector('img'); await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const d = g.getImageData(0,0,c.width,c.height).data; const W=c.width,H=c.height;
  // ink = saturation-ish: background is pale (r high). ink: r < 120
  const ink=(x,y)=>{const i=(y*W+x)*4; return d[i] < 130;};
  const runs=(get,n)=>{const out=[];let s=-1;for(let i=0;i<n;i++){const v=get(i);if(v&&s<0)s=i;if(!v&&s>=0){out.push([s,i-1]);s=-1;}}if(s>=0)out.push([s,n-1]);return out;};
  const rows={},cols={};
  for(const y of [40,60,70,80,90,100,110,125,140,150,160,170,180,190,200,210]) rows[y]=runs(x=>ink(x,y),W).map(a=>a.join('-')).join(' ');
  for(const x of [40,60,80,90,100,110,120,130,140,150,160,170,180,190,200,210,215]) cols[x]=runs(y=>ink(x,y),H).map(a=>a.join('-')).join(' ');
  let minx=W,maxx=0,miny=H,maxy=0,sx=0,sy=0,n=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(ink(x,y)){minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);sx+=x;sy+=y;n++;}
  return {W,H,bbox:[minx,miny,maxx,maxy],centroid:[sx/n,sy/n],area:n/(W*H),rows,cols};
});
console.log(JSON.stringify(r,null,1)); await b.close();
