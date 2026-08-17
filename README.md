# colognewebsite

Static site published with GitHub Pages at
<https://cologneagent.com>.

## Layout

```
CNAME                   custom domain (must ship in the deploy artifact)
index.html              the site — a single page
404.html                served for unknown paths
assets/css/styles.css   site styles (shared by both pages)
assets/img/table.jpg    full-bleed background
assets/img/icon.png     favicon and top-left mark
.nojekyll               skip Jekyll processing; serve files as-is
.github/workflows/      deploy workflow
```

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
mostly works too, but a server matches production behavior more closely.

## Placeholders to replace

- `assets/img/icon.png` — placeholder logo; it has an opaque light-blue square
  background, so it reads as a tile over the photo.
- `assets/img/table.jpg` — placeholder background (Pexels, free for commercial
  use, no attribution required). Not yet the intended shot: it lacks the receipt
  and the hand photographing it.

## Notes

- `index.html` uses relative asset paths; `404.html` uses root-relative ones,
  since it is served from arbitrary URL depths.
- `/tos` and `/privacy` are stub pages (`tos/index.html`, `privacy/index.html`)
  that instantly redirect to the PDFs in `assets/docs/`. To update a document,
  replace the PDF; to rename one, also update the matching stub's URLs.
- `--footer-gap` in the CSS drives the spacing inside both footer groups, which
  is what keeps the two pairs visually matched.
- Custom domain is `cologneagent.com`, set in the repo's Pages settings AND in
  the `CNAME` file. Both are needed: with Actions-based deploys GitHub does not
  create `CNAME` for you, and a deploy whose artifact lacks it can clear the
  domain setting. DNS is four apex A records at GitHub's IPs plus a `www` CNAME
  to `tituslungu.github.io`.
- Adding a build tool (Vite, Astro, 11ty, …): install and build in the workflow
  before the upload step, and change `upload-pages-artifact`'s `path` to the
  build output directory.
