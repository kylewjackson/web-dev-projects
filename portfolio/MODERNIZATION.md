# Modernization roadmap

The approved architecture is Eleventy, Liquid, Dart Sass, and optional native JavaScript on portfolio-local Node 24 LTS. Work is the first migration slice. Keep the build isolated in `dist/` and preserve the deployed snapshot until a reviewed cutover.

| Phase | Status | Acceptance |
| --- | --- | --- |
| 0. Branch, instructions, baseline | Complete | Feature branch from master, portfolio guidance and baseline recorded, unrelated work preserved |
| 1. Build and source architecture | In progress | Locked install, isolated build, Work proof, Sass and Liquid reload, production snapshot intact |
| 2. Static content and enhancement | Pending review | Finish Work first, then Home and Projects, then About. Core content and navigation work without scripts. |
| 3. Accessibility | Pending | Verify semantics, keyboard and screen reader behavior, reduced motion, contrast, and responsive reflow against WCAG 2.2 AA. |
| 4. Visual design and UX | Pending | Preserve the design identity and give selected professional work priority, with résumé and contact secondary. |
| 5. Performance | Pending | Reduce eager image bytes, reserve media space, and keep original asset URLs valid. |
| 6. SEO and metadata | Pending | Validate canonical URLs, sitemap, social metadata, and true 404 status. Remove Universal Analytics. |
| 7. Deployment integration | Separate approval | Verify shared Node and sibling builds, then stage only allowlisted portfolio files in the existing publish tree. |
| 8. Final QA | Pending | Check the composed preview across supported browsers and devices and verify public URLs, fragments, and sibling routes. |

Review Phase 1 before expanding beyond the Work proof. Featured cases, current role and availability copy, and any new published evidence need editorial confirmation before Phase 4. Replacement analytics and archive indexing remain deferred.
