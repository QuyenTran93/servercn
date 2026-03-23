/**
 * Single source of truth for Express merge markers (`add <slug> --merge`).
 * Keep in sync: Express foundation templates that ship this slot layout, component merge fragments, README, contributing.md.
 */
/** Foundations under `packages/templates/node/express/foundation/` with the same merge slot paths (mvc + feature). */
export const EXPRESS_MERGE_FOUNDATIONS = [
  "express-starter",
  "mongoose-starter",
  "drizzle-pg-starter",
  "drizzle-mysql-starter",
  "prisma-mongodb-starter"
] as const;
export type ExpressMergeArchitecture = "mvc" | "feature";

/** Marker ids used in // @servercn:begin|end <marker-id> */
export const EXPRESS_MERGE_SLUGS = [
  "rate-limiter",
  "security-header",
  "async-handler",
  "request-validator",
  "verify-auth-middleware",
  "oauth-google",
  "oauth-github",
  "rbac",
  "jwt-utils",
  "file-upload-cloudinary",
  "file-upload-imagekit"
] as const;

export type ExpressMergeSlug = (typeof EXPRESS_MERGE_SLUGS)[number];
const EXPRESS_APP_ROUTE_MERGE_SLUGS: readonly ExpressMergeSlug[] = [
  "rate-limiter",
  "security-header",
  "request-validator",
  "rbac",
  "async-handler",
  "verify-auth-middleware"
];
/** Env file markers (order: OAuth providers, then rbac, jwt, upload variants). */
const EXPRESS_ENV_MERGE_SLUGS: readonly ExpressMergeSlug[] = [
  "oauth-google",
  "oauth-github",
  "rbac",
  "jwt-utils",
  "file-upload-cloudinary",
  "file-upload-imagekit"
];

/** Components that support add <slug> --merge on express foundations. */
export const EXPRESS_MERGE_COMPONENT_SLUGS = [
  "rate-limiter",
  "security-header",
  "async-handler",
  "request-validator",
  "verify-auth-middleware",
  "oauth",
  "rbac",
  "jwt-utils",
  "file-upload"
] as const;
export type ExpressMergeComponentSlug =
  (typeof EXPRESS_MERGE_COMPONENT_SLUGS)[number];

export type ExpressMergeSlot = {
  /** Path relative to project root (e.g. src/app.ts) */
  file: string;
  slugs: readonly ExpressMergeSlug[];
};

/**
 * For each architecture, which project files must contain which marker pairs.
 * Feature splits app-level vs router-level wiring.
 */
export const EXPRESS_MERGE_SLOTS: Record<
  ExpressMergeArchitecture,
  readonly ExpressMergeSlot[]
> = {
  mvc: [
    {
      file: "src/app.ts",
      slugs: EXPRESS_APP_ROUTE_MERGE_SLUGS
    },
    {
      file: "src/configs/env.ts",
      slugs: EXPRESS_ENV_MERGE_SLUGS
    }
  ],
  feature: [
    {
      file: "src/app.ts",
      slugs: ["rate-limiter", "security-header"]
    },
    {
      file: "src/routes/index.ts",
      slugs: ["request-validator", "rbac", "async-handler", "verify-auth-middleware"]
    },
    {
      file: "src/shared/configs/env.ts",
      slugs: EXPRESS_ENV_MERGE_SLUGS
    }
  ]
};

export function isExpressMergeComponentSlug(
  s: string
): s is ExpressMergeComponentSlug {
  return (EXPRESS_MERGE_COMPONENT_SLUGS as readonly string[]).includes(s);
}

export function isExpressMergeMarkerSlug(s: string): s is ExpressMergeSlug {
  return (EXPRESS_MERGE_SLUGS as readonly string[]).includes(s);
}

/**
 * Resolve marker ids for merge flow. OAuth is variant-aware and maps to provider markers.
 */
export function resolveExpressMergeMarkerIds(
  componentSlug: string,
  selectedProvider?: string
): readonly ExpressMergeSlug[] {
  if (componentSlug === "oauth") {
    if (selectedProvider === "google") return ["oauth-google"];
    if (selectedProvider === "github") return ["oauth-github"];
    if (selectedProvider === "google-github") {
      return ["oauth-google", "oauth-github"];
    }
    return [];
  }
  if (componentSlug === "file-upload") {
    if (selectedProvider === "cloudinary") return ["file-upload-cloudinary"];
    if (selectedProvider === "imagekit") return ["file-upload-imagekit"];
    return [];
  }
  if (isExpressMergeMarkerSlug(componentSlug)) {
    return [componentSlug];
  }
  return [];
}
