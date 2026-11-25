import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { constants } from "node:fs";
import { copyFile, lstat, mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const portfolio = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(portfolio, "dist");
const publicRoot = resolve(portfolio, "public");
const modernFiles = [
  "index.html", "about.html", "projects.html", "work.html", "resume.pdf", "resume-old.pdf",
  "scripts/reveal.js", "scripts/work.js", "styles/main.css",
];
const carriedFiles = [
  "archive/resume.pdf", "scripts/back-to-top.js", "scripts/ga.js", "scripts/script.js",
  "scripts/archive/back-to-top.js", "scripts/archive/script.js", "styles/archive/main.css",
];
const carriedTrees = ["Lynda", "Udemy", "movie", "pokemon", "productpage", "rawr-you-the-one", "retro"];
const requiredCarried = [
  ...carriedFiles,
  "Lynda/CSS Essential Training - Resume/index.html",
  "Udemy/Web Developer Bootcamp/Javascript Projects/jQuery Projects/to-do-list/index.html",
  "movie/index.html", "pokemon/index.html", "productpage/index.html",
  "rawr-you-the-one/version-1.1/index.html", "retro/cloudchasers-v3/index.html",
];
const isImage = (path) => path.startsWith("images/");
const snapshotFiles = execFileSync("git", [
  "ls-tree", "-r", "-z", "--name-only", "HEAD", "--", "public/",
], { cwd: portfolio, encoding: "utf8" }).split("\0").filter(Boolean).map((path) => path.slice("public/".length));
assert.ok(snapshotFiles.length, "Commit the production snapshot before composing a preview.");

const entries = new Map();
const destinations = new Map();
function stage(path, source) {
  for (let destination = path; destination !== "."; destination = dirname(destination)) {
    const key = destination.normalize("NFC").toLowerCase();
    const previous = destinations.get(key);
    assert.ok(!previous || previous === destination, `Case or Unicode collision: ${previous} and ${destination}`);
    destinations.set(key, destination);
  }
  assert.ok(!entries.has(path), `Duplicate preview file: ${path}`);
  entries.set(path, source);
}

assert.ok((await lstat(dist)).isDirectory(), "Build a regular portfolio dist directory first.");
for (const entry of await readdir(dist, { recursive: true, withFileTypes: true })) {
  const path = relative(dist, join(entry.parentPath, entry.name)).split(sep).join("/");
  if (entry.isDirectory()) {
    assert.ok(path === "images" || isImage(path) || path === "scripts" || path === "styles",
      `Unexpected modern directory: ${path}`);
  } else {
    assert.ok(entry.isFile() && (modernFiles.includes(path) || isImage(path)), `Unexpected modern output: ${path}`);
    stage(path, dist);
  }
}
for (const path of modernFiles) assert.ok(entries.has(path), `Missing modern output: ${path}`);
for (const path of snapshotFiles) {
  if (modernFiles.includes(path) || isImage(path)) {
    assert.ok(entries.has(path), `Missing replacement for published path: ${path}`);
  } else {
    assert.ok(carriedFiles.includes(path) || carriedTrees.some((tree) => path.startsWith(tree + "/")),
      `Unexpected published path: ${path}`);
    assert.ok((await lstat(join(publicRoot, path))).isFile(), `Expected a regular published file: ${path}`);
    stage(path, publicRoot);
  }
}
for (const path of requiredCarried) assert.equal(entries.get(path), publicRoot, `Missing published file: ${path}`);
for (const path of entries.keys()) {
  assert.ok(!entries.has(dirname(path)), `File and directory collision: ${path}`);
}

const target = await mkdtemp(join(tmpdir(), "portfolio-preview-"));
try {
  for (const [path, source] of entries) {
    const destination = join(target, path);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(join(source, path), destination, constants.COPYFILE_EXCL);
  }
  console.log(target);
} catch (error) {
  await rm(target, { recursive: true, force: true });
  throw error;
}
