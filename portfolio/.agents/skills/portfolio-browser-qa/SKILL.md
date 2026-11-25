---
name: portfolio-browser-qa
description: Validate rendered portfolio accessibility, navigation, and optional interactions after changes to shared layout, Work fragments, the floating contents control, or the screenshot viewer. Use for browser regression runs and baseline captures of the portfolio preview.
---

# Portfolio browser QA

Work from `portfolio/`. Start by running `npm run check` for content, asset, and output parity. Use the [development README](../../../readme.md) to start the preview and run the browser checks against the intended build.

- For Work, run the linked browser checker. It writes viewport captures and axe reports. Review axe's incomplete items and compare relevant captures with the [baseline](../../../BASELINE.md).
- For changes on other pages, reuse the viewport matrix and evidence approach. Exercise pointer and keyboard navigation separately. For native fragments, verify the URL and Back history, then inspect the destination and keyboard focus after scrolling settles.
- When an enhancement is involved, check disabled JavaScript and a blocked enhancement separately. Exercise modal controls with the modal open and confirm focus after dismissal. Check reduced motion independently of the default-motion pass.
- Use the available Firefox and Safari browsers for a smoke pass on changed interactions. A desktop Safari smoke test, headless automation, and automated accessibility findings each cover different aspects. Report any browser, assistive-technology, or visual coverage still needed.
