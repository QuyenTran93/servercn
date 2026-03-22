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

/** Slug == marker id in // @servercn:begin|end <slug> */
export const EXPRESS_MERGE_SLUGS = [
  "rate-limiter",
  "security-header",
  "async-handler",
  "request-validator",
  "verify-auth-middleware"
] as const;

export type ExpressMergeSlug = (typeof EXPRESS_MERGE_SLUGS)[number];

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
      slugs: EXPRESS_MERGE_SLUGS
    }
  ],
  feature: [
    {
      file: "src/app.ts",
      slugs: ["rate-limiter", "security-header"]
    },
    {
      file: "src/routes/index.ts",
      slugs: ["request-validator", "async-handler", "verify-auth-middleware"]
    }
  ]
};

export function isExpressMergeSlug(s: string): s is ExpressMergeSlug {
  return (EXPRESS_MERGE_SLUGS as readonly string[]).includes(s);
}
