# Portfolio baseline

Recorded from `master` at `ae01910` and the completed audit. The live HTML and shared CSS and JS matched the audited checkout.

- The routes are `/`, `/about`, `/projects`, and `/work`, backed by flat HTML files. Preserve existing `.html` URLs, `/resume.pdf`, older résumé files, public assets under `/images/`, and existing screenshot downloads.
- The shared publish tree also serves `/movie/`, `/productpage/`, `/rawr/*` via redirect, `/rawr-you-the-one/`, `/retro/`, `/Lynda/`, `/Udemy/`, and `/pokemon/`. Root Netlify config uses Node 18 and runs `build:monorepofull`. It copies project trees into `portfolio/public/` and serves checked-in portfolio CSS and JS. The separate portfolio build uses Babel, Sass, PostCSS, and copy scripts.
- Work uses `#work-toc` and `#project_agile`, `#project_seo`, `#project_similar-items`, `#project_storybook`, `#project_footer-redesign`, `#project_promo-disclaimer`, `#project_mindful-lp`, and `#project_hispanic-heritage`.
- Blocking the shared script removed navigation and concealed Work. The audit also found unnamed project thumbnail links, nested interactive elements, low skill-tile contrast, and a hidden focusable return control.
- Work fetched about 2.75 MB of images on desktop and mobile. Projects fetched about 2.58 MB at 1440 px and 1.03 MB at 390 px. These are local payload measurements.
- Preserve the full-width split hero, Playfair headlines, Roboto secondary text, charcoal and off-white palette, pink and cyan accents, custom SVGs, and responsive device frames. Work uses a light reading surface with charcoal section headers.
- Local screenshot reference set lives in ignored `portfolio/.baseline/`. It covers Home, About, Projects, and Work at 320×640, 390×844, 768×1024, and 1440×900. The `desktop-`, `tablet-`, `mobile-`, and `narrow-` filenames identify those captures. This local folder does not travel with a Git checkout.

## Project destinations

The Home subset was Movie Watchlist, Work Portfolio, Rawr, and React Product Page. Projects displayed all ten cards.

| Card | Thumbnail | Live | Source |
| --- | --- | --- | --- |
| Movie Watchlist | `/movie` | `/movie` | `https://github.com/kylewjackson/web-dev-projects/tree/master/Movie-Project` |
| Work Portfolio | `/work` | `/work` | `https://github.com/kylewjackson/web-dev-projects/tree/master/portfolio/public/work.html` |
| Rawr You the One? | `/rawr` | `/rawr` | `https://github.com/kylewjackson/web-dev-projects/tree/master/Rawr-You-The-One` |
| Front-End Portfolio | `/` | `/` | `https://github.com/kylewjackson/web-dev-projects/tree/master/portfolio` |
| React Product Page | `https://github.com/kylewjackson/programming-projects/tree/master/React/Product%20Demo` | `/productpage` | `https://github.com/kylewjackson/web-dev-projects/tree/master/React-Product-Page` |
| Robo-Trek | `https://naughty-rosalind-487bdf.netlify.app/` | `https://naughty-rosalind-487bdf.netlify.app/` | `https://github.com/kylewjackson/robot` |
| CSS Resume | `/Lynda/CSS%20Essential%20Training%20-%20Resume` | `/Lynda/CSS%20Essential%20Training%20-%20Resume` | `https://github.com/kylewjackson/web-dev-projects/tree/master/Lynda/CSS%20Essential%20Training%20-%20Resume` |
| jQuery To-Do List | `/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list` | `/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list` | `https://github.com/kylewjackson/web-dev-projects/tree/master/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list` |
| Web Developer Bootcamp | `https://github.com/kylewjackson/web-dev-projects/tree/master/Udemy/Web%20Developer%20Bootcamp` | `https://www.udemy.com/certificate/UC-GCOQR6MA/` | `https://github.com/kylewjackson/web-dev-projects/tree/master/Udemy/Web%20Developer%20Bootcamp` |
| Retro Projects | `https://github.com/kylewjackson/web-dev-projects/tree/master/retro` | `https://github.com/kylewjackson/web-dev-projects/tree/master/retro` | `https://github.com/kylewjackson/web-dev-projects/tree/master/retro` |
