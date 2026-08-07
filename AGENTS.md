# epson-rich-content

1WorldSync Rich Content preview site for Epson ReadyPrint products (Staples).

## Stack

Vanilla HTML/CSS/JS static site deployed to Cloudflare Pages. No build step.
All 1WS rendering resources (CSS, JS, fonts) loaded from the 1WS CDN (`cdn.cs.1worldsync.com`).
Interactive features (carousels, hotspots, element queries) initialized via 1WS `ccs_require('inlineContent')`.

## Structure

- `index.html` — SPA entry point: CDN links, routing, rendering, 1WS init (all inline)
- `data/` — Product JSON files (one per SKU)
- `assets/products/<sku>/` — Product images
- `_redirects` — Cloudflare Pages SPA routing

## Content Workflow

1. Parse Epson's XLSX content matrix
2. Populate/update product JSON in `data/`
3. Commit and push — Cloudflare Pages auto-deploys
4. Preview at `epson-rich-content.pages.dev/<sku>`

## View Modes

- Interactive (default): `/<sku>` — 1WS-initialized carousels and hotspots
- Expanded: `/<sku>?expand=all` or `?expanded=all` — all content stacked vertically for Pastel review

## Adding a Product

1. Create `data/<sku>.json` following the existing schema
2. Create `assets/products/<sku>/` with images
3. Add entry to `PRODUCTS` array in `index.html`
