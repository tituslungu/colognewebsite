// Shared paths and Playwright for the design tools.
//   REPO      the repo root (resolved from this file's location, so the tools run from any directory)
//   DESIGNS   REPO/designs
//   DATA      designs/tools/data (options*.json, logos*.json, dee.json)
//   OUT       scratch output (screenshots, review sheets): $OUT, or <os tmpdir>/divi-design-tools
//   chromium  Playwright's chromium, from $PLAYWRIGHT_DIR (a node_modules folder) if set, otherwise from
//             a playwright install resolvable from the repo (see README.md)
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import path from 'path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '..', '..');
export const DESIGNS = path.join(REPO, 'designs');
export const DATA = path.join(HERE, 'data');
export const OUT = path.resolve(process.env.OUT || path.join(os.tmpdir(), 'divi-design-tools'));
fs.mkdirSync(OUT, { recursive: true });

// Loaded here but only required when a tool launches a browser, so the page generators run without it.
const PW_DIR = process.env.PLAYWRIGHT_DIR;
let pw = null, pwError = null;
try {
  pw = createRequire(path.join(PW_DIR ? path.resolve(PW_DIR) : REPO, 'noop.js'))('playwright');
} catch (e) { pwError = e; }

export const chromium = pw ? pw.chromium : {
  launch() {
    console.error((PW_DIR ? `Could not load playwright from PLAYWRIGHT_DIR=${PW_DIR}.` : 'Could not find playwright.') + `
Install it from the repo root (node_modules/ is git-ignored):
  npm i --no-save playwright@1.62.1 && npx playwright install chromium
or set PLAYWRIGHT_DIR to a node_modules folder that already contains playwright.
(${pwError.message.split('\n')[0]})`);
    process.exit(1);
  },
};
