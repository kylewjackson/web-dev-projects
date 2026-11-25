---
name: portfolio-browser-qa
description: Verify rendered portfolio behavior after changes to shared navigation or layout, About profile and tool links, project cards or reveals, or Work fragments and screenshot viewer. Use for accessibility, responsive interaction, and before-and-after browser checks.
---

# Portfolio browser QA

Work from `portfolio/`, where AGENTS.md points to this repository-local skill. Run `npm run check` for content, asset, and output parity. The [development README](../../../readme.md#browser-checks) has the preview and checker commands.

- Run the About checker for cross-page navigation with scripts unavailable, profile and tool links, and About reveals. Run the project checker for shared cards and Home and Projects reveals, and the Work checker for fragments, the contents control, and the viewer. Use all three when changing shared styles or layout.
- Before changing an interaction, observe the original initial state, scroll reveal, and relevant hover or focus state. For comparison captures, match the viewport and visible target and wait for fonts, scrolling, and animations to settle. Keep a separate initial-state capture when entry behavior changes. See the [baseline](../../../BASELINE.md) for the reference set.
- Exercise pointer and keyboard navigation separately. For native fragments, verify the URL, Back history, target clearance below the fixed header, and focus. For dialogs, check keyboard behavior with the dialog open and verify focus restoration on close.
- Test disabled JavaScript, a blocked enhancement, and reduced motion separately. Check rendered visibility as well as DOM presence, especially for opacity-based reveals. Review axe's incomplete items and verify the relevant foreground and background contrast in the rendered state.
- Use available Firefox and Safari for checks on changed interactions. Safari Responsive Design Mode supports the same sizes as the Chromium matrix. Verify painted focus in a visible browser if headless output only confirms the focused target. Report remaining browser, device, or assistive-technology coverage.
- Verify clean and flat URLs through Netlify's local rewrite preview. The isolated preview excludes sibling projects and archives. For source or dependency changes, use `node tooling/check-legacy-build.mjs` to verify the legacy build in a disposable copy. Compare a before-and-after file hash manifest of `public/` when verifying that the entire production tree was isolated.
