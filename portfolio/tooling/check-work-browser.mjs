import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    url: { type: "string" },
    "tool-root": { type: "string" },
    executable: { type: "string" },
    out: { type: "string" },
    help: { type: "boolean" },
  },
});
const usage = "node tooling/check-work-browser.mjs --url <preview origin> [--tool-root <npm prefix>] [--executable <Chromium path>] [--out <artifact directory>]";
if (values.help) {
  console.log(usage);
  process.exit(0);
}
assert.ok(values.url, usage);
const work = new URL("/work", values.url);
const output = values.out
  ? resolve(values.out)
  : fileURLToPath(new URL("../.baseline/work-browser/", import.meta.url));

const require = createRequire(values["tool-root"]
  ? resolve(values["tool-root"], "package.json")
  : import.meta.url);
let chromium;
let axeSource;
try {
  ({ chromium } = require("playwright"));
  ({ source: axeSource } = require("axe-core"));
} catch (error) {
  throw new Error("Install Playwright and axe-core in a separate npm prefix and pass it with --tool-root.", { cause: error });
}

const viewports = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const caseId = "#project_agile";
const opener = `${caseId} [data-work-image]`;
const dock = ".work-dock";
const viewer = "#work-viewer";

async function waitForFragment(page, hash) {
  await page.waitForURL((url) => url.hash === hash);
  // Wait for native smooth scrolling to settle below the fixed navigation.
  await page.waitForFunction((target) => {
    const top = document.querySelector(target).getBoundingClientRect().top;
    const clearance = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    const header = document.querySelector(".navbar").getBoundingClientRect().bottom;
    return top >= header && Math.abs(top - clearance) <= 1;
  }, hash);
}

async function capture(page, name) {
  await page.screenshot({ path: join(output, `${name}.png`), animations: "disabled" });
}

async function scan(page, name) {
  await page.evaluate(axeSource);
  const report = await page.evaluate(async () => {
    const { violations, incomplete } = await window.axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    });
    return { violations, incomplete };
  });
  await writeFile(join(output, `${name}.json`), JSON.stringify(report, null, 2));
  assert.deepEqual(report.violations.map(({ id }) => id), [], name);
  if (report.incomplete.length) {
    console.log(`${name} needs manual review: ${report.incomplete.map(({ id }) => id).join(", ")}`);
  }
}

