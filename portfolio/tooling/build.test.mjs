import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const snapshot = new URL("../public/", import.meta.url);

test("the proof emits only the expected top-level output", async () => {
  assert.deepEqual((await readdir(dist)).sort(), ["images", "resume.pdf", "styles", "work.html"]);
  assert.deepEqual(await readdir(new URL("styles/", dist)), ["main.css"]);
});

test("Work renders its navigation, case study, and footer without a script", async () => {
  const html = await readFile(new URL("work.html", dist), "utf8");
  assert.match(html, /<h1>Work Portfolio<\/h1>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.kylejackson\.dev\/work"/);
  assert.match(html, /aria-label="Primary"/);
  assert.match(html, /id="work-toc"/);
  assert.match(html, /href="#project_agile"/);
  assert.match(html, /id="project_agile"/);
  assert.match(html, /id="contact-heading"/);
  assert.doesNotMatch(html, /<script\b/);
  for (const [, asset] of html.matchAll(/(?:href|src)="\/(images\/[^"]+)"/g)) {
    const bytes = await readFile(new URL(asset, dist));
    assert.deepEqual(bytes, await readFile(new URL(asset, snapshot)), asset);
  }
  assert.deepEqual(await readFile(new URL("resume.pdf", dist)), await readFile(new URL("resume.pdf", snapshot)));
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
