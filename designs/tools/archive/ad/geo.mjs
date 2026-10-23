export const K = '#2D2D2D', S = '#6FAF8E', SL = '#8CC4A5', SD = '#3E7A5B', DS = '#24382E', W = '#FAFAF8', G = '#ECEBE8', WH = '#FFFFFF';
export const n = v => +(+v).toFixed(2);
export const rad = d => d * Math.PI / 180;
export const P = (cx, cy, R, deg) => [cx + R * Math.cos(rad(deg)), cy + R * Math.sin(rad(deg))];
export const svg = (body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${bg ? `<rect width="256" height="256" fill="${bg}"/>` : ''}${body}</svg>`;
export const circ = (x, y, r, f) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${f}"/>`;
export const rrect = (x, y, w, h, r, f) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" fill="${f}"/>`;
let mid = 0;
// shape (svg element string w/o fill -> uses fill attr), notches [{x,y,r}] cut out via mask
export function notched(shapeEls, cuts, fill) {
  const id = 'm' + (mid++);
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><rect width="256" height="256" fill="#fff"/>${cuts.map(c => circ(c.x, c.y, c.r, '#000')).join('')}</mask><g mask="url(#${id})" fill="${fill}">${shapeEls}</g>`;
}
