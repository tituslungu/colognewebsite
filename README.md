# colognewebsite

Static site published with GitHub Pages at
<https://tituslungu.github.io/colognewebsite/>.

## Layout

```
index.html              landing page
404.html                served for unknown paths (styles inlined on purpose)
assets/css/styles.css   site styles
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

## Notes

- Links use relative paths (`assets/…`, `./`) so the site works both under the
  `/colognewebsite/` subpath and at a domain root.
- Custom domain: add a `CNAME` file containing the domain, set the DNS records,
  then update the absolute link in `404.html` to `/`.
- Adding a build tool (Vite, Astro, 11ty, …): install and build in the workflow
  before the upload step, and change `upload-pages-artifact`'s `path` to the
  build output directory.
