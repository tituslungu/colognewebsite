# colognewebsite

Static site published with GitHub Pages at
<https://justdivi.com>.

## Layout

```
CNAME                      custom domain (must ship in the deploy artifact)
index.html                 the site: a single page
404.html                   served for unknown paths
assets/css/styles.css      site styles (shared by both pages)
assets/img/table.jpg       header photo
assets/img/icon.svg        the Divi mark (white D on a sage tile); SVG favicon, top-left mark
assets/img/icon.png        512px PNG of icon.svg: fallback favicon, apple-touch-icon
assets/img/divi-loop.svg   the looping "how it works" animation
assets/img/divi-still.svg  its still frame, shown instead under reduced motion
assets/docs/               Terms of Service and Privacy Policy PDFs
tos/, privacy/             stub pages that redirect to those PDFs
.nojekyll                  skip Jekyll processing; serve files as-is
.github/workflows/         deploy workflow
designs/                   design explorations (preview-only; the site never links to them)
assets/img/divi-web-charcoal-sage.svg
                           the original play-once animation, used by the older previews
```

## Design explorations

`designs/` keeps the work that led to the current page. With the local server
running, open:

- `/designs/` — homepage options A–F side by side (each opens live, with a
  switcher for background, footer, button colours and button order).
- `/designs/logos/` — the logo concepts, including the chosen D
  (`designs/logos/dee-mono`), with lookalike/trademark screens.

The pages load `designs/preview.js` for their switchers and reuse the site's
assets; changing the site does not update the screenshots in `designs/shots/`.

## Design

- A white panel with the header photo (icon and DIVI wordmark over it)
  fading into it: the photo goes soft, then pale, with no hard edge.
- The looping animation sits in a charcoal card that overlaps the photo:
  centred under DIVI on phones and portrait tablets, on the right with the
  call to action on the left on wide screens. With "reduce motion" on, a
  `<picture>` swaps in `divi-still.svg` (a media query inside an SVG loaded
  by `<img>` is not reliably applied).
- Soft (pale-tinted) iMessage and WhatsApp buttons, iMessage first. On phones
  they read "iMessage" / "WhatsApp"; "Use on" stays in the accessible name.
- A charcoal footer band.
- The page fits one screen at common sizes: the animation card is the part
  that grows and shrinks with the space available.
- `404.html` reuses the same photo band and footer around its message.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which uploads the repo
root and publishes it. One-time setup in the repo settings:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Or from the CLI:

```sh
gh api -X POST repos/tituslungu/colognewebsite/pages -f build_type=workflow
```

The first deploy takes a minute or two; after that pushes go live in ~30s.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly via `file://`
mostly works too, but its root-relative links (`/`, `/tos`, `/privacy`) and
`404.html` need the server.

## Placeholders to replace

- `assets/img/table.jpg` — placeholder header photo (Pexels, free for commercial
  use, no attribution required). Not yet the intended shot: it lacks the receipt
  and the hand photographing it.

## Notes

- `index.html` uses relative asset paths; `404.html` uses root-relative ones,
  since it is served from arbitrary URL depths.
- `/tos` and `/privacy` are stub pages (`tos/index.html`, `privacy/index.html`)
  that instantly redirect to the PDFs in `assets/docs/`. To update a document,
  replace the PDF; to rename one, also update the matching stub's URLs.
- `icon.png` is a 512px render of `icon.svg`. If the SVG changes, re-export the PNG
  at 512x512 so the iPhone home-screen icon and older browsers match.
- Custom domain is `justdivi.com`, set in the repo's Pages settings AND in
  the `CNAME` file. Both are needed: with Actions-based deploys GitHub does not
  create `CNAME` for you, and a deploy whose artifact lacks it can clear the
  domain setting. DNS is four apex A records at GitHub's IPs plus a `www` CNAME
  to `tituslungu.github.io`.
- Adding a build tool (Vite, Astro, 11ty, …): install and build in the workflow
  before the upload step, and change `upload-pages-artifact`'s `path` to the
  build output directory.
