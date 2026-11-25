import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const snapshot = new URL("../public/", import.meta.url);

const stripComments = (html) => html.replace(/<!--[^]*?-->/g, "");
const readableText = (html) => html
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => ({
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
  })[entity])
  .replace(/\s+/g, " ")
  .trim();

test("the build emits only the expected top-level output", async () => {
  assert.deepEqual((await readdir(dist)).sort(), ["images", "resume.pdf", "scripts", "styles", "work.html"]);
  assert.deepEqual(await readdir(new URL("scripts/", dist)), ["work.js"]);
  assert.deepEqual(await readFile(new URL("scripts/work.js", dist)), await readFile(new URL("../src/scripts/work.js", import.meta.url)));
  assert.deepEqual(await readdir(new URL("styles/", dist)), ["main.css"]);
});

test("Work preserves production copy, section order, and contents links in static HTML", async () => {
  const html = await readFile(new URL("work.html", dist), "utf8");
  const original = stripComments(await readFile(new URL("work.html", snapshot), "utf8"));
  const studies = (page) => [...page.matchAll(/<section id="(project_[^"]+)"[^>]*>([^]*?)<\/section>/g)];
  const toc = (page) => page.match(/<nav id="work-toc"[^>]*>([^]*?)<\/nav>/)[1];
  const originalStudies = studies(original);
  const migratedStudies = studies(html);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

  assert.match(html, /<h1>Work Portfolio<\/h1>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.kylejackson\.dev\/work"/);
  assert.match(html, /aria-label="Primary"/);
  assert.match(html, /href="\/work" aria-current="page"/);
  assert.match(html, /href="#work-main">Skip to main content/);
  assert.match(html, /<main id="work-main"[^>]+tabindex="-1"/);
  assert.match(html, /id="work-toc"[^>]+tabindex="-1"/);
  assert.match(html, /id="contact-heading"/);
  assert.match(html, /href="\/resume\.pdf">Résumé/);
  assert.doesNotMatch(html, /\son\w+="|href="javascript:/i);
  assert.deepEqual(html.match(/<script\b[^>]*>/g), ['<script type="module" src="/scripts/work.js">']);
  assert.match(html, /<p class="work-end"><a href="#work-toc">Back to table of contents<\/a><\/p>/);
  assert.match(html, /<a class="work-dock" href="#work-toc" inert>/);
  assert.match(html, /<dialog class="work-viewer" id="work-viewer" aria-labelledby="work-viewer-caption">/);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(originalStudies.length, 8);
  assert.deepEqual(migratedStudies.map((match) => match[1]), originalStudies.map((match) => match[1]));
  assert.deepEqual(
    [...toc(html).matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
    originalStudies.map((match) => match[1]),
  );
  assert.equal(readableText(toc(html)), readableText(toc(original)));
  assert.equal(
    readableText(html.match(/<h1>[^]*?(?=<nav id="work-toc")/)[0]),
    readableText(original.match(/<h1>[^]*?(?=<nav id="work-toc")/)[0]),
  );

  for (const [index, [, id, section]] of migratedStudies.entries()) {
    assert.equal(readableText(section), readableText(originalStudies[index][2]), id);
  }
});

test("Work serves the original previews, full-size destinations, and résumé", async () => {
  const html = await readFile(new URL("work.html", dist), "utf8");
  const original = stripComments(await readFile(new URL("work.html", snapshot), "utf8"));
  const samples = (page) => [...page.matchAll(/(href|src)="\/?(images\/samples\/[^"]+)"/g)]
    .map(([, attribute, path]) => [attribute, path]);
  const originalSamples = samples(original);
  assert.equal(originalSamples.length, 44);
  assert.deepEqual(samples(html), originalSamples);
  const imageDescriptions = (page) => [...page.matchAll(/<img src="\/?images\/samples\/[^"]+"\s+alt="([^"]+)"/g)]
    .map((match) => readableText(match[1]));
  assert.equal(imageDescriptions(original).length, 22);
  assert.deepEqual(imageDescriptions(html), imageDescriptions(original));
  const viewerLinks = [...html.matchAll(/href="(\/images\/samples\/[^"]+)"[^>]* data-work-image>/g)];
  assert.equal(viewerLinks.length, 21);
  assert.ok(viewerLinks.every(([, href]) => href.endsWith(".png")));

  const assets = new Set([...html.matchAll(/(?:href|src)="\/(images\/[^"]+|resume\.pdf)"/g)]
    .map((match) => match[1]));
  for (const asset of assets) {
    const bytes = await readFile(new URL(asset, dist));
    assert.deepEqual(bytes, await readFile(new URL(asset, snapshot)), asset);
  }
});

test("the stylesheet contains the existing Work and navigation rules", async () => {
  const css = await readFile(new URL("styles/main.css", dist), "utf8");
  assert.match(css, /#work #work-main\b/);
  assert.match(css, /\.navbar\{/);
});

test("Eleventy rejects a CLI override outside dist", async (t) => {
  const output = await mkdtemp(join(tmpdir(), "portfolio-output-"));
  t.after(() => rm(output, { force: true, recursive: true }));

  const cli = fileURLToPath(new URL("../node_modules/@11ty/eleventy/cmd.cjs", import.meta.url));
  const result = spawnSync(process.execPath, [cli, "--output=" + output], {
    cwd: new URL("../", import.meta.url),
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /output must be the portfolio's local dist directory/);
  assert.deepEqual(await readdir(output), []);
});
