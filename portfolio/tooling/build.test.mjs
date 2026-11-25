import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";

const dist = new URL("../dist/", import.meta.url);
const snapshot = new URL("../public/", import.meta.url);
const legacyScript = await readFile(new URL("../scripts/script.js", import.meta.url), "utf8");
const legacyTools = runInNewContext("(" + legacyScript.match(/const tools = (\{[^]*?\n\});/)[1] + ")");

const stripComments = (html) => html.replace(/<!--[^]*?-->/g, "");
const readableText = (html) => html
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => ({
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
  })[entity])
  .replace(/\s+/g, " ")
  .trim();

test("the build emits only the expected top-level output", async () => {
  assert.deepEqual((await readdir(dist)).sort(), [
    "about.html", "images", "index.html", "projects.html", "resume-old.pdf", "resume.pdf", "scripts", "styles", "work.html",
  ]);
  assert.deepEqual(await readFile(new URL("resume-old.pdf", dist)), await readFile(new URL("resume-old.pdf", snapshot)));
  assert.deepEqual((await readdir(new URL("scripts/", dist))).sort(), ["reveal.js", "work.js"]);
  for (const script of ["scripts/reveal.js", "scripts/work.js"]) {
    assert.deepEqual(await readFile(new URL(script, dist)), await readFile(new URL("../src/" + script, import.meta.url)));
  }
  assert.deepEqual(await readdir(new URL("styles/", dist)), ["main.css"]);
});

test("all four pages share static navigation and serve their portfolio-owned references", async () => {
  const routes = { "/": "index.html", "/about": "about.html", "/projects": "projects.html", "/work": "work.html" };
  const siblingRoutes = new Set([
    "/movie", "/productpage", "/rawr",
    "/Lynda/CSS%20Essential%20Training%20-%20Resume",
    "/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list",
  ]);
  const assets = new Set();

  for (const [route, file] of Object.entries(routes)) {
    const html = await readFile(new URL(file, dist), "utf8");
    const nav = html.match(/<nav class="navbar"[^>]*>([^]*?)<\/nav>/)[1];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(([, href]) => href), Object.keys(routes), file);
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"[^>]* aria-current="page"/g)].map(([, href]) => href), [route], file);
    assert.equal(html.match(/<h1[ >]/g).length, 1, file);
    assert.match(html, /href="\/resume\.pdf">Résumé/);
    assert.doesNotMatch(html, /<noscript|\son\w+="|href="javascript:/i);

    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
    assert.equal(new Set(ids).size, ids.length, file);
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.includes(id), `${file} references #${id}`);
    }
    for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      if (!(url in routes) && !siblingRoutes.has(url)) assets.add(url);
    }
  }

  const css = await readFile(new URL("styles/main.css", dist), "utf8");
  for (const [, url] of css.matchAll(/url\(["']?(\.\.\/images\/[^"')]+)["']?\)/g)) {
    assets.add(url.slice(2));
  }
  for (const url of assets) {
    const path = url.slice(1);
    const bytes = await readFile(new URL(path, dist));
    if (url.startsWith("/images/") || url === "/resume.pdf") {
      assert.deepEqual(bytes, await readFile(new URL(path, snapshot)), url);
    }
  }
});

test("About preserves the active production biography, links, illustrations, and tools", async () => {
  const html = await readFile(new URL("about.html", dist), "utf8");
  const original = stripComments(await readFile(new URL("about.html", snapshot), "utf8"))
    .split("<body", 2)[1].split("<noscript>", 1)[0];
  const main = (page) => page.match(/<main\b[^>]*>([^]*?)<\/main>/)[1];
  const sections = (page) => [...main(page).matchAll(/<section id="([^"]+)"[^>]*>([^]*?)<\/section>/g)];
  const migrated = sections(html);
  const legacy = sections(original);
  assert.deepEqual(migrated.map(([, id]) => id), ["intro", "credentials", "work-together", "coding", "art", "tools"]);
  assert.deepEqual(migrated.map(([, id]) => id), legacy.map(([, id]) => id));
  assert.deepEqual(html.match(/<script\b[^>]*>/g), ['<script type="module" src="/scripts/reveal.js">']);
  assert.deepEqual(migrated.flatMap(([, , section]) => [...section.matchAll(/<h([1-6])\b/g)].map(([, level]) => level)),
    ["1", "2", "2", "2", "2", "2"]);

  const values = (page, attribute) => [...page.matchAll(new RegExp(`${attribute}="([^"]+)"`, "g"))]
    .map(([, value]) => value.replace(/^\/?(images\/|resume\.pdf)/, "/$1").replace(/&amp;/g, "&"));
  for (const [index, [, id, section]] of migrated.entries()) {
    const previous = legacy[index][2];
    // The legacy script inserts tool rows between the heading and this paragraph.
    const withoutToolRows = section.replace(/<ul id="tool-container"[^]*?<\/ul>/, "");
    assert.equal(readableText(withoutToolRows), readableText(previous), id);
    assert.deepEqual(values(withoutToolRows, "href"), values(previous, "href"), id);
    assert.deepEqual(values(section, "src"), values(previous, "src"), id);
  }

  const tools = Object.values(legacyTools).flatMap((group) => Object.values(group));
  assert.equal(tools.length, 26);
  assert.deepEqual(
    [...main(html).matchAll(/class="tool-link" id="([^"]+)-link" href="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
      .map(([, id, url, text]) => [id, url, readableText(text)]),
    tools.map(({ abbr, url, full }) => [abbr, url, full]),
  );
  assert.deepEqual(
    [...main(html).matchAll(/<span id="([^"]+)-name" class="tool-name">([^<]+)<\/span>/g)]
      .map(([, id, name]) => [id, readableText(name)]),
    tools.map(({ abbr, name }) => [abbr, name]),
  );
});

