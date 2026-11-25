import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { launchBrowserQA, viewports } from "./browser-qa.mjs";

const { browser, origin, output, capture, scan } = await launchBrowserQA("check-project-browser.mjs", "project-browser");
const cards = ".project-container";
const thumbnail = ".thumbnail-link";

async function checkStaticContent(page, expectedCards) {
  assert.equal(await page.locator(cards).count(), expectedCards);
  assert.equal(await page.locator(cards).getByRole("link", { name: /\S/ }).count(), expectedCards * 3);
  assert.ok(await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work", exact: true }).isVisible());
  assert.ok(await page.getByRole("link", { name: "Résumé", exact: true }).isVisible());
  assert.equal(await page.locator(".navbar [aria-current=page]").count(), 1);

  const layout = await page.evaluate(() => {
    const targets = document.querySelectorAll(".navbar a, .project-container a");
    const invalidTargets = [...targets].filter((link) => {
      const rect = link.getBoundingClientRect();
      return !link.checkVisibility({ opacityProperty: true, visibilityProperty: true }) ||
        rect.left < 0 || rect.right > innerWidth || rect.width < 24 || rect.height < 24;
    });
    const missingPreviews = [...document.querySelectorAll(".thumbnail-preview")]
      .filter((preview) => getComputedStyle(preview).backgroundImage === "none");
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      navbarTop: document.querySelector(".navbar").getBoundingClientRect().top,
      invalidTargets: invalidTargets.map((link) => link.id || link.textContent),
      missingPreviews: missingPreviews.map((preview) => preview.id),
    };
  });
  assert.deepEqual(layout, { overflow: 0, navbarTop: 0, invalidTargets: [], missingPreviews: [] });
}

async function checkKeyboard(page, prefix, record) {
  await page.keyboard.press("Tab");
  assert.ok(await page.locator(".skip-link").evaluate((link) => link === document.activeElement));
  const hash = await page.locator(".skip-link").getAttribute("href");
  await page.keyboard.press("Enter");
  await page.waitForURL((url) => url.hash === hash);
  assert.ok(await page.locator("main").evaluate((main) => main === document.activeElement));
  await page.keyboard.press("Tab");
  const firstThumbnail = page.locator(thumbnail).first();
  assert.ok(await firstThumbnail.evaluate((link) =>
    link === document.activeElement && link.matches(":focus-visible") && getComputedStyle(link).outlineStyle === "solid"));
  if (record) await capture(page, `${prefix}-keyboard-focus`);
  await page.goBack();
  assert.equal(new URL(page.url()).hash, "");
}

async function checkPointer(page, prefix) {
  const firstCard = page.locator(cards).first();
  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.and(page.locator(".reveal-in")).waitFor();
  const live = firstCard.locator(".live-preview-link");
  // Capture the settled dimensions before hover and compare after the accent changes.
  await capture(page, `${prefix}-card`);
  const before = await live.boundingBox();
  const restingColor = await live.evaluate((link) => getComputedStyle(link).backgroundColor);
  await live.hover();
  assert.notEqual(await live.evaluate((link) => getComputedStyle(link).backgroundColor), restingColor);
  assert.deepEqual(await live.boundingBox(), before);
  await capture(page, `${prefix}-hover`);

  const previewLink = firstCard.locator(thumbnail);
  const preview = previewLink.locator(".thumbnail-preview");
  const restingScale = await preview.evaluate((element) => getComputedStyle(element).scale);
  await previewLink.hover();
  await preview.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
  assert.notEqual(await preview.evaluate((element) => getComputedStyle(element).scale), restingScale);
}

async function checkViewport(site, viewport, mode) {
  const prefix = `${viewport.width}-${site.name}`;
  const page = await browser.newPage({
    viewport,
    javaScriptEnabled: mode !== "no-js",
    reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference",
  });
  page.setDefaultTimeout(8_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    if (mode === "blocked") await page.route("**/scripts/reveal.js", (route) => route.abort());
    assert.equal((await page.goto(site.url)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await checkStaticContent(page, site.count);
    await checkKeyboard(page, prefix, mode === "default" && viewport.width === 1440);

    if (mode === "default") {
      await page.goto(site.url);
      await capture(page, `${prefix}-page`);
      await scan(page, `${prefix}-axe`);
      await checkPointer(page, prefix);
    } else {
      const firstCard = page.locator(cards).first();
      await firstCard.scrollIntoViewIfNeeded();
      assert.ok(await firstCard.evaluate((card) =>
        card.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && !card.classList.contains("reveal-in")));
      if (mode === "reduced-motion") {
        assert.equal(await page.locator("html").evaluate((html) => getComputedStyle(html).scrollBehavior), "auto");
        assert.equal(await page.locator(".thumbnail-preview").first().evaluate((preview) =>
          getComputedStyle(preview).transitionDuration), "0s");
      }
      if (mode === "blocked" && viewport.width === 390) await capture(page, `${prefix}-blocked`);
    }
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
}

async function checkTouch(projects) {
  const page = await browser.newPage({ viewport: viewports[1], hasTouch: true, isMobile: true });
  page.setDefaultTimeout(8_000);
  try {
    await page.goto(projects.url);
    const workCard = page.locator(`${cards} ${thumbnail}[href="/work"]`);
    const [destination] = await Promise.all([page.waitForEvent("popup"), workCard.tap()]);
    await destination.waitForURL(new URL("/work", origin).href);
    await destination.getByRole("heading", { name: "Work Portfolio", exact: true }).waitFor();
  } finally {
    await page.context().close();
  }
}

try {
  const catalog = JSON.parse(await readFile(new URL("../src/_data/projects.json", import.meta.url), "utf8"));
  const sites = [
    { name: "home", url: new URL("/", origin).href, count: catalog.filter((project) => project.featuredOnHome).length },
    { name: "projects", url: new URL("/projects", origin).href, count: catalog.length },
  ];
  console.log(`Chromium ${browser.version()} using ${origin.href}`);
  for (const viewport of viewports) {
    for (const site of sites) {
      for (const mode of ["default", "no-js", "blocked", "reduced-motion"]) {
        await checkViewport(site, viewport, mode);
      }
      console.log(`${viewport.width}px ${site.name} passed in all four modes`);
    }
  }
  await checkTouch(sites[1]);
  console.log(`Touch activation passed. Browser evidence saved to ${output}`);
} finally {
  await browser.close();
}
