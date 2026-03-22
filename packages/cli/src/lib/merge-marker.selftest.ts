/**
 * Run: npx tsx src/lib/merge-marker.selftest.ts (from packages/cli)
 */
import assert from "node:assert/strict";
import {
  applyMarkerMerge,
  extractMarkerInner,
  isMergeOnlyFragment
} from "./merge-marker";

const slug = "rate-limiter";
const template = `// @servercn:begin rate-limiter
import x from "y";
app.use(x);
// @servercn:end rate-limiter
`;

assert.equal(isMergeOnlyFragment(template, slug), true);
assert.ok(extractMarkerInner(template, slug)?.includes("import x"));

const dest = `const app = express();
// USER CUSTOM — keep me
app.use(json());

// @servercn:begin rate-limiter

// @servercn:end rate-limiter

app.use(end);
`;

const merged = applyMarkerMerge(dest, template, slug);
assert.equal(merged.ok, true);
if (merged.ok) {
  assert.match(merged.content, /USER CUSTOM — keep me/);
  assert.match(merged.content, /import x from "y"/);
  assert.match(merged.content, /app\.use\(x\)/);
}

const bad = applyMarkerMerge("no markers here", template, slug);
assert.equal(bad.ok, false);

console.log("merge-marker selftest: ok");
