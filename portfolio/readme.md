# Front-End Portfolio

My first web-dev portfolio, with custom SVG icons made in Figma. The modern build uses Eleventy, Liquid, Dart Sass, and native JavaScript.

## Development

Use portfolio-local Node 24 LTS. From this directory, run `nvm use` if you use nvm, then:

```sh
npm ci
npm run dev
npm run build
npm run check
npm audit --omit=dev
npm audit --include=dev
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

For a full-page visual review, capture all four pages at the same viewport sizes:

```sh
node tooling/capture-portfolio-browser.mjs --url http://localhost:8080 --tool-root "$browser_tools"
```

The command also accepts a preview directory URL that serves the four flat HTML files, such as an isolated concept. Captures use reduced motion, wait for fonts and lazy images, and default to `.baseline/portfolio-captures/`.

## Build inputs and legacy verification

`src/` owns the four page templates, shared layout and partials, data, modern Sass, and optional browser modules. Home and Projects use the project-card partial and `src/_data/projects.json`. Home and About use the skill-tile partial and `src/_data/skills.json`. Work metadata lives in `src/_data/workStudies.json` and case-study bodies in `src/_includes/case-studies/`. Eleventy layers modern styles over the one shared `sass/` tree and copies `public/images/`, `public/resume.pdf`, and `public/resume-old.pdf` to their original URLs. Keep those single sources and treat `public/` as a read-only production snapshot. The regression tests also read the production HTML and the catalog in `scripts/script.js`.

Eleventy and Dart Sass are the only direct dependencies of the modern build. `npm run check:legacy` takes the legacy Babel configuration, shared Sass, and legacy scripts into a temporary directory. It installs the separate lockfile in `tooling/legacy-build/`, builds with Sass 1.89.1, and compares the generated CSS and both scripts to the checked-in production bytes. Run the legacy audit with `npm --prefix tooling/legacy-build audit --include=dev`. The shared Netlify build serves the checked-in portfolio snapshot.

### Composed preview

Run these commands from `portfolio/` after a locked install. The composer stages modern output and the allowlisted tracked sibling and archive files from `public/`. It reports missing required files or path collisions before a preview can run.

```sh
npm run check &&
candidate=$(node tooling/compose-preview.mjs) &&
preview_dir=$(mktemp -d) &&
cp ../netlify.toml "$preview_dir/" &&
mv "$candidate" "$preview_dir/served" &&
printf '%s\n' "$preview_dir/served" &&
(cd "$preview_dir" && netlify dev --offline --framework '#static' --dir served --no-open --port 8888)
```

In a second terminal, set `publish_dir` to the printed directory and run the HTTP checker from `portfolio/`.

```sh
node tooling/check-preview.mjs --url http://localhost:8888 --publish-dir "$publish_dir"
```

The checker compares served bytes and MIME types with the expected artifact and checks redirects, SPA fallbacks, and missing paths. Pass `--case-sensitive` on a case-sensitive filesystem or host to check wrong-case requests. Use the browser suites for client-side navigation and fragment behavior. The sibling files in the local composed preview come from the committed snapshot. The roadmap describes the separate root rebuild rehearsal and the requirements for cutover.

### Verify production isolation

From `portfolio/`, capture a manifest before the first build, then capture it again after validation. The script hashes every regular file in `public/`, including ignored files, and records symbolic link targets.

```sh
manifest_dir=$(mktemp -d)
node tooling/snapshot-manifest.mjs > "$manifest_dir/before.jsonl"
# Run the builds and checks.
node tooling/snapshot-manifest.mjs > "$manifest_dir/after.jsonl"
diff -u "$manifest_dir/before.jsonl" "$manifest_dir/after.jsonl"
```

See the [baseline](BASELINE.md) and [roadmap](MODERNIZATION.md) for the migration status and review boundaries.
