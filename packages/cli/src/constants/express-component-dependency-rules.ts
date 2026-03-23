import type { Architecture } from "@/types";

export const EXPRESS_DEPENDENCY_RULE_SLUGS = [
  "request-validator",
  "verify-auth-middleware",
  "rbac",
  "jwt-utils"
] as const;

export type ExpressDependencyRuleSlug =
  (typeof EXPRESS_DEPENDENCY_RULE_SLUGS)[number];

export type ExpressDependencyRule = {
  requiresAll?: readonly ExpressDependencyRuleSlug[];
  conflictsWith?: readonly ExpressDependencyRuleSlug[];
  /**
   * Soft rule: warn when these slugs are already present because add order
   * tends to produce overlap/skip risk.
   */
  warnIfPresent?: readonly ExpressDependencyRuleSlug[];
};

export const EXPRESS_COMPONENT_DEPENDENCY_RULES: Record<
  ExpressDependencyRuleSlug,
  ExpressDependencyRule
> = {
  "request-validator": {
    warnIfPresent: ["rbac", "verify-auth-middleware"]
  },
  "verify-auth-middleware": {
    conflictsWith: ["rbac"],
    warnIfPresent: ["request-validator"]
  },
  rbac: {
    requiresAll: ["jwt-utils"],
    conflictsWith: ["verify-auth-middleware"],
    warnIfPresent: ["request-validator"]
  },
  "jwt-utils": {}
};

const MVC_SENTINELS: Record<ExpressDependencyRuleSlug, readonly string[]> = {
  "request-validator": ["src/middlewares/validate-request.ts"],
  "verify-auth-middleware": ["src/middlewares/verify-auth.ts"],
  rbac: ["src/middlewares/authorize-role.ts"],
  "jwt-utils": ["src/utils/jwt.ts"]
};

const FEATURE_SENTINELS: Record<ExpressDependencyRuleSlug, readonly string[]> = {
  "request-validator": ["src/shared/middlewares/validate-request.ts"],
  "verify-auth-middleware": ["src/shared/middlewares/verify-auth.ts"],
  rbac: ["src/shared/middlewares/authorize-role.ts"],
  "jwt-utils": ["src/shared/utils/jwt.ts"]
};

export function getExpressDependencySentinelPaths(
  arch: Architecture
): Record<ExpressDependencyRuleSlug, readonly string[]> {
  return arch === "feature" ? FEATURE_SENTINELS : MVC_SENTINELS;
}

