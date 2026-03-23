/**
 * Ensures every Express foundation with merge slots still contains marker pairs.
 * Run: npm run test:express-merge-foundation (from packages/cli)
 */
import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXPRESS_MERGE_FOUNDATIONS,
  EXPRESS_MERGE_SLOTS,
  type ExpressMergeArchitecture
} from "@/constants/express-merge-slots";
import { markerBeginLine } from "./merge-marker";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REPO_ROOT = path.resolve(__dirname, "../../../..");
const FOUNDATIONS_ROOT = path.join(
  REPO_ROOT,
  "packages/templates/node/express/foundation"
);

async function main() {
  for (const foundation of EXPRESS_MERGE_FOUNDATIONS) {
    const foundationDir = path.join(FOUNDATIONS_ROOT, foundation);
    assert.ok(
      await fs.pathExists(foundationDir),
      `Missing foundation folder: ${foundationDir}`
    );
    for (const arch of ["mvc", "feature"] as ExpressMergeArchitecture[]) {
      const archRoot = path.join(foundationDir, arch);
      assert.ok(
        await fs.pathExists(archRoot),
        `${foundation}: missing ${arch}/`
      );
      const slots = EXPRESS_MERGE_SLOTS[arch];
      for (const { file, slugs } of slots) {
        const abs = path.join(archRoot, ...file.split("/"));
        assert.ok(await fs.pathExists(abs), `${foundation}/${arch}/${file}`);
        const text = await fs.readFile(abs, "utf8");
        for (const slug of slugs) {
          const line = markerBeginLine(slug);
          assert.ok(
            text.includes(line),
            `${foundation}/${arch}/${file} must include ${line}`
          );
        }
      }
    }
  }
  console.log("express-merge-foundation selftest: ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
