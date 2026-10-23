import * as fontkit from 'fontkit';
const c = fontkit.openSync('/System/Library/Fonts/HelveticaNeue.ttc');
for (const f of c.fonts) console.log(f.postscriptName, f.unitsPerEm, f.capHeight);
