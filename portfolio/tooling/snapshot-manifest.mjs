import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, readlink } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({ allowPositionals: true, options: { help: { type: "boolean" } } });
const usage = "Usage: node tooling/snapshot-manifest.mjs [directory]";
if (values.help) {
  console.log(usage);
  console.log("Defaults to the portfolio's public directory. Writes JSON Lines to stdout.");
  process.exit(0);
}
if (positionals.length > 1) throw new Error(usage);

const root = positionals.length
  ? resolve(positionals[0])
  : fileURLToPath(new URL("../public/", import.meta.url));

async function printManifest(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((first, second) => {
    if (first.name === second.name) return 0;
    return first.name < second.name ? -1 : 1;
  });

  for (const entry of entries) {
    const path = join(directory, entry.name);
    const record = { path: relative(root, path).split(sep).join("/") };

    if (entry.isDirectory()) {
      await printManifest(path);
    } else if (entry.isSymbolicLink()) {
      console.log(JSON.stringify({ ...record, symlink: await readlink(path) }));
    } else if (entry.isFile()) {
      const hash = createHash("sha256");
      for await (const chunk of createReadStream(path)) hash.update(chunk);
      console.log(JSON.stringify({ ...record, sha256: hash.digest("hex") }));
    } else {
      throw new Error(`Unsupported entry in snapshot: ${record.path}`);
    }
  }
}

await printManifest(root);
