import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const portfolio = new URL("../", import.meta.url);
const lock = new URL("legacy-build/", import.meta.url);
const copy = await mkdtemp(join(tmpdir(), "portfolio-legacy-"));

try {
  // Start with sources only so a missing build step cannot pass using stale output.
  for (const input of [".babelrc", "sass", "scripts"]) {
    await cp(new URL(input, portfolio), join(copy, input), { recursive: true });
  }
  for (const input of ["package.json", "package-lock.json"]) {
    await cp(new URL(input, lock), join(copy, input));
  }

  for (const args of [["ci", "--include=dev", "--no-audit"], ["run", "build"]]) {
    const result = spawnSync("npm", args, { cwd: copy, stdio: "inherit" });
    if (result.error) throw result.error;
    assert.equal(result.status, 0, `Legacy npm ${args.join(" ")} failed in the disposable directory.`);
  }

  const outputs = { scripts: ["back-to-top.js", "script.js"], styles: ["main.css"] };
  for (const [directory, expected] of Object.entries(outputs)) {
    const output = join(copy, "public", directory);
    assert.deepEqual((await readdir(output)).sort(), expected);
    for (const file of expected) {
      const original = new URL(`public/${directory}/${file}`, portfolio);
      assert.ok((await readFile(join(output, file))).equals(await readFile(original)),
        `${directory}/${file} differs from the production snapshot.`);
    }
  }
  console.log("Legacy CSS and both scripts match the production snapshot byte for byte.");
} finally {
  await rm(copy, { force: true, recursive: true });
}
