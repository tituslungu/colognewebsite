# Design tools

Scripts used to build and check the design explorations in `designs/`. They
are Node scripts; run them from the repo root. None of them touch the live
site, except `render-icon.mjs`, which rewrites `assets/img/icon.png`.

## Setup

The browser tools use Playwright with Chromium. From the repo root:

```sh
npm i --no-save playwright@1.62.1 && npx playwright install chromium
```

`node_modules/` is git-ignored. To use a Playwright install you already have,
set `PLAYWRIGHT_DIR` to its `node_modules` folder instead.

`gallery.mjs` and `logo-gallery.mjs` don't need Playwright, but they use the
macOS `sips` command to make the JPEGs.

## Environment

| Variable | Used by | Meaning |
| --- | --- | --- |
| `OUT` | all | Where screenshots and review sheets go. Default: `<system temp>/divi-design-tools`. |
| `PLAYWRIGHT_DIR` | browser tools | A `node_modules` folder that contains `playwright`. |
| `FOOTER` | check | `charcoal` or `light`: footer variant to load. |
| `QS` | check | Extra query string, e.g. `buttons=sage&order=whatsapp-first`. |
| `TAG` | check | Added to the screenshot names for a `QS` run. |
| `FILE` | check | Check any HTML file instead of `designs/<slug>/index.html`. |
| `MAP` | check | JSON of `{"hero": ".hero", ...}` to tag elements that lack `data-check`. |
| `LOGOS` | logo-gallery | Concepts file in `data/` (default `logos.json`). |
| `DEE` | logo-gallery | Adds the stylised-D round from a file in `data/` (`dee.json`). |
| `FORK` | logo-gallery | `1` adds the "Fork on dark backgrounds" round. |

## Tools

| Script | What it does | Output |
| --- | --- | --- |
| `check.mjs <slug> [tones] [viewports]` | Loads a homepage option at 12 viewport sizes and checks that it fits one screen, nothing overlaps or sits off-screen, and there are no script errors. Prints PASS/WARN/FAIL per size. | `$OUT/shots/<slug>/` |
| `gallery.mjs` | Builds the homepage comparison page from `data/options*.json` and the `check.mjs` screenshots. | `designs/index.html`, `designs/shots/`, `$OUT/artifact/` |
| `logo-shot.mjs <id>` | Review sheet for one logo concept (sizes, backgrounds, avatar, tabs) plus the icon placed on options C, D and E. Also flags SVG problems. Needs `mark.svg`, `app-icon.svg` and `mark-mono.svg` in `designs/logos/<id>/` (logo rounds 2 and 3); the stylised-D concepts use `colorways.mjs` instead. | `$OUT/logo-shots/<id>/` |
| `colorways.mjs <id>` | Fills a stylised-D concept's `upper/lower.tmpl.svg` with the five colourways and renders a sheet. | SVGs in `designs/logos/<id>/`, sheet in `$OUT/logo-shots/<id>/` |
| `dee-corner.mjs <id> ...` | Option E's top-left corner with each stylised D as the site icon. | `$OUT/logo-shots/<id>/` |
| `fork-sheet.mjs` | Comparison sheet and homepage corners for the Fork dark-background variants. | `$OUT/logo-shots/fork-dark/` |
| `logo-gallery.mjs` | Builds the logo comparison page from `data/logos*.json`, `data/dee.json` and the renders above. | `designs/logos/index.html`, `designs/logos/<id>/preview/`, `$OUT/logo-artifact/` |
| `designs-smoke.mjs` | Loads both comparison pages and every option page; reports broken images, failed loads and script errors. | console |
| `shot-gallery.mjs [dir]` | Screenshots `designs/index.html` (laptop, light; phone, dark) and reports horizontal overflow. | `[dir]` or `$OUT` |
| `shot-logo-gallery.mjs [dir]` | Same for `designs/logos/index.html`, plus broken images. | `[dir]` or `$OUT` |
| `render-icon.mjs` | Renders `assets/img/icon.svg` to the 512px `assets/img/icon.png`. | `assets/img/icon.png` |

`lib.mjs` holds the shared paths (`REPO`, `DESIGNS`, `DATA`, `OUT`) and loads Playwright.

## Examples

```sh
node designs/tools/check.mjs f-fade white                      # all viewports, white tone
FOOTER=charcoal node designs/tools/check.mjs f-fade white desk-1440,ph-390
FOOTER=charcoal TAG=btn-sage-wa QS='buttons=sage&order=whatsapp-first' \
  node designs/tools/check.mjs f-fade white desk-1440,ph-390
node designs/tools/designs-smoke.mjs
```

`gallery.mjs` needs the `desk-1440` and `ph-390` screenshot of every option and
variant it shows. It stops at the first missing one and names the file. To
rebuild `designs/index.html` from scratch:

```sh
for s in a-stack b-split c-overlap d-bleed; do node designs/tools/check.mjs $s all desk-1440,ph-390; done
node designs/tools/check.mjs e-loop white desk-1440,ph-390
for s in c-overlap d-bleed e-loop; do for f in charcoal light; do
  FOOTER=$f node designs/tools/check.mjs $s white desk-1440,ph-390; done; done
for b in soft sage solid mixed; do
  FOOTER=charcoal TAG=btn-$b-im QS="buttons=$b&order=imessage-first" node designs/tools/check.mjs f-fade white desk-1440,ph-390
  FOOTER=charcoal TAG=btn-$b-wa QS="buttons=$b&order=whatsapp-first" node designs/tools/check.mjs f-fade white desk-1440,ph-390
done
node designs/tools/gallery.mjs
```

The current `designs/logos/index.html` needs `logo-shot.mjs` renders for each
concept in `logos-r3.json`, `dee-corner.mjs` for each concept in `dee.json`, and
`fork-sheet.mjs`:

```sh
for id in tilt-up-30 tilt-up-40 tilt-down-30 tilt-down-40 bubble-4; do node designs/tools/logo-shot.mjs $id; done
node designs/tools/dee-corner.mjs dee-ribbon dee-mono dee-min
node designs/tools/fork-sheet.mjs
LOGOS=logos-r3.json DEE=dee.json FORK=1 node designs/tools/logo-gallery.mjs
```

Both pages come out identical to the committed ones. New screenshots give
slightly different JPEGs, because the pages animate. The logo previews on
option E also show its current layout, which changed after logo round 3.

## data/

The inputs to the two gallery pages: `options.json` (round 1),
`options-r3.json`, `options-r4.json`, `logos.json` (logo round 2),
`logos-r3.json` and `dee.json`. Some `siteIcon` fields still hold the original
absolute paths; nothing reads them.

## archive/

The working scripts the design agents wrote during the redesign: logo
generators, sketches and review sheets, the loop animation builder
(`archive/loop/`), probes and one-off checks. Also there: the file lists used
to publish the preview pages (`home-files.json`, `logo-files.json`) and one
checker report (`e-before-charcoal.json`). They are kept for history. They still
point at the temporary session folders they ran from and are not meant to be
re-run as they are. `archive/p2/npm/wordmark.mjs` (imported by
`p2/p1-files.mjs` and `p2/p2-files.mjs`) and `fonts.mjs` need the `fontkit`
npm package, which was installed next to them.
