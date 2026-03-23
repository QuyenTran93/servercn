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

const emptyBlockNoBlankLine = `// @servercn:begin oauth-google
// @servercn:end oauth-google`;
const oauthFragment = `// @servercn:begin oauth-google
GOOGLE_CLIENT_ID: z.string(),
// @servercn:end oauth-google`;
const mergedEmpty = applyMarkerMerge(
  emptyBlockNoBlankLine,
  oauthFragment,
  "oauth-google"
);
assert.equal(mergedEmpty.ok, true);
if (mergedEmpty.ok) {
  assert.match(mergedEmpty.content, /GOOGLE_CLIENT_ID/);
}

const preserveLineBoundaryDest = `export const envSchema = z.object({
  CORS_ORIGIN: z.string(),

  // @servercn:begin oauth-google
  // @servercn:end oauth-google
});`;
const preserveLineBoundaryTemplate = `// @servercn:begin oauth-google
  GOOGLE_CLIENT_ID: z.string(),
// @servercn:end oauth-google`;
const mergedBoundary = applyMarkerMerge(
  preserveLineBoundaryDest,
  preserveLineBoundaryTemplate,
  "oauth-google"
);
assert.equal(mergedBoundary.ok, true);
if (mergedBoundary.ok) {
  assert.match(
    mergedBoundary.content,
    /CORS_ORIGIN: z\.string\(\),\n\n  \/\/ @servercn:begin oauth-google/
  );
}

const oauthDest = `const envSchema = z.object({
// @servercn:begin oauth-google

// @servercn:end oauth-google
// @servercn:begin oauth-github

// @servercn:end oauth-github
});`;
const googleTemplate = `// @servercn:begin oauth-google
GOOGLE_CLIENT_ID: z.string(),
GOOGLE_CLIENT_SECRET: z.string(),
GOOGLE_REDIRECT_URI: z.url(),
// @servercn:end oauth-google
`;
const githubTemplate = `// @servercn:begin oauth-github
GITHUB_CLIENT_ID: z.string(),
GITHUB_CLIENT_SECRET: z.string(),
GITHUB_REDIRECT_URI: z.url(),
// @servercn:end oauth-github
`;
const mergedGoogle = applyMarkerMerge(oauthDest, googleTemplate, "oauth-google");
assert.equal(mergedGoogle.ok, true);
if (mergedGoogle.ok) {
  const mergedGithub = applyMarkerMerge(
    mergedGoogle.content,
    githubTemplate,
    "oauth-github"
  );
  assert.equal(mergedGithub.ok, true);
  if (mergedGithub.ok) {
    assert.match(mergedGithub.content, /GOOGLE_CLIENT_ID/);
    assert.match(mergedGithub.content, /GITHUB_CLIENT_ID/);
  }
}

console.log("merge-marker selftest: ok");
