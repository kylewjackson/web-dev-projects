# Modernization roadmap

The approved architecture is Eleventy, Liquid, Dart Sass, and optional native JavaScript on portfolio-local Node 24 LTS. Work is the first migration slice. Keep the build isolated in `dist/` and preserve the deployed snapshot until a reviewed cutover.

| Phase | Status | Acceptance |
| --- | --- | --- |
| 0. Branch, instructions, baseline | Complete | Feature branch from master, portfolio guidance and baseline recorded, unrelated work preserved |
| 1. Build and source architecture | Approved | Locked install, isolated build, Work proof, Sass and Liquid reload, production snapshot intact |
| 2. Static content and enhancement | Work migration approved, refinements awaiting review | Full static Work page and optional navigation and screenshot enhancements. Home, Projects, and About follow review. |
| 3. Accessibility | Work and shared templates remediated | Work keyboard, contrast, motion, and reflow checks completed. Screen reader and broader page review remain. |
| 4. Visual design and UX | Pending | Preserve the design identity and give selected professional work priority, with résumé and contact secondary. |
| 5. Performance | Pending | Reduce eager image bytes, reserve media space, and keep original asset URLs valid. |
| 6. SEO and metadata | Pending | Validate canonical URLs, sitemap, social metadata, and true 404 status. Remove Universal Analytics. |
| 7. Deployment integration | Separate approval | Verify shared Node and sibling builds, then stage only allowlisted portfolio files in the existing publish tree. |
| 8. Final QA | Pending | Check the composed preview across supported browsers and devices and verify public URLs, fragments, and sibling routes. |

Review the Work interaction refinements before starting Home and Projects. Featured cases, current role and availability copy, and any new published evidence need editorial confirmation before Phase 4. Replacement analytics and archive indexing remain deferred.

## Work migration

