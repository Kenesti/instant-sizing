# Insightsize

A full rebuild of the Instasize concept as a real, working web app — AI photo tools for creators — plus a complete SEO comparison funnel. Built with Next.js 15 (App Router), React 19, and Tailwind CSS v4.

> Demo project for educational purposes. Not affiliated with Instasize.

## What's inside

### Working tools (all client-side, no uploads)

| Tool | Route | How it works |
| --- | --- | --- |
| Image Resizer | `/resize` | Canvas resampling with fit/fill/stretch modes, 13 platform presets, exact pixel output |
| Image Compressor | `/compress` | Quality slider, JPG/WebP encoding, live size-delta preview |
| Image Converter | `/convert` | PNG ↔ JPG ↔ WebP with transparency handling |
| AI Background Remover | `/background-remover` | **Real AI**: `@imgly/background-removal` runs an ONNX segmentation model in-browser via WASM; transparent PNG export |
| AI Upscaler | `/upscale` | Multi-pass high-quality resampling with edge enhancement, 2×/4× |
| AI Image Expand | `/expand` | Edge-aware canvas extension to target aspect ratios |

### Site

- Landing page with hero upload, tools grid, pricing, reviews, FAQ
- Auth (signup/login, localStorage accounts) and dashboard with history, credits, usage stats
- Size guide hub + 13 platform guides with exact dimensions
- Guides index
- 404, sitemap (`/sitemap.xml`), robots (`/robots.txt`)

### SEO comparison funnel

- `/compare` — hub listing all comparisons
- `/compare/[competitor]` — 8 comparison pages: Instasize, Canva, Picsart, Photoroom, Pixlr, Pixelcut, VSCO, Snapseed
- Each page: keyword-targeted title/H1, unique meta + Open Graph, side-by-side table, pros/cons, honest verdict, FAQ, CTA, and JSON-LD structured data (Product, FAQPage, BreadcrumbList)
- Internal links: landing → hub, hub ↔ comparison pages, comparison pages → each other

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start   # production
```

## Notes

- `package-lock.json` is not committed; `npm install` regenerates it from the pinned versions in `package.json`.
- The background remover downloads ~40 MB of model assets on first use, then caches them. It runs entirely on-device.
- Accounts and history are localStorage-based demo state; there is no backend by design (privacy is the product's core premise).
- Sample photos offered in the upload zone are generated client-side with canvas — no binary assets in the repo.
