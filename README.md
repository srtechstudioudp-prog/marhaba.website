# marhaba.website

Static site for Marhaba Heavy Equipment Trading LLC (marhabaheavyequip.com), replacing the old HTML site and the Odoo draft.

- `node site/build.mjs` builds `public/` from `site/content/*.mjs`. It prints a per-page SEO report and fails on broken internal links.
- `python -I tools/make_images.py` regenerates web images and favicons from `_src/` (old-site images, gitignored).
- Content rules: `seo-content/FACTS.md`. Open items: `seo-content/CLIENT-CHECKLIST.md`.
- Deploy: Vercel, output dir `public`. `vercel.json` holds redirects from the old URLs.
- Mode: BASIC SEO (no paid APIs). `seo-content/.basic-mode` blocks the API scripts.
