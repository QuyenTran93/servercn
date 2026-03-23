import assert from "node:assert/strict";
import {
  EXPRESS_COMPONENT_DEPENDENCY_RULES,
  EXPRESS_DEPENDENCY_RULE_SLUGS,
  getExpressDependencySentinelPaths
} from "./express-component-dependency-rules";

for (const slug of EXPRESS_DEPENDENCY_RULE_SLUGS) {
  assert.ok(slug in EXPRESS_COMPONENT_DEPENDENCY_RULES);
}

assert.deepEqual(EXPRESS_COMPONENT_DEPENDENCY_RULES.rbac.requiresAll, [
  "jwt-utils"
]);
assert.deepEqual(EXPRESS_COMPONENT_DEPENDENCY_RULES.rbac.conflictsWith, [
  "verify-auth-middleware"
]);
assert.deepEqual(
  getExpressDependencySentinelPaths("mvc")["request-validator"],
  ["src/middlewares/validate-request.ts"]
);
assert.deepEqual(
  getExpressDependencySentinelPaths("feature")["request-validator"],
  ["src/shared/middlewares/validate-request.ts"]
);

console.log("express-component-dependency-rules selftest: ok");

