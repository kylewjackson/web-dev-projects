# Modernization roadmap

The approved architecture is Eleventy, Liquid, Dart Sass, and optional native JavaScript on portfolio-local Node 24 LTS. Work is the first migration slice. Keep the build isolated in `dist/` and preserve the deployed snapshot until a reviewed cutover.

| Phase | Status | Acceptance |
| --- | --- | --- |
| 0. Branch, instructions, baseline | Complete | Feature branch from master, portfolio guidance and baseline recorded, unrelated work preserved |
| 1. Build and source architecture | Approved | Locked install, isolated build, Work proof, Sass and Liquid reload, production snapshot intact |
| 2. Static content and enhancement | Work approved. Home and Projects ready for review. | Work, Home, and Projects render as static HTML with optional enhancements. About follows review. |
| 3. Accessibility | Work, Home, Projects, and shared templates remediated | Keyboard, contrast, motion, and reflow checks completed for migrated pages. Release-wide browser and screen reader review remain. |
| 4. Visual design and UX | Pending | Preserve the design identity and give selected professional work priority, with résumé and contact secondary. |
| 5. Performance | Pending | Reduce eager image bytes, reserve media space, and keep original asset URLs valid. |
| 6. SEO and metadata | Pending | Validate canonical URLs, sitemap, social metadata, and true 404 status. Remove Universal Analytics. |
| 7. Deployment integration | Separate approval | Verify shared Node and sibling builds, then stage only allowlisted portfolio files in the existing publish tree. |
| 8. Final QA | Pending | Check the composed preview across supported browsers and devices and verify public URLs, fragments, and sibling routes. |

Work and its interaction refinements were accepted for this stage. Review Home and Projects before starting About. Featured cases, current role and availability copy, and any new published evidence need editorial confirmation before Phase 4. Replacement analytics and archive indexing remain deferred.

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
- Refined Work, dock, and viewer captures at each width are in `.baseline/work-refinements/`, together with the Chromium axe reports, Firefox captures, and a desktop keyboard fragment capture.

## Home and Projects migration

- Eleventy generates `index.html` and `projects.html` in `dist/` using the shared navigation, layout, footer, and project-card partial. The shared footer brings the existing résumé link to both pages. Home retains the split hero, portrait and icons, introduction, 23 skills, and the Movie Watchlist, Work Portfolio, Rawr, and React Product Page selections. Projects keeps the complete ten-card order and the original copy, technologies, destinations, and device frames. The catalog in `src/_data/projects.json` records the type of each thumbnail, Live, and Source destination. The existing Sass maps each card ID to its four original responsive images.
- The production Home script moved the navbar into view on first scroll and hid it again at the top. Home now shows the shared navigation and direct Work link immediately. The original scroll-triggered reveals generally faded content from invisible during the first second. A shorter first-view movement and illustration fade retain that effect with visible text. The card links keep their pink and cyan hover treatments, with matching keyboard and pressed states and stable dimensions. Thumbnail hover and keyboard focus subtly scale the device image. The centered thumbnail link areas and larger text targets slightly shift some card spacing. Native skip links and smooth fragment scrolling retain URL and Back behavior. Reduced motion removes the scrolling and animation effects.
- Home renders the hero subtitle as text, uses a semantic list for each skill group, and keeps the original tile colors with readable foregrounds. Projects has one page heading above its card headings. Shared card markup gives each thumbnail and text link a descriptive name. Each thumbnail and action is an independent native link. The pages render their navigation, cards, skills, and contact information directly in HTML, including when the reveal module is missing.

### Home and Projects validation

- Node 24.22.3 completed the locked install, Eleventy dev server, production build, and all seven build checks. The checks compare the ten catalog entries and four Home selections against the legacy script, verify original copy and link destinations, and compare all 40 thumbnail file bytes. Local Netlify preview returned matching byte streams for clean and flat Home, Projects, and Work routes and the original résumé. About and the sibling and course sites are outside that isolated preview. Local Rawr still redirects and its target is outside the preview. The production snapshot matched its SHA-256 manifest. A disposable legacy build produced the same deployed CSS and both JavaScript files.
- Chromium 158 checked 320×640, 390×844, 768×1024, and 1440×900 with default motion, JavaScript disabled, the reveal module blocked, and reduced motion. Checks covered reflow, link names and target sizes, initial navigation, native skip and Back, keyboard focus, pointer hover, device previews, and tap activation on both pages. Axe reported zero violations at every size. Computed color checks covered the navigation, hero title, skill tiles, and card links flagged for manual review.
- Firefox 160 checked the same widths for layout, skip navigation, keyboard targets, and first-view reveals. Its headless session did not expose painted focus indicators. Safari 26.6.2 rendered both pages at the four sizes in Responsive Design Mode and passed desktop smoke checks for shared navigation, the Projects skip link and thumbnail focus, and Work fragment navigation and its return control. Screen reader and physical iOS testing remain open.
- The existing Chromium Work suite passed at all four widths, including fragment history, contents control, gallery navigation and focus restoration, script and dialog failure, and reduced motion. Work page and contents control captures matched the prior captures pixel for pixel at every width. The viewer remained visually consistent. Firefox also passed a Work keyboard, dock, and gallery dismissal smoke check.
- The ignored `.baseline/home-projects-migration/` directory contains original and migrated Home and Projects screenshots, comparison sheets, keyboard and blocked-script examples, Firefox captures, and axe reports. The `work-regression/` subdirectory contains the new Work evidence.

## Design and editorial backlog

- Revisit Work’s résumé link styling and placement, refine the screenshot viewer interface, and improve case-study composition and presentation. Review reading measure, typography, spacing, visual hierarchy, and component styling during the evolutionary redesign.
- Revisit Home’s composition and how it leads readers to selected professional work. Review featured projects and the role, location, and freelance availability statements before publishing editorial updates.
- Evaluate Projects categories and the relative prominence of professional work, demos, coursework, and archives. Review the chronological implication of “Recent Projects” against the existing selection. React Product Page’s thumbnail goes to a different GitHub repository from Source and its Live link goes to the demo. Bootcamp uses Live for a certificate, and Retro repeats the same repository for all three links. Work Portfolio’s Source points to the legacy production HTML. The old no-script pages had different entries, placeholder links, and older role and skill copy. The migration uses the active production catalog and Home copy.

## Dependencies and next batch

The locked audit reported 14 affected package entries, with the same entries in the Home and Projects run. Traversing Eleventy and current Dart Sass found two shared high-severity entries, `picomatch` and `source-map-js`. The other 12 entries are legacy-only, including the critical `shell-quote` finding through `npm-run-all`. The transitional build and lockfile are retained.

After Home and Projects review, migrate About into the shared layout and move its content and tools into static templates. Final source consolidation, visual modernization, image optimization, release-wide browser and screen reader checks, and deployment integration remain separate work.
