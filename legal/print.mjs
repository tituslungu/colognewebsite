// Prints the legal documents in this folder to the PDFs the site links to.
// Usage (from the repo root): node legal/print.mjs [privacy|terms] [--out <dir>]
//   With no name, prints both. --out writes to another folder instead of
//   assets/docs/ (handy for checking a change before replacing the live PDFs).
// Needs Playwright with Chromium; see designs/tools/README.md (PLAYWRIGHT_DIR).
import path from 'path';
import { pathToFileURL } from 'url';
import { REPO, chromium } from '../designs/tools/lib.mjs';

// Each document keeps the page setup it was originally printed with, so a
// re-print lands every word where it was.
const footer = (name, padding, extra = '') =>
  `<div style="box-sizing:border-box;width:100%;padding:${padding};display:flex;justify-content:space-between;${extra}` +
  `font-family:Arial,'Liberation Sans',Helvetica,sans-serif;font-size:8px;color:#363636;-webkit-print-color-adjust:exact;">` +
  `<span>Divi — ${name}</span><span>justdivi.com</span>` +
  `<span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;

const DOCS = {
  privacy: {
    html: 'privacy-policy.html',
    pdf: 'Divi-Privacy-Policy.pdf',
    pdfOptions: {
      margin: { top: '20mm', right: '22.5mm', bottom: '22.5mm', left: '22.5mm' },
      footerTemplate: footer('Privacy Policy', '0 0.9in'),
    },
  },
  terms: {
    html: 'terms-of-service.html',
    pdf: 'Divi-Terms-of-Service.pdf',
    pdfOptions: {
      preferCSSPageSize: true,
      margin: { top: '76px', right: '85px', bottom: '85px', left: '85px' },
      footerTemplate: footer('Terms of Service', '0 86.4px 0', 'align-items:flex-end;line-height:normal;'),
    },
  },
};

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : path.join(REPO, 'assets', 'docs');
const names = args.filter((a, i) => !a.startsWith('--') && i !== outIdx + 1);
for (const n of names) if (!DOCS[n]) { console.error(`unknown document "${n}" (use: ${Object.keys(DOCS).join(', ')})`); process.exit(2); }

const browser = await chromium.launch();
for (const name of names.length ? names : Object.keys(DOCS)) {
  const doc = DOCS[name];
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.join(REPO, 'legal', doc.html)).href, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  const out = path.join(outDir, doc.pdf);
  await page.pdf({
    path: out,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    ...doc.pdfOptions,
  });
  await page.close();
  console.log('wrote', path.relative(process.cwd(), out));
}
await browser.close();
