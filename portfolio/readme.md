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

`dev` serves Home, Projects, and Work with live reload. `build` replaces only the local `dist/` directory. `check` rebuilds and verifies the static project catalog, Work content and fragments, asset parity, and output boundaries. To preview the built output with the existing rewrite rules, run this from the repository root using Netlify CLI:

```sh
netlify dev --offline --framework '#static' --dir portfolio/dist --no-open
```

The preview serves `/`, `/projects`, and `/work` and their flat HTML equivalents. About and the sibling projects are outside this isolated preview. Project cards retain their production destinations.

### Browser checks

Run the optional checkers against a running local preview. The project checker covers Home and Projects navigation, card behavior, reflow, and script and motion fallbacks. The Work checker covers fragment navigation, the contents control, and the screenshot viewer. Chromium screenshots and axe reports go to the ignored `.baseline/project-browser/` and `.baseline/work-browser/` directories by default.

Use an existing npm directory containing Playwright and axe-core, or install them in a disposable directory as shown here.

```sh
browser_tools=$(mktemp -d)
npm install --prefix "$browser_tools" playwright axe-core
"$browser_tools/node_modules/.bin/playwright" install chromium
node tooling/check-project-browser.mjs --url http://localhost:8080 --tool-root "$browser_tools"
node tooling/check-work-browser.mjs --url http://localhost:8080 --tool-root "$browser_tools"
```

Use `--executable` to launch an installed Chromium browser and `--out` to choose a different evidence directory. See the [browser QA skill](.agents/skills/portfolio-browser-qa/SKILL.md) for the manual review.

## Transitional build and deployment

`src/` contains the new template sources. Home and Projects share `src/_data/projects.json` and the Liquid project-card partial. The catalog order controls Projects, and `featuredOnHome` selects the Home subset in that same order. Its project IDs also select the existing responsive device previews in Sass. Work metadata lives in `src/_data/workStudies.json`, and the case-study bodies live in `src/_includes/case-studies/`. The build layers migration styles over the existing `sass/` tree and reads `public/images/` and `public/resume.pdf` through explicit passthrough mappings. Treat `public/` as the read-only production snapshot until the deployment integration phase.

The previous command is available as `npm run build:legacy` with the old Babel and PostCSS steps and a legacy-only Sass 1.89.1 alias. The newer Sass compiler changed the legacy CSS bytes, so the alias preserves the audited output. Run it only in a disposable copy of the portfolio because it writes to that copy's `public/` directory. The shared Netlify build still serves the checked-in portfolio snapshot.

See the [baseline](BASELINE.md) and [roadmap](MODERNIZATION.md) for the migration status and review boundaries.
