import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

export const viewports = [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

export async function launchBrowserQA(script, artifactDirectory) {
  const { values } = parseArgs({
    options: {
      url: { type: "string" },
      "tool-root": { type: "string" },
      executable: { type: "string" },
      out: { type: "string" },
      help: { type: "boolean" },
    },
  });
  const usage = `node tooling/${script} --url <preview origin> [--tool-root <npm prefix>] [--executable <Chromium path>] [--out <artifact directory>]`;
  if (values.help) {
    console.log(usage);
    process.exit(0);
  }
  assert.ok(values.url, usage);
  const origin = new URL(values.url);
  const output = values.out
    ? resolve(values.out)
    : fileURLToPath(new URL(`../.baseline/${artifactDirectory}/`, import.meta.url));

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

  async function capture(page, name) {
    await page.evaluate(() => document.fonts.ready);
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

  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: values.executable });
  return { browser, origin, output, capture, scan };
}
