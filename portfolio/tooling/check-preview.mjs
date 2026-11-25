import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const usage = "Usage: node tooling/check-preview.mjs --url <preview origin> --publish-dir <expected publish directory> [--case-sensitive]";
const { values } = parseArgs({
  options: {
    url: { type: "string" },
    "publish-dir": { type: "string" },
    "case-sensitive": { type: "boolean" },
    help: { type: "boolean" },
  },
});
if (values.help) {
  console.log(usage);
  process.exit(0);
}
assert.ok(values.url && values["publish-dir"], usage);
const origin = new URL(values.url);
assert.ok(["http:", "https:"].includes(origin.protocol) && origin.href === origin.origin + "/", usage);
const publish = resolve(values["publish-dir"]);
const urlPath = (file) => "/" + file.split("/").map(encodeURIComponent).join("/");
const read = (file, encoding) => readFile(join(publish, file), encoding);

async function request(route, status) {
  const response = await fetch(new URL(route, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, status, route);
  return response;
}

async function matchFile(route, file, type) {
  const expected = await read(file);
  const response = await request(route, 200);
  const contentType = response.headers.get("content-type") ?? "";
  assert.match(contentType, type, route);
  const actual = Buffer.from(await response.arrayBuffer());
  assert.ok(actual.equals(expected), `${route} response differs from ${file}`);
}

const html = /^text\/html\b/i;
const pages = [
  ["index.html", "/", "/index.html"],
  ["about.html", "/about", "/about.html"],
  ["projects.html", "/projects", "/projects.html"],
  ["work.html", "/work", "/work.html"],
  ["movie/index.html", "/movie", "/movie/", "/movie/watchlist", "/movie/detail/550/fight-club", "/movie/assets/__portfolio_qa_missing__.js"],
  ["productpage/index.html", "/productpage", "/productpage/", "/productpage/catalog/example", "/productpage/static/js/__portfolio_qa_missing__.js"],
  ["rawr-you-the-one/version-1.1/index.html", "/rawr-you-the-one/version-1.1/"],
  ["rawr-you-the-one/Version 1.1/index.html", "/rawr-you-the-one/Version%201.1/"],
  ["rawr-you-the-one/v2/index.html", "/rawr-you-the-one/v2/"],
  ["Lynda/CSS Essential Training - Resume/index.html", "/Lynda/CSS%20Essential%20Training%20-%20Resume"],
  ["Udemy/Web Developer Bootcamp/Javascript Projects/jQuery Projects/to-do-list/index.html",
    "/Udemy/Web%20Developer%20Bootcamp/Javascript%20Projects/jQuery%20Projects/to-do-list"],
  ["pokemon/index.html", "/pokemon"],
  ["retro/cloudchasers-v3/index.html", "/retro/cloudchasers-v3/"],
];
for (const [file, ...routes] of pages) {
  for (const route of routes) await matchFile(route, file, html);
}

const pdf = /^application\/pdf\b/i;
const css = /^text\/css\b/i;
const js = /^(?:application|text)\/javascript\b/i;
const image = /^image\//i;
for (const [file, type] of [
  ["resume.pdf", pdf], ["resume-old.pdf", pdf], ["archive/resume.pdf", pdf],
  ["styles/main.css", css], ["styles/archive/main.css", css],
  ["scripts/reveal.js", js], ["scripts/work.js", js],
  ["scripts/ga.js", js], ["scripts/archive/script.js", js],
  ["movie/vite.svg", image], ["productpage/images/jar-1.jpg", image],
  ["rawr-you-the-one/version-1.1/styles/global.css", css],
]) await matchFile(urlPath(file), file, type);

const work = await read("work.html", "utf8");
const samples = new Set([...work.matchAll(/\b(?:src|href)="\/(images\/samples\/[^"]+)"/g)]
  .map(([, file]) => decodeURIComponent(file)));
assert.ok(samples.size, "Work has no public screenshot or mockup links.");
for (const file of samples) await matchFile(urlPath(file), file, file.endsWith(".pdf") ? pdf : image);

// Read the hashed bundle names from the publish artifact under review.
for (const app of ["movie", "productpage"]) {
  const shell = await read(`${app}/index.html`, "utf8");
  const bundles = [...shell.matchAll(/\b(?:src|href)="([^"]+\.(?:css|js))"/g)]
    .map(([, route]) => route)
    .filter((route) => route.startsWith(`/${app}/`));
  for (const [extension, type] of [[".css", css], [".js", js]]) {
    const paths = bundles.filter((route) => route.endsWith(extension));
    assert.ok(paths.length, `/${app} has no ${extension} bundle in its entry page`);
    for (const route of paths) await matchFile(route, decodeURIComponent(route.slice(1)), type);
  }
}

for (const suffix of ["", "styles/global.css", "__portfolio_qa_missing__.html"]) {
  const route = suffix ? "/rawr/" + suffix : "/rawr";
  const response = await request(route, 301);
  const location = response.headers.get("location");
  await response.arrayBuffer();
  assert.ok(location, `${route} has no redirect location`);
  assert.equal(new URL(location, origin).href, new URL("/rawr-you-the-one/version-1.1/" + suffix, origin).href, route);
}

const missing = [
  "/__portfolio_qa_missing__.html",
  "/styles/__portfolio_qa_missing__.css",
  "/rawr-you-the-one/version-1.1/__portfolio_qa_missing__.html",
];
if (values["case-sensitive"]) {
  missing.push(
    urlPath(samples.values().next().value).replace("/images/", "/Images/"),
    "/rawr-you-the-one/VERSION-1.1/",
  );
}
for (const route of missing) {
  const response = await request(route, 404);
  await response.arrayBuffer();
}
console.log(`Preview passed for portfolio and sibling routes, ${samples.size} Work asset URLs, résumés, redirects, fallbacks, and errors.`);
