# Portfolio instructions

- Modernize the portfolio incrementally. Use Eleventy 3 with Liquid, Dart Sass, native JavaScript, and a portfolio-local Node 24 LTS runtime.
- Edit portfolio files only. Root configuration, shared Node settings, sibling and legacy projects, and any deployment integration require separate approval. Treat `public/` as a read-only production snapshot and shared publish tree until that review.
- Treat `src/` and the portfolio configuration as the new source, with the existing Sass and assets reused during migration. `dist/` is disposable generated output. Restrict cleans and writes to that directory. See [README](readme.md) for the transitional legacy build.
- Run `npm ci`, `npm run dev`, `npm run build`, and `npm run check` from `portfolio/`. Use the README preview command for local Netlify rewrite checks.
- Prefer semantic HTML, explicit Liquid includes for repeated markup, and Sass modules with page-specific rules scoped to their pages. Keep native JavaScript small and optional. Navigation, case studies, projects, and contact information must work when JavaScript fails.
- Preserve or thoughtfully refine existing interactions and motion during migration. Keep content and destinations usable before enhancements load, and honor reduced-motion preferences.
- Target WCAG 2.2 AA and evergreen desktop and mobile browsers. Check keyboard and focus behavior, reduced motion, contrast, and reflow. Preserve the split light-and-charcoal composition, Playfair typography, pink and cyan accents, custom illustrations, and device-framed previews.
- Use [portfolio-browser-qa](.agents/skills/portfolio-browser-qa/SKILL.md) for rendered interaction and accessibility regression checks.
- Preserve public routes, résumé and asset links, existing Work fragments, and sibling and legacy route behavior. See [baseline](BASELINE.md) for the inventory.
- Keep Work section order, headings, role dates, and fragment IDs in `src/_data/workStudies.json`. Each entry supplies both the contents link and the section header and points to its body in `src/_includes/case-studies/`.
- Check the branch and worktree before editing. Preserve unrelated work, validate each scoped batch, and make small descriptive commits. Push, merge, and deploy only with explicit authorization. See [roadmap](MODERNIZATION.md) for the current phase and review boundaries.
