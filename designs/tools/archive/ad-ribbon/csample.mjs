import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file:///Users/titus/repos/colognewebsite/assets/img/icon.png');
const r = await p.evaluate(async () => {
  const img = document.querySelector('img'); await img.decode();
  const c = document.createElement('canvas'); c.width = 256; c.height = 250;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const at=(x,y)=>{const d=g.getImageData(x,y,1,1).data;return '#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');};
  const pts={outerLeft:[35,125],outerTopL:[80,45],outerTop:[130,27],outerTopR:[180,42],hookTop:[208,62],outerBotL:[80,205],outerBot:[130,216],outerBotR:[180,207],hookBot:[208,185],innerLeft:[75,125],innerTop:[130,64],innerBot:[130,183],innerTopR:[180,80],innerBotR:[180,165],tileTop:[128,4],tileBot:[128,246],tileL:[4,125],tileR:[252,125]};
  const o={};for(const k in pts)o[k]=at(...pts[k]);return o;});
console.log(r); await b.close();
