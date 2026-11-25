---
name: portfolio-browser-qa
description: Verify rendered portfolio behavior after changes to shared navigation or layout, project cards or reveals, or Work fragments and screenshot viewer. Use for accessibility, responsive interaction, and before-and-after browser checks.
---

# Portfolio browser QA

Work from `portfolio/`. Run `npm run check` for content, asset, and output parity. The [development README](../../../readme.md#browser-checks) has the preview and checker commands.

- Run the project checker for shared cards, Home or Projects reveals, and their navigation. Run the Work checker for fragments, the contents control, and the viewer. Use both when changing shared styles or layout. Reuse their viewport matrix and evidence format for other pages.
- Before changing an interaction, observe the original initial state, scroll reveal, and relevant hover or focus state. For comparison captures, match the viewport and visible target and wait for fonts, scrolling, and animations to settle. Keep a separate initial-state capture when entry behavior changes. See the [baseline](../../../BASELINE.md) for the reference set.
- Exercise pointer and keyboard navigation separately. For native fragments, verify the URL, Back history, target clearance below the fixed header, and focus. For dialogs, check keyboard behavior with the dialog open and verify focus restoration on close.
- Test disabled JavaScript, a blocked enhancement, and reduced motion separately. Check rendered visibility as well as DOM presence, especially for opacity-based reveals. Review axe's incomplete items and verify the relevant foreground and background contrast in the rendered state.
- Use available Firefox and Safari for checks on changed interactions. Safari Responsive Design Mode supports the same sizes as the Chromium matrix. Verify painted focus in a visible browser if headless output only confirms the focused target. Report remaining browser, device, or assistive-technology coverage.