The live [Work page](https://www.kylejackson.dev/work) matched the checked-in production HTML byte for byte. The Eleventy build generates `dist/work.html` and preserves the eight case studies in order, their introduction and prose, headings, roles and dates, four tables, 22 figure captions and alt descriptions, and all screenshot and PDF destinations. The contents fragment, eight study fragments, and existing table IDs still resolve. The original résumé is available at `/resume.pdf` and linked in the footer.

`src/_data/workStudies.json` drives both the contents and the section headers in `src/work.liquid`. Each entry includes its matching Liquid body from `src/_includes/case-studies/`. The base layout and the navigation, footer, and figure partials share repeated markup. Modern Sass overrides live under `src/_includes/styles/` and layer over the legacy stylesheet.

The static migration established native contents, screenshot, and PDF links, focusable fragment targets below the fixed navbar, valid lists and table headers, and intrinsic image sizes. Shared navigation includes a skip link, a standalone Home link, and a visible current-page state. Larger targets, stronger contrast on light backgrounds, and narrow table reflow account for the accessibility corrections.

## Work validation

- On Node 24.22.3, the locked `npm ci`, Eleventy dev server, `npm run build`, and `npm run check` passed. The checks compare production copy, fragment order and uniqueness, figure descriptions and destinations, and asset bytes. A CLI output override outside `dist/` was rejected.
- Local Netlify preview served the same generated HTML at `/work` and `/work.html`, and returned the original résumé bytes. The SHA-256 manifest for `public/` matched before and after the work. In a disposable copy, the legacy build reproduced the deployed CSS and both JS files byte for byte.
- Chromium 158 and Firefox 160 rendered the initial migration at 320×640, 390×844, 768×1024, and 1440×900 with JavaScript disabled, reduced motion enabled, and no horizontal page or table overflow. Keyboard tests covered skip, case and return links, and image activation with browser Back. Chromium exercised every study fragment and blocked the dev live-reload client.
- Chromium axe checks returned zero violations at all four sizes. The three text links in the primary nav required manual color checks. Off-white and cyan against charcoal measured 10.89:1 and 8.97:1, and the light-background hover color measured 5.48:1. Firefox verified keyboard focus order and targets through automation. Its headless session did not expose painted focus indicators.
- Safari 26.6.2 passed a desktop smoke test for rendering, deep-link clearance, return to contents, and Back. Safari WebDriver was unavailable because remote automation was disabled. Full Safari viewport, keyboard, and assistive-technology testing remains open.
- The original Work captures are `.baseline/{narrow,mobile,tablet,desktop}-work.png`. Initial migration captures and side-by-side comparisons are in `.baseline/work-migration/`, alongside Firefox captures, axe reports, a 320 px table capture, and a desktop keyboard focus capture. The content checks found no discrepancies. Subsequent review identified the interaction issues addressed below.

## Work interaction refinements

The original page faded in Work content and footer sections after script load, intercepted contents links for smooth scrolling without fragment history, and showed a floating return button that faded out 1.5 seconds after scrolling stopped. The accessibility and correctness fixes were to render content immediately, use native fragment navigation, and remove the invisible return button from keyboard traversal. The initial migration also lost the contextual return, scroll motion, and reveal cues. Repeating a return link after every study added visual clutter. A shared `:focus` rule applied the two-tone ring to each whole section or landmark when a fragment activated it.

- Restored a floating **Back to contents** link that appears after the contents pass the fixed header. It stays available while reading and yields to one inline return at the end. At narrow widths, a shallow bottom strip keeps the control from sitting on text and the scroll clearance accounts for the strip. A hidden control is inert. The inline return and all native fragments work without the enhancement.
- Scoped control rings to keyboard-visible focus and gave focused fragment headings an underline. Skip and case targets retain native focus behavior, URL changes, and Back history. Pointer activation keeps the destination free of the full-section ring.
- Restored native smooth scrolling, short hover transitions, and a subtle first-view heading reveal. Headings remain visible throughout. The return control and viewer transition in and out. Reduced motion disables these effects.
- Added a dependency-free native dialog for the 21 screenshots. The caption and alt description come from the existing figure. The viewport-sized stage preserves the source aspect ratio and offers the original image in a new tab. Close and Escape return focus to the triggering link. Previous and next controls and arrow keys cycle within the current case study. The PDF and all source image links retain their original destinations, including when the script is blocked or opening the dialog fails.

### Refinement validation

- Ran the locked install, Eleventy dev server, build, five build checks, and local Netlify rewrite preview. The content and original asset checks passed. The production snapshot matched its hash manifest, and a disposable legacy build reproduced the deployed CSS and both JS files byte for byte.
- Chromium 158 passed pointer and keyboard fragment behavior, Back, dock timing and size, dialog gallery, focus capture and restoration, Escape, original image access, and reflow at 320, 390, 768, and 1440 px. Separate checks covered disabled JavaScript, a blocked enhancement module, a forced dialog-open failure, and reduced motion. Axe reported zero violations on the page and with the dialog open at all four widths. Manual contrast checks covered the flagged navigation text and viewer arrows.
- Firefox 160 passed the keyboard, dock, fragment, reduced-motion, and dialog checks at all four widths. Safari 26.6.2 passed a desktop smoke test for the dock, fragment history, gallery arrow keys, Escape, and focus restoration. Safari WebDriver remains unavailable with remote automation disabled. Full Safari viewport and screen reader testing remain open.
- Refined Work, dock, and viewer captures at each width are in `.baseline/work-refinements/`, together with the Chromium axe reports, Firefox captures, and a desktop keyboard fragment capture. Review these alongside the original and initial migration captures before starting the next pages.

## Dependencies and next batch

The locked audit reported 14 affected package entries. Traversing Eleventy and current Dart Sass found two shared high-severity entries, `picomatch` and `source-map-js`. The other 12 entries are legacy-only, including the critical `shell-quote` finding through `npm-run-all`. The transitional build and lockfile are retained. No forced audit fixes were applied.

After Work review, migrate Home and Projects using the shared layout and static project data. Address thumbnail link names and skill-tile contrast as those surfaces move to Eleventy. Keep About for the following slice. Review case-study reading measure, mobile typography, and featured work in the visual phase. Image optimization, release-wide browser and screen reader checks, and deployment integration remain separate work.
