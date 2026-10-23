# Legal documents

The sources for the Terms of Service and Privacy Policy PDFs in
`assets/docs/`, which `/tos` and `/privacy` redirect to.

- `terms-of-service.html` → `assets/docs/Divi-Terms-of-Service.pdf`
- `privacy-policy.html` → `assets/docs/Divi-Privacy-Policy.pdf`
- `print.mjs` prints them with Chromium, using the page setup each was
  originally printed with (Letter, the same margins and the running footer
  "Divi — … · justdivi.com · Page N of M").

To change a document, edit its HTML (and its "Effective date / Last updated"
line), then from the repo root:

```sh
node legal/print.mjs              # both
node legal/print.mjs terms        # or just one: privacy | terms
node legal/print.mjs --out /tmp   # print elsewhere to check before replacing
```

Playwright with Chromium is needed; see `designs/tools/README.md`
(`PLAYWRIGHT_DIR`).

The HTML was rebuilt from the original Cologne PDFs (printed from HTML whose
source was lost) and then updated for Divi: Divi LLC, a limited liability
company, info@justdivi.com and justdivi.com. The pre-rename versions are in
git history (`git show a3abfa5:assets/docs/Divi-Terms-of-Service.pdf`).
