---
name: portfolio-browser-qa
description: Verify portfolio changes to shared navigation or layout, About links, project cards and reveals, or Work fragments and screenshot viewer. Use for responsive and accessibility checks, preview URL parity, and production snapshot isolation.
---

# Portfolio browser QA

Work from `portfolio/`, where AGENTS.md points to this repository-local skill. Run `npm run check` for content, asset, and output parity. The [development README](../../../readme.md#browser-checks) has the preview and checker commands.

- Run the About checker for cross-page navigation with scripts unavailable, profile and tool links, and About reveals. Run the project checker for shared cards and Home and Projects reveals, and the Work checker for fragments, the contents control, and the viewer. Use all three when changing shared styles or layout.
- Before changing an interaction, observe the original initial state, scroll reveal, and relevant hover or focus state. For comparison captures, match the viewport and visible target and wait for fonts, scrolling, and animations to settle. Keep a separate initial-state capture when entry behavior changes. See the [baseline](../../../BASELINE.md) for the reference set.
- Exercise pointer and keyboard navigation separately. For native fragments, verify the URL, Back history, target clearance below the fixed header, and focus. For dialogs, check keyboard behavior with the dialog open and verify focus restoration on close.
- Test disabled JavaScript, a blocked enhancement, and reduced motion separately. Check rendered visibility as well as DOM presence, especially for opacity-based reveals. Review axe's incomplete items and verify the relevant foreground and background contrast in the rendered state.
- Use available Firefox and Safari for checks on changed interactions. Safari Responsive Design Mode supports the same sizes as the Chromium matrix. Verify painted focus in a visible browser if headless output only confirms the focused target. Report remaining browser, device, or assistive-technology coverage.
- Verify clean and flat URLs through Netlify's local rewrite preview. Use the [composed preview](../../../readme.md#composed-preview) for sibling projects and archives. Serve a disposable copy of `dist/` to keep a preview available while rebuilding. For pixel comparisons, use matched viewports, loaded fonts, and reduced motion. Keep default-motion checks for interaction behavior.
- For source or dependency changes, use `npm run check:legacy` to verify the legacy build from its separate lockfile. When checking production isolation, capture and compare the whole-tree manifests from before and after the work. See the [snapshot commands](../../../readme.md#verify-production-isolation) for hashes that include ignored files.
