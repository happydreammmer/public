# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Site

No build step or package manager. Open `index.html` directly in a browser, or serve it locally:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

There are no tests or linters configured.

## Architecture

A fully static portfolio. Four files do all the work:

- **`index.html`** — main portfolio page. All four sections (`#home`, `#graphics`, `#presentations`, `#web`) live as `<section>` elements; only one is visible at a time.
- **`cv.html`** — standalone CV/resume page with a PDF download button (uses html2pdf.js from CDN). Links back to `index.html`.
- **`styles.css`** — shared stylesheet for both pages. Uses CSS custom properties in `:root` for the flat-blue palette (`--primary-blue: #2196F3`, etc.). Responsive at 1024px (tablet) and 768px (mobile). CV-specific styles are scoped with `.cv-body`, `.cv-sidebar`, `.cv-page`, etc.
- **`script.js`** — loaded only by `index.html`. Three behaviors: tab navigation (`navigate(pageId)`), lightbox modal (`openLightbox` / `closeLightbox`), and IntersectionObserver-driven scroll-reveal + skill-bar animations.

### Navigation model

`navigate(pageId)` swaps `.active-page` on `<section>` elements and `.active` on `<nav button>` elements. There is no routing library; page state is purely DOM class-based and resets on reload to `#home`.

### Lightbox

`openLightbox(title, description, mediaSrc, tags, metrics, mediaType)` supports three media types (`'image'`, `'video'`, `'pdf'`). All three media elements (`<img>`, `<video>`, `<iframe>`) are always in the DOM; the function shows the correct one and hides the others. Close via `closeLightbox()`, the × button, or Escape key.

### CV PDF Download

`cv.html` uses html2pdf.js (loaded from cdnjs CDN) to generate a PDF from `.cv-page`. The `downloadCV()` function strips box-shadow and border-radius before render and restores them after. Print styles hide `.cv-topbar` for clean output.

### CSS scope — shared stylesheet

`styles.css` serves both pages. Portfolio-page styles use bare element selectors (`aside`, `main`, `nav`). CV-page styles are scoped under `body.cv-body` and class selectors (`.cv-sidebar`, `.cv-main`, etc.). A `@media (max-width: 768px)` override on `.cv-sidebar` prevents the portfolio's mobile `aside { position: sticky }` rule from leaking into the CV layout.

### Assets

Static files in `assets/`: `.jpg`, `.png`, `.webp` for images; `.mp4` for videos; `.pdf` for pitch decks. `hatef.jpg` (profile photo) sits at the portfolio root and is shared by both pages. The downloadable CV PDF is `Hatef Mohammad Ali - Designer.pdf` at the portfolio root.

### Fonts

Inter and Outfit loaded from Google Fonts. Inter is used for headings and UI labels; Outfit for body text.
