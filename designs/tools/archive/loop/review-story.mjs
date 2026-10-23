import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const pw = require('playwright');
const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 530, height: 655 } });
async function open(p){const pg=await ctx.newPage();await pg.goto('file://'+p);await pg.waitForTimeout(200);await pg.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));return pg;}
async function at(pg,t){await pg.evaluate(ms=>document.getAnimations().forEach(a=>{a.currentTime=ms}),t*1000);await pg.waitForTimeout(30);return pg.screenshot();}
const L=await open('/Users/titus/repos/colognewebsite/designs/e-loop/divi-loop.svg'), O=await open('/Users/titus/repos/colognewebsite/assets/img/divi-web-charcoal-sage.svg');
const dp=await ctx.newPage();
async function diff(b1,b2){return dp.evaluate(async([s1,s2])=>{const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+s});const[i1,i2]=await Promise.all([load(s1),load(s2)]);const g=i=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);return x.getImageData(0,0,i.width,i.height).data};const a=g(i1),c=g(i2);let n=0,n2=0,m=0;for(let k=0;k<a.length;k+=4){const d=Math.max(Math.abs(a[k]-c[k]),Math.abs(a[k+1]-c[k+1]),Math.abs(a[k+2]-c[k+2]));if(d)n++;if(d>2)n2++;if(d>m)m=d}return{n,n2,m}},[b1.toString('base64'),b2.toString('base64')]);}
const ts=[];for(let t=0;t<=17.4;t+=0.1)ts.push(+t.toFixed(2));ts.push(4.199999999999999,4.2000001,4.19,4.21);
let bad=[];for(const t of ts){const d=await diff(await at(L,t),await at(O,t));if(d.n2>0)bad.push(t+':'+JSON.stringify(d));}
console.log('frames checked',ts.length,'with >2 deltas:',bad.length);console.log(bad.join('\n'));
await b.close();
