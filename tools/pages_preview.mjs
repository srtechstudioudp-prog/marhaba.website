// Builds docs/ for GitHub Pages (https://<user>.github.io/marhaba.website/) from public/.
// Pages serves under a sub-path, so root-relative links (/assets/..., /cranes/) get the base prefix.
// The copy is noindex: the real site lives at the production domain (Vercel, output dir public).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public');
const DST = path.join(ROOT, 'docs');
const BASE = '/marhaba.website';

const prefix = (html) => html
  .replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`)
  .replace(/\b(srcset|imagesrcset)="([^"]*)"/g, (_, a, v) => `${a}="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}/`)}"`)
  .replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,nofollow">');

fs.rmSync(DST, { recursive: true, force: true });
let n = 0;
(function copy(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copy(a, b);
    else if (e.name.endsWith('.html')) { fs.writeFileSync(b, prefix(fs.readFileSync(a, 'utf8'))); n++; }
    else fs.copyFileSync(a, b);
  }
})(SRC, DST);
fs.rmSync(path.join(DST, 'sitemap.xml'), { force: true });
fs.writeFileSync(path.join(DST, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(DST, '.nojekyll'), '');
console.log(`docs/ ready: ${n} pages rewritten for ${BASE}/`);
