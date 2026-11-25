# Modernization roadmap

The approved architecture is Eleventy, Liquid, Dart Sass, and optional native JavaScript on portfolio-local Node 24 LTS. Work is the first migration slice. Keep the build isolated in `dist/` and preserve the deployed snapshot until a reviewed cutover.

| Phase | Status | Acceptance |
| --- | --- | --- |
| 0. Branch, instructions, baseline | Complete | Feature branch from master, portfolio guidance and baseline recorded, unrelated work preserved |
| 1. Build and source architecture | Approved | Locked install, isolated build, Work proof, Sass and Liquid reload, production snapshot intact |
| 2. Static content and enhancement | Work complete, awaiting review | Full static Work page and navigation. Home, Projects, and About follow review. |
| 3. Accessibility | Work and shared templates remediated | Work keyboard, contrast, motion, and reflow checks completed. Screen reader and broader page review remain. |
| 4. Visual design and UX | Pending | Preserve the design identity and give selected professional work priority, with résumé and contact secondary. |
| 5. Performance | Pending | Reduce eager image bytes, reserve media space, and keep original asset URLs valid. |
| 6. SEO and metadata | Pending | Validate canonical URLs, sitemap, social metadata, and true 404 status. Remove Universal Analytics. |
| 7. Deployment integration | Separate approval | Verify shared Node and sibling builds, then stage only allowlisted portfolio files in the existing publish tree. |
| 8. Final QA | Pending | Check the composed preview across supported browsers and devices and verify public URLs, fragments, and sibling routes. |

Review the completed Work migration before starting Home and Projects. Featured cases, current role and availability copy, and any new published evidence need editorial confirmation before Phase 4. Replacement analytics and archive indexing remain deferred.

## Work migration

The live [Work page](https://www.kylejackson.dev/work) matched the checked-in production HTML byte for byte. The Eleventy build generates `dist/work.html` and preserves the eight case studies in order, their introduction and prose, headings, roles and dates, four tables, 22 figure captions and alt descriptions, and all screenshot and PDF destinations. The contents fragment, eight study fragments, and existing table IDs still resolve. The original résumé is available at `/resume.pdf` and linked in the footer.

`src/_data/workStudies.json` drives both the contents and the section headers in `src/work.liquid`. Each entry includes its matching Liquid body from `src/_includes/case-studies/`. The base layout and the navigation, footer, and figure partials share repeated markup. Modern Sass overrides live under `src/_includes/styles/` and layer over the legacy stylesheet.

The static page uses native links for contents navigation, section returns, screenshots, and PDFs. Removing scroll fades and the timed floating return button keeps the content and controls available on load. Each case ends with a visible return link. Focusable fragment targets and scroll clearance keep the fixed navbar above the destination. Shared navigation includes a skip link, a standalone Home link, and a visible current-page state. Case-study lists have valid nesting, data tables identify row and column headers, and linked figures have action names and intrinsic image sizes. Larger targets, visible focus, stronger contrast on light backgrounds, and narrow table reflow account for the visible changes.

## Work validation

- On Node 24.22.3, the locked `npm ci`, Eleventy dev server, `npm run build`, and `npm run check` passed. The checks compare production copy, fragment order and uniqueness, figure descriptions and destinations, and asset bytes. A CLI output override outside `dist/` was rejected.
- Local Netlify preview served the same generated HTML at `/work` and `/work.html`, and returned the original résumé bytes. The SHA-256 manifest for `public/` matched before and after the work. In a disposable copy, the legacy build reproduced the deployed CSS and both JS files byte for byte.
- Chromium 158 and Firefox 160 rendered Work at 320×640, 390×844, 768×1024, and 1440×900 with JavaScript disabled, reduced motion enabled, and no horizontal page or table overflow. Keyboard tests covered skip, case and return links, and image activation with browser Back. Chromium exercised every study fragment and blocked the dev live-reload client. Generated Work has no client script.
- Chromium axe checks returned zero violations at all four sizes. The three text links in the primary nav required manual color checks. Off-white and cyan against charcoal measured 10.89:1 and 8.97:1, and the light-background hover color measured 5.48:1. Firefox verified keyboard focus order and targets through automation. Its headless session did not expose painted focus indicators.
- Safari 26.6.2 passed a desktop smoke test for rendering, deep-link clearance, return to contents, and Back. Safari WebDriver was unavailable because remote automation was disabled. Full Safari viewport, keyboard, and assistive-technology testing remains open.
- The original Work captures are `.baseline/{narrow,mobile,tablet,desktop}-work.png`. New captures and side-by-side comparisons are in `.baseline/work-migration/`, alongside Firefox captures, axe reports, a 320 px table capture, and a desktop keyboard focus capture. The review found no content discrepancies or unintended changes in the compared views. The new Work nav item and larger contents targets account for the main differences.

## Dependencies and next batch

The locked audit reported 14 affected package entries. Traversing Eleventy and current Dart Sass found two shared high-severity entries, `picomatch` and `source-map-js`. The other 12 entries are legacy-only, including the critical `shell-quote` finding through `npm-run-all`. The transitional build and lockfile are retained. No forced audit fixes were applied.

After Work review, migrate Home and Projects using the shared layout and static project data. Address thumbnail link names and skill-tile contrast as those surfaces move to Eleventy. Keep About for the following slice. Review case-study reading measure, mobile typography, and featured work in the visual phase. Image optimization, release-wide browser and screen reader checks, and deployment integration remain separate work.
