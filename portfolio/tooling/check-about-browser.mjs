import assert from "node:assert/strict";
import { launchBrowserQA, viewports } from "./browser-qa.mjs";

const { browser, origin, output, capture, scan } = await launchBrowserQA("check-about-browser.mjs", "about-browser");
const route = "/about";
const routes = ["/", route, "/projects", "/work"];

async function checkStaticContent(page) {
  assert.equal(await page.locator("#about-main > section").count(), 6);
  assert.equal(await page.locator("#tool-container").getByRole("listitem").count(), 26);
  assert.equal(await page.locator("#tool-container").getByRole("link", { name: /\S/ }).count(), 26);
  assert.equal(await page.locator("#about-main .link-box a").count(), 0);
  assert.ok(await page.getByRole("link", { name: "FreeCodeCamp", exact: true }).isVisible());
  assert.ok(await page.getByRole("link", { name: "LinkedIn", exact: true }).first().isVisible());

  const problems = await page.evaluate(() => {
    const links = [...document.querySelectorAll(".navbar a, #about-main a")];
    const images = [...document.querySelectorAll("#about-main img")];
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      links: links.filter((link) => {
        const rect = link.getBoundingClientRect();
        return !link.checkVisibility({ opacityProperty: true, visibilityProperty: true }) ||
          rect.left < 0 || rect.right > innerWidth || rect.width < 24 || rect.height < 24;
      }).map((link) => link.id || link.textContent),
      images: images.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.src),
    };
  });
  assert.deepEqual(problems, { overflow: 0, links: [], images: [] });
}

async function checkKeyboard(page, record) {
  await page.keyboard.press("Tab");
  assert.ok(await page.locator(".skip-link").evaluate((link) => link === document.activeElement));
  await page.keyboard.press("Enter");
  await page.waitForURL((url) => url.hash === "#about-main");
  assert.ok(await page.locator("main").evaluate((main) => main === document.activeElement));
  await page.keyboard.press("Tab");
  const firstProfile = page.getByRole("link", { name: "FreeCodeCamp", exact: true });
  assert.ok(await firstProfile.evaluate((link) =>
    link === document.activeElement && link.matches(":focus-visible") && getComputedStyle(link).outlineStyle === "solid"));
  if (record) await capture(page, `${record}-keyboard-focus`);
  await page.goBack();
  assert.equal(new URL(page.url()).hash, "");
}

async function checkContrast(locator) {
  const ratio = await locator.evaluate((element) => {
    const luminance = (color) => {
      const channels = color.match(/[\d.]+/g).slice(0, 3).map((value) => {
        const amount = Number(value) / 255;
        return amount <= 0.04045 ? amount / 12.92 : ((amount + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    let background = element;
    while (getComputedStyle(background).backgroundColor === "rgba(0, 0, 0, 0)") {
      background = background.parentElement;
    }
    const fg = luminance(getComputedStyle(element).color);
    const bg = luminance(getComputedStyle(background).backgroundColor);
    return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
  });
  assert.ok(ratio >= 4.5, `${await locator.textContent()} contrast: ${ratio.toFixed(2)}:1`);
}

try {
  console.log(`Chromium ${browser.version()} using ${origin.href}`);
  for (const viewport of viewports) {
    const prefix = `${viewport.width}-about`;
    for (const mode of ["default", "no-js", "blocked", "reduced-motion"]) {
      const page = await browser.newPage({
        viewport,
        javaScriptEnabled: mode !== "no-js",
        reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference",
      });
      page.setDefaultTimeout(8_000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      try {
        if (mode === "blocked") await page.route("**/scripts/reveal.js", (request) => request.abort());
        assert.equal((await page.goto(new URL(route, origin).href)).status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await checkStaticContent(page);
        if (mode === "default") {
          await page.locator("#intro-heading.reveal-in").waitFor();
          await capture(page, `${prefix}-page`);
          await scan(page, `${prefix}-axe`);
          await page.reload();
        } else {
          const lastTool = page.locator("#sheets-link");
          await lastTool.scrollIntoViewIfNeeded();
          assert.ok(await lastTool.isVisible());
          assert.equal(await page.locator(".reveal-in").count(), 0);
          if (mode === "reduced-motion") {
            assert.equal(await page.locator("html").evaluate((html) => getComputedStyle(html).scrollBehavior), "auto");
            assert.equal(await lastTool.evaluate((link) => getComputedStyle(link).transitionDuration), "0s");
          }
          if (mode === "blocked" && viewport.width === 390) await capture(page, `${prefix}-blocked`);
          await page.reload();
        }
        await checkKeyboard(page, mode === "default" && viewport.width === 1440 ? prefix : false);

        if (mode === "default") {
          for (const label of await page.locator("#tool-container .tool-name, #about-main .link-symbol").all()) {
            await checkContrast(label);
          }
          const hoverLinks = viewport.width === 390 ? await page.locator("#tool-container .tool-link").all() : [page.locator("#html-link")];
          for (const link of hoverLinks) {
            await link.scrollIntoViewIfNeeded();
            await link.evaluate((element) =>
              Promise.all(element.parentElement.getAnimations().map((animation) => animation.finished)));
            const before = await link.boundingBox();
            await link.hover();
            assert.deepEqual(await link.boundingBox(), before);
            assert.notEqual(await link.evaluate((element) => getComputedStyle(element).backgroundColor), "rgba(0, 0, 0, 0)");
            await checkContrast(link);
          }
          for (const link of await page.locator(".navbar a:not(.home-button)").all()) await checkContrast(link);
          await page.locator("#html-link").hover();
          await capture(page, `${prefix}-tools`);
        }

        if (mode === "no-js" || mode === "blocked") {
          if (mode === "blocked") await page.route("**/scripts/work.js", (request) => request.abort());
          for (const destination of [...routes.filter((path) => path !== route), route]) {
            await page.locator(`.navbar a[href="${destination}"]`).click();
            await page.waitForURL(new URL(destination, origin).href);
            assert.equal(await page.locator(".navbar [aria-current=page]").getAttribute("href"), destination);
            assert.ok(await page.getByRole("heading", { level: 1 }).isVisible());
          }
        }
        assert.deepEqual(errors, []);
      } finally {
        await page.context().close();
      }
    }
    console.log(`${viewport.width}px About passed in all four modes`);
  }
  console.log(`Cross-page navigation passed. Browser evidence saved to ${output}`);
} finally {
  await browser.close();
}
