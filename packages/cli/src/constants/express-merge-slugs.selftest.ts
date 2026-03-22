/**
 * Run: npx tsx src/constants/express-merge-slugs.selftest.ts (from packages/cli)
 */
import assert from "node:assert/strict";
import {
  EXPRESS_MERGE_SLUGS,
  isExpressMergeSlug
} from "./express-merge-slots";

for (const slug of EXPRESS_MERGE_SLUGS) {
  assert.equal(isExpressMergeSlug(slug), true);
}
assert.equal(isExpressMergeSlug("not-a-merge-slug"), false);

console.log("express-merge-slugs selftest: ok");
