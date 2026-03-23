/**
 * Run: npx tsx src/constants/express-merge-slugs.selftest.ts (from packages/cli)
 */
import assert from "node:assert/strict";
import {
  EXPRESS_MERGE_COMPONENT_SLUGS,
  EXPRESS_MERGE_SLUGS,
  isExpressMergeComponentSlug,
  resolveExpressMergeMarkerIds
} from "./express-merge-slots";

for (const slug of EXPRESS_MERGE_SLUGS) {
  assert.ok(slug.length > 0);
}
for (const slug of EXPRESS_MERGE_COMPONENT_SLUGS) {
  assert.equal(isExpressMergeComponentSlug(slug), true);
}
assert.equal(isExpressMergeComponentSlug("not-a-merge-slug"), false);
assert.deepEqual(resolveExpressMergeMarkerIds("oauth", "google"), [
  "oauth-google"
]);
assert.deepEqual(resolveExpressMergeMarkerIds("oauth", "github"), [
  "oauth-github"
]);
assert.deepEqual(resolveExpressMergeMarkerIds("oauth", "google-github"), [
  "oauth-google",
  "oauth-github"
]);
assert.deepEqual(resolveExpressMergeMarkerIds("oauth", "unknown"), []);

assert.deepEqual(resolveExpressMergeMarkerIds("file-upload", "cloudinary"), [
  "file-upload-cloudinary"
]);
assert.deepEqual(resolveExpressMergeMarkerIds("file-upload", "imagekit"), [
  "file-upload-imagekit"
]);
assert.deepEqual(resolveExpressMergeMarkerIds("file-upload", "unknown"), []);

assert.deepEqual(resolveExpressMergeMarkerIds("rbac"), ["rbac"]);
assert.deepEqual(resolveExpressMergeMarkerIds("jwt-utils"), ["jwt-utils"]);

console.log("express-merge-slugs selftest: ok");