test("Home and Projects render the production catalog with its original selections and destinations", async () => {
  const legacyCatalog = runInNewContext("(" + legacyScript.match(/const projects = (\{[^]*?\n\});/)[1] + ")");
  const original = Object.values(legacyCatalog);
  const featured = [...legacyScript.matchAll(/addProject\(\s*projects\["([^"]+)"\]\.abbr/g)]
    .map(([, key]) => legacyCatalog[key].abbr);
  const stylesheet = await readFile(new URL("styles/main.css", dist), "utf8");
  const allProjects = await readFile(new URL("projects.html", dist), "utf8");
  const home = await readFile(new URL("index.html", dist), "utf8");
  const cards = (html) => [...html.matchAll(/<article id="([^"]+)-container" class="project-container"[^>]*>([^]*?)<\/article>/g)];

  assert.equal(original.length, 10);
  assert.equal(featured.length, 4);
  assert.deepEqual(cards(allProjects).map(([, id]) => id), original.map(({ abbr }) => abbr));
  assert.deepEqual(cards(home).map(([, id]) => id), featured);

  for (const [page, html, level] of [["Home", home, 3], ["Projects", allProjects, 2]]) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
    assert.equal(new Set(ids).size, ids.length, page);
    assert.equal(html.match(/<h1[ >]/g).length, 1, page);
    assert.doesNotMatch(html, /<noscript|onclick=|href="javascript:/i);
    assert.deepEqual(html.match(/<script\b[^>]*>/g), ['<script type="module" src="/scripts/reveal.js">']);
    assert.match(html, /aria-label="Primary"/);
    assert.match(html, /href="\/work">Work<\/a>/);

    for (const [, id, card] of cards(html)) {
      const project = original.find(({ abbr }) => abbr === id);
      const tag = `h${level}`;
      const title = card.match(new RegExp(`<${tag} id="${id}-title"[^>]*>([^]*?)</${tag}>`))[1];
      assert.equal(readableText(title), project.title, id);
      assert.ok(card.includes(`>${project.description}</p>`), id);
      assert.ok(card.includes(`>${project.tools}</p>`), id);
      const destinations = [...card.matchAll(/<a href="([^"]+)"[^>]* aria-label="([^"]+)"/g)];
      assert.deepEqual(destinations.map(([, href]) => href), [project.thumb, project.source, project.live], id);
      assert.ok(destinations.every(([, , label]) => readableText(label).includes(project.title)), id);
    }
  }

  const legacyCss = await readFile(new URL("styles/main.css", snapshot), "utf8");
  const thumbnailPaths = (css, id) => [...css.matchAll(new RegExp(
    `#${id}-thumbnail-preview\\{[^}]*background-image:url\\(["']?\\.\\./(images/thumbnails/[^"')]+)`,
    "g",
  ))].map(([, path]) => path);
  for (const { abbr } of original) {
    const paths = thumbnailPaths(legacyCss, abbr);
    assert.equal(paths.length, 4, abbr);
    assert.deepEqual(thumbnailPaths(stylesheet, abbr), paths, abbr);
    for (const path of paths) {
      assert.deepEqual(await readFile(new URL(path, dist)), await readFile(new URL(path, snapshot)), path);
    }
  }
});

test("Home preserves the visible production hero, introduction and skills", async () => {
  const home = await readFile(new URL("index.html", dist), "utf8");
  const original = stripComments(await readFile(new URL("index.html", snapshot), "utf8")).split("<body")[1];
  const landing = (page) => page.match(/<div id="header-container"[^>]*>([^]*?)<\/div>/)[1];
  const intro = (page) => page.match(/<section id="intro"[^>]*>([^]*?)<\/section>/)[1];
  assert.equal(readableText(landing(home)), readableText(landing(original)));
  assert.equal(readableText(intro(home)), readableText(intro(original)));
  const { additional, ...groups } = legacyTools;
  const skills = Object.values(groups).flatMap((group) => Object.values(group));
  assert.deepEqual(
    [...home.matchAll(/<span id="([^"]+)-name" class="tool-name">([^<]+)<\/span>/g)]
      .map(([, id, name]) => [id, readableText(name)]),
    skills.map(({ abbr, name }) => [abbr, name]),
  );
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
