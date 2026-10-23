import { createRequire } from 'module';
const require = createRequire('/Users/titus/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');
const SP='/private/tmp/claude-501/-Users-titus-repos-colognewebsite/c94fcea5-365f-47cd-a42a-021d194de6cf/scratchpad';
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1300,height:300}});
await p.goto('file://'+SP+'/montage.html'); await p.waitForTimeout(500);
await p.screenshot({path: SP+'/crops/focus-montage.png', fullPage:true}); await b.close();
