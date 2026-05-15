# epson-rich-content

1WorldSync Rich Content preview site for Epson ReadyPrint products (Staples).

## Stack

Vanilla HTML/CSS/JS static site deployed to Cloudflare Pages. No build step.

## Structure

- `data/` — Product JSON files (one per SKU)
- `assets/products/<sku>/` — Product images (SVG placeholders until design delivers finals)
- `src/styles.css` — 1WS-matching styles (Motiva Sans, ~1200px max width)
- `src/renderer.js` — JSON fetch, path-based routing, HTML rendering
- `src/carousel.js` — Dot-nav carousel with auto-advance
- `src/hotspots.js` — Hotspot marker click/popup interaction
- `index.html` — SPA entry point
- `_redirects` — Cloudflare Pages SPA routing

## Content Workflow

1. Parse Epson's XLSX content matrix
2. Populate/update product JSON in `data/`
3. Commit and push — Cloudflare Pages auto-deploys
4. Preview at `epson-rich-content.pages.dev/<sku>`

## View Modes

- Interactive (default): `/et-2980u` — working carousels, clickable hotspots
- Expanded: `/et-2980u?expanded=all` — all content stacked vertically for Pastel review

## Adding a Product

1. Create `data/<sku>.json` following the existing schema
2. Create `assets/products/<sku>/` with images
3. Add entry to `PRODUCTS` array in `src/renderer.js`
