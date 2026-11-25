# Front-End Portfolio

My first web-dev portfolio, made using HTML, CSS, JavaScript, and Sass. Responsive for mobile and desktop, primarily using Flexbox. All SVG icons custom made during mockup/prototying in Figma. Uses Google Fonts, Normalize.CSS, and Auto-Prefixer.

## Development

Use portfolio-local Node 24 LTS. From this directory, run `nvm use` if you use nvm, then:

```sh
npm ci
npm run dev
npm run build
npm run check
npm audit
```

`dev` serves Work at `/work` and `/work.html` with live reload. `build` replaces only the local `dist/` directory. `check` rebuilds and verifies the proof HTML, stylesheet, public asset paths, and output boundaries. To preview the built output with the existing rewrite rules, run this from the repository root using Netlify CLI:

```sh
netlify dev --offline --framework '#static' --dir portfolio/dist --no-open
```

This proof includes the Work introduction and first existing case study. The other portfolio and sibling routes are served by the current deployment and are outside this isolated preview.

## Transitional build and deployment

`src/` contains the new template sources. The proof uses the existing `sass/` tree and reads `public/images/` and `public/resume.pdf` through explicit passthrough mappings. The deployed `public/` tree is a temporary snapshot alongside the new source, not a second place to make editorial changes. The future deployment integration will establish one authoritative source.

The previous command is available as `npm run build:legacy` with the old Babel and PostCSS steps and a legacy-only Sass 1.89.1 alias. The newer Sass compiler changed the legacy CSS bytes, so the alias preserves the audited output. Run it only in a disposable copy of the portfolio because it writes to that copy's `public/` directory. The shared Netlify build still serves the checked-in portfolio snapshot.

See the [baseline](BASELINE.md) and [roadmap](MODERNIZATION.md) before expanding the proof.
