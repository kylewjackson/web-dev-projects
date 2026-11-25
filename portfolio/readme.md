# Front-End Portfolio

My first web-dev portfolio, with custom SVG icons made in Figma. The modern build uses Eleventy, Liquid, Dart Sass, and native JavaScript.

## Development

Use portfolio-local Node 24 LTS. From this directory, run `nvm use` if you use nvm, then:

```sh
npm ci
npm run dev
npm run build
npm run check
npm audit
```

`dev` serves Home, About, Projects, and Work with live reload. `build` replaces only the local `dist/` directory. `check` rebuilds and verifies static content and navigation, Work fragments, local references, asset parity, and output boundaries. To preview the built output with the existing rewrite rules, run this from the repository root using Netlify CLI:

```sh
netlify dev --offline --framework '#static' --dir portfolio/dist --no-open
```

The preview serves `/`, `/about`, `/projects`, and `/work`, their flat HTML equivalents, and both résumé PDFs. Project cards retain their production destinations. Sibling projects and course archives require the composed monorepo preview. If the Netlify static port is occupied, pass `--staticServerPort` with a free port.

### Browser checks

Run the optional checkers against a running local preview. The About checker covers profile and tool links, About reveals, and navigation across all four pages with scripts unavailable. The project checker covers Home and Projects navigation, cards, reflow, and fallbacks. The Work checker covers fragment navigation, the contents control, and the screenshot viewer. Chromium screenshots and axe reports go to the ignored `.baseline/{about,project,work}-browser/` directories by default.

Use an existing npm directory containing Playwright and axe-core, or install them in a disposable directory as shown here.

```sh
browser_tools=$(mktemp -d)
npm install --prefix "$browser_tools" playwright axe-core
"$browser_tools/node_modules/.bin/playwright" install chromium
node tooling/check-about-browser.mjs --url http://localhost:8080 --tool-root "$browser_tools"
node tooling/check-project-browser.mjs --url http://localhost:8080 --tool-root "$browser_tools"
node tooling/check-work-browser.mjs --url http://localhost:8080 --tool-root "$browser_tools"
```

Use `--executable` to launch an installed Chromium browser and `--out` to choose a different evidence directory. See the [browser QA skill](.agents/skills/portfolio-browser-qa/SKILL.md) for the manual review.

## Transitional build and deployment

`src/` owns the four page templates, shared layout and partials, data, modern Sass, and optional browser modules. Home and Projects use the project-card partial and `src/_data/projects.json`. Home and About use the skill-tile partial and `src/_data/skills.json`. Work metadata lives in `src/_data/workStudies.json` and case-study bodies in `src/_includes/case-studies/`. The build layers migration styles over the shared `sass/` tree and uses explicit passthrough mappings for `public/images/` and the two résumé PDFs. Treat `public/` as the read-only production snapshot until deployment integration.

The previous command is available as `npm run build:legacy` with the old Babel and PostCSS steps and a legacy-only Sass 1.89.1 alias. That compiler preserves the audited CSS bytes. To verify the legacy output after a locked install, run `node tooling/check-legacy-build.mjs` from `portfolio/`. It builds in a disposable copy and compares the generated CSS and both scripts to production. The shared Netlify build still serves the checked-in portfolio snapshot.

See the [baseline](BASELINE.md) and [roadmap](MODERNIZATION.md) for the migration status and review boundaries.
