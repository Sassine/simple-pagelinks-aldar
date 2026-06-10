# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static "link-in-bio" (linktree-style) site for **Al Dar Restaurante** (Bauru, Brazil). Pure HTML/CSS/vanilla JS — no build step, no framework, no package manager. UI copy is in Brazilian Portuguese (`lang="pt-BR"`).

Two pages plus shared assets:
- `index.html` — landing page: brand block, opening hours, and the primary action links (menu, iFood, WhatsApp, Maps) plus an Instagram social link.
- `menu.html` — renders `assets/menu.pdf` page-by-page to `<canvas>` using pdf.js loaded from cdnjs. Falls back to an "Abrir PDF" link if rendering fails.
- `assets/` — `logo.jpg`, `menu.pdf` (the drinks menu, ~2 MB), and `ga4.js`.

## Running locally

No tooling required — open `index.html` directly, or serve the folder over HTTP (needed for `menu.html`, since pdf.js fetches `assets/menu.pdf` and `file://` will be blocked by CORS):

```sh
python -m http.server 8000   # then open http://localhost:8000
```

To reproduce the production setup (nginx, SPA-style fallback, cache headers):

```sh
docker build -t aldar .
docker run --rm -p 8080:80 aldar
```

## Architecture notes

- **All CSS is inlined** in a `<style>` block in each HTML file — there is no shared stylesheet. The design-system tokens (`--azul-profundo`, `--dourado`, etc.) are duplicated in the `:root` of both pages; keep them in sync when changing brand colors. Fonts are Cormorant Garamond (headings) + Inter (body) from Google Fonts.

- **Analytics**: `assets/ga4.js` bootstraps GA4 (Measurement ID is hardcoded in the file). It defines `window.gtag` defensively, so pages call `gtag(...)` only after a `typeof window.gtag === 'function'` guard. Tracked events:
  - `index.html`: a delegated click handler fires `click_link` for every element with a `data-track` attribute, with `link_name`, `link_url`, and an `outbound` boolean. **To add a tracked link, just add `data-track="<name>"` to the anchor** — no JS change needed.
  - `menu.html`: fires `menu_view_complete` (with page count) on success, `menu_view_failed` on error.

- **Outbound links** carry UTM params (`utm_source=linktree-aldar&utm_medium=link&utm_campaign=<channel>`). Preserve this convention when adding/editing external links. In HTML, `&` is written as `&amp;`.

- **PDF viewer** (`menu.html`): pdf.js is pinned to 3.11.174 on cdnjs, and `GlobalWorkerOptions.workerSrc` must point at the matching `pdf.worker.min.js` version. Rendering scales the canvas by `devicePixelRatio` for sharpness on retina screens.

## Deployment

`Dockerfile` copies the repo into `nginx:1.27-alpine` and removes the Docker/nginx files from the served root. `nginx.conf` sets a SPA fallback (`try_files ... /index.html`), 30-day immutable caching for static assets, `no-cache` for `index.html`, and gzip. `.dockerignore` keeps `.git`, README, editor configs, etc. out of the image.
