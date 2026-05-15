# Epson Rich Content Preview

1WorldSync Rich Content preview site for Epson ReadyPrint products. Replicates the ContentCast rendering used on Staples product pages for client review via Pastel.

## Products

| SKU | Model | Status |
|-----|-------|--------|
| ET-2980U | Epson EcoTank® ET-2980U | Active |

## Development

Static site — no build step. Serve locally:

```bash
npx serve .
```

Then visit `http://localhost:3000/et-2980u`.

## Deployment

Deployed to Cloudflare Pages. Push to `main` triggers auto-deploy.

- Production: `epson-rich-content.pages.dev`
- Interactive: `epson-rich-content.pages.dev/et-2980u`
- Expanded: `epson-rich-content.pages.dev/et-2980u?expanded=all`
