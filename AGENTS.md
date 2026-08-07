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

## Deploy gate

This repo auto-deploys: the push in step 3 of the Content Workflow above is the deploy, so it is the last moment anything can be checked. `.githooks/pre-push` runs one check.

**Secrets scan.** Only the lines **added** by the outgoing commits are scanned for credential-shaped strings (AWS key IDs, private-key blocks, GitHub/Neon/Cloudflare tokens, long literals assigned to password/secret/token/api_key names). Lockfiles are excluded; lines containing `example`, `placeholder`, `xxx`, or `REDACTED` are treated as illustrative. A hit prints the file, line, and pattern name — never the matched value — and blocks the push.

There is **no test check**, because this repo has no test suite (vanilla HTML/CSS/JS, no build step). The gate does not pretend otherwise; a gate that claimed test coverage that does not exist would be worse than no gate. If a suite is added, add the check then.

Arm it once per clone — `core.hooksPath` is local config that nothing in the repo can set for you:

```bash
git config core.hooksPath .githooks    # or: sh .githooks/install-hooks.sh
```

`git push --no-verify` skips the hook. That override exists on purpose, for the case where the gate is wrong — but nothing records that it was used, so **say so out loud** when you use it.
