import assert from "node:assert/strict";
import { launchBrowserQA, viewports } from "./browser-qa.mjs";

const { browser, origin, output, capture } = await launchBrowserQA("capture-portfolio-browser.mjs", "portfolio-captures");
const routes = [
  { name: "home", file: "index.html" },
  { name: "work", file: "work.html" },
  { name: "projects", file: "projects.html" },
  { name: "about", file: "about.html" },
];
if (!origin.pathname.endsWith("/")) origin.pathname += "/";

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    try {
      for (const { name, file } of routes) {
        const url = new URL(file, origin);
        const response = await page.goto(url.href);
        assert.equal(response?.status(), 200, url.href);
        await capture(page, `${viewport.width}-${name}-full`, { fullPage: true });
      }
    } finally {
      await page.close();
    }
  }
  console.log(`Full-page Chromium captures saved to ${output}`);
} finally {
  await browser.close();
}