async function checkViewport(browser, viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: "no-preference" });
  page.setDefaultTimeout(8_000);
  const prefix = String(viewport.width);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    assert.equal((await page.goto(work.href)).status(), 200);
    const intro = page.locator("#work-toc a").first();
    const target = page.locator(caseId);
    const jump = page.locator(dock);
    const image = page.locator(opener).first();
    const dialog = page.getByRole("dialog");
    const close = dialog.getByRole("button", { name: "Close screenshot viewer" });

    await page.locator(`${opener}[aria-haspopup="dialog"]`).first().waitFor();
    assert.equal(await jump.evaluate((el) => el.inert), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width);
    await capture(page, `${prefix}-page`);

    await intro.click();
    await waitForFragment(page, caseId);
    await page.waitForFunction(() => !document.querySelector(".work-dock").inert);
    assert.deepEqual(await target.evaluate((el) => {
      const styles = getComputedStyle(el);
      return [styles.outlineStyle, styles.boxShadow, getComputedStyle(el.querySelector("h2")).textDecorationLine];
    }), ["none", "none", "none"]);
    assert.ok(await jump.evaluate((el) => {
      const { x, y, width, height, right, bottom } = el.getBoundingClientRect();
      return width >= 44 && height >= 44 && x >= 0 && y >= 0 && right <= innerWidth && bottom <= innerHeight;
    }));
    await capture(page, `${prefix}-contents-control`);
    await scan(page, `${prefix}-axe-page`);

    await jump.click();
    await waitForFragment(page, "#work-toc");
    await page.waitForFunction(() => document.querySelector(".work-dock").inert);
    await page.goBack();
    await waitForFragment(page, caseId);

    await page.goto(work.href);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.matches(".skip-link")), true);
    await page.keyboard.press("Enter");
    await page.waitForURL((url) => url.hash === "#work-main");
    await page.keyboard.press("Tab");
    assert.equal(await intro.evaluate((el) => el === document.activeElement && el.matches(":focus-visible")), true);
    await page.keyboard.press("Enter");
    await waitForFragment(page, caseId);
    assert.equal(await target.evaluate((el) =>
      el === document.activeElement && getComputedStyle(el.querySelector("h2")).textDecorationLine === "underline"), true);
    await page.keyboard.press("Tab");
    assert.equal(await image.evaluate((el) =>
      el === document.activeElement && getComputedStyle(el).outlineStyle === "solid"), true);

    const original = await image.evaluate((el) => el.href);
    await page.keyboard.press("Enter");
    await dialog.waitFor();
    assert.equal(await close.evaluate((el) => el === document.activeElement), true);
    await page.waitForFunction(() => {
      const screenshot = document.querySelector(".work-viewer__stage img");
      return screenshot?.complete && screenshot.naturalWidth > 0;
    });
    assert.ok(await dialog.evaluate((el) => {
      const { x, y, right, bottom } = el.getBoundingClientRect();
      return x >= 0 && y >= 0 && right <= innerWidth && bottom <= innerHeight;
    }));
    const originalLink = dialog.getByRole("link", { name: /Open original image/ });
    assert.equal(await originalLink.getAttribute("href"), original);
    await capture(page, `${prefix}-viewer`);
    await scan(page, `${prefix}-axe-viewer`);

    const initial = await dialog.getByRole("status").textContent();
    await page.keyboard.press("ArrowRight");
    assert.notEqual(await dialog.getByRole("status").textContent(), initial);
    assert.notEqual(await originalLink.getAttribute("href"), original);
    await dialog.getByRole("button", { name: "Previous screenshot" }).click();
    assert.equal(await dialog.getByRole("status").textContent(), initial);
    assert.equal(await originalLink.getAttribute("href"), original);
    await page.keyboard.press("Escape");
    await page.waitForFunction((selector) => document.activeElement === document.querySelector(selector), opener);
    await image.click();
    await close.click();
    await page.waitForFunction((selector) => document.activeElement === document.querySelector(selector), opener);
    assert.deepEqual(errors, []);
    console.log(`${prefix}px passed`);
  } finally {
    await page.close();
  }
}

async function checkFallback(browser, mode) {
  const page = await browser.newPage({
    viewport: viewports[1],
    javaScriptEnabled: mode !== "no-js",
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(8_000);

  try {
    if (mode === "blocked") {
      await page.route("**/scripts/work.js", (route) => route.abort());
    }
    if (mode === "dialog-fails") {
      await page.addInitScript(() => {
        HTMLDialogElement.prototype.showModal = () => { throw new Error("Simulated dialog failure"); };
      });
    }

    await page.goto(work.href);
    const image = page.locator(opener).first();
    if (mode === "reduced-motion") {
      await page.locator("#work-toc a").first().click();
      await waitForFragment(page, caseId);
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
      assert.equal(await page.locator(dock).evaluate((el) => getComputedStyle(el).transitionDuration), "0s");
      await image.click();
      await page.getByRole("dialog").waitFor();
      assert.equal(await page.locator(viewer).evaluate((el) => getComputedStyle(el).transitionDuration), "0s");
    } else {
      await page.getByRole("link", { name: "Back to table of contents" }).click();
      await page.waitForURL((url) => url.hash === "#work-toc");
      assert.equal(await page.evaluate(() => document.activeElement.id), "work-toc");
      const original = await image.evaluate((el) => el.href);
      await image.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL(original);
    }
    console.log(`${mode} passed`);
  } finally {
    await page.close();
  }
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: values.executable });
try {
  console.log(`Chromium ${browser.version()} using ${work.href}`);
  for (const viewport of viewports) await checkViewport(browser, viewport);
  for (const mode of ["no-js", "blocked", "dialog-fails", "reduced-motion"]) await checkFallback(browser, mode);
  console.log(`Browser evidence saved to ${output}`);
} finally {
  await browser.close();
}
