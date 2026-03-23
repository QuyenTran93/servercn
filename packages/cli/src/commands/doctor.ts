import fs from "fs-extra";
import path from "node:path";
import { logger } from "@/utils/logger";
import {
  SERVERCN_CONFIG_FILE,
  SERVERCN_URL
} from "@/constants/app.constants";
import {
  EXPRESS_MERGE_CRITICAL_PATHS,
  EXPRESS_MERGE_SLOTS,
  type ExpressMergeSlug,
  type ExpressMergeArchitecture
} from "@/constants/express-merge-slots";
import { markerBeginLine, markerEndLine } from "@/lib/merge-marker";
import { normalizeEol } from "@/utils/normalize-eol";
import type { Architecture, IServerCNConfig } from "@/types";
import { detectInstalledExpressDependencySlugs } from "@/lib/express-component-dependency";
import { EXPRESS_COMPONENT_DEPENDENCY_RULES } from "@/constants/express-component-dependency-rules";

const README_UPGRADE_ANCHOR =
  "https://github.com/AkkalDhami/servercn/blob/main/packages/cli/README.md#existing-projects-upgrades--template-drift";

function addCommandForMarker(slug: ExpressMergeSlug): string {
  if (slug === "oauth-google" || slug === "oauth-github") {
    return "servercn add oauth --merge";
  }
  if (slug === "file-upload-cloudinary" || slug === "file-upload-imagekit") {
    return "servercn add file-upload --merge";
  }
  return `servercn add ${slug} --merge`;
}

function hasTrimmedLine(text: string, needle: string): boolean {
  const n = normalizeEol(text);
  return n.split("\n").some(line => line.trim() === needle);
}

/** True when both begin and end marker lines exist (trimmed line match). */
function markerPairPresent(text: string, slug: ExpressMergeSlug): boolean {
  return (
    hasTrimmedLine(text, markerBeginLine(slug)) &&
    hasTrimmedLine(text, markerEndLine(slug))
  );
}

function hasLegacyOAuthMarkerBlock(text: string): boolean {
  const n = normalizeEol(text);
  return n.split("\n").some(line => line.trim() === "// @servercn:begin oauth");
}

const OAUTH_ENV_MARKER_SLUGS: readonly ExpressMergeSlug[] = [
  "oauth-google",
  "oauth-github"
];

function isExpressEnvMergeFile(file: string): boolean {
  return (
    file === "src/configs/env.ts" || file === "src/shared/configs/env.ts"
  );
}

function printStaticGuide() {
  logger.section("Post-init projects & upstream changes");
  logger.log(
    "Your scaffold is a snapshot from when you ran `init`. The CLI and registry evolve separately."
  );
  logger.break();
  logger.log("When to run `doctor`:");
  logger.log(
    "  • After upgrading the CLI or pulling new docs, or when `add` left wiring missing."
  );
  logger.log(
    "  • For Express + merge-capable slugs, doctor checks that `// @servercn:begin|end` lines exist in the files expected for your architecture (see README / express-merge-slots.ts)."
  );
  logger.break();
  logger.log("Typical situations:");
  logger.log(
    "  • CLI-only bump (bugfixes): usually no repo changes unless you hit a specific fix."
  );
  logger.log(
    "  • Registry/template updates (new markers, `--merge`, paths): read release notes; then copy markers from docs, use `add --merge`, or `--force` / new project."
  );
  logger.log(
    "  • Foundation changes: no automatic sync — diff manually or start a fresh project."
  );
  logger.break();
  logger.info(`Full matrix: ${README_UPGRADE_ANCHOR}`);
  logger.info(`Installation / upgrades: ${SERVERCN_URL}/docs/installation`);
  logger.break();
}

async function checkMergeMarkers(config: IServerCNConfig, projectRoot: string) {
  if (config.stack?.framework !== "express") {
    logger.muted("Not an Express stack; merge marker checks skipped.");
    return;
  }
  const rawArch = (config.stack?.architecture ?? "mvc") as Architecture;
  const arch: ExpressMergeArchitecture =
    rawArch === "feature" ? "feature" : "mvc";
  const slots = EXPRESS_MERGE_SLOTS[arch];

  for (const { file, slugs } of slots) {
    const filePath = path.join(projectRoot, ...file.split("/"));
    if (!(await fs.pathExists(filePath))) {
      logger.muted(`No ${file} found; skipping marker checks for that file.`);
      continue;
    }
    const text = await fs.readFile(filePath, "utf8");

    if (isExpressEnvMergeFile(file) && slugs.includes("oauth-google")) {
      const oauthMissing = OAUTH_ENV_MARKER_SLUGS.filter(
        s => slugs.includes(s) && !markerPairPresent(text, s)
      );
      if (oauthMissing.length > 0) {
        const legacy = hasLegacyOAuthMarkerBlock(text);
        const missingDesc = oauthMissing
          .map(s => `${markerBeginLine(s)} / ${markerEndLine(s)}`)
          .join("; ");
        logger.warn(
          `OAuth env merge markers incomplete in ${file}. Missing or incomplete pair(s): ${missingDesc}. Add empty provider blocks inside envSchema (see current express-starter foundation), then run \`servercn add oauth --merge\` (use \`--local\` if templates are not published yet). Matrix: packages/cli/src/constants/express-merge-slots.ts.`
        );
        if (legacy) {
          logger.warn(
            `Legacy \`// @servercn:begin oauth\` still present in ${file} — replace with separate \`oauth-google\` and \`oauth-github\` marker pairs (warn-only, no auto-convert).`
          );
        }
      }
      const otherEnvSlugs = slugs.filter(
        s => !OAUTH_ENV_MARKER_SLUGS.includes(s)
      );
      for (const slug of otherEnvSlugs) {
        if (markerPairPresent(text, slug)) {
          continue;
        }
        const begin = markerBeginLine(slug);
        const end = markerEndLine(slug);
        const hasBegin = hasTrimmedLine(text, begin);
        const hasEnd = hasTrimmedLine(text, end);
        const detail =
          hasBegin && !hasEnd
            ? `Missing ${end} (begin exists).`
            : !hasBegin && hasEnd
              ? `Missing ${begin} (end exists).`
              : `Missing ${begin} and ${end}.`;
        logger.warn(
          `${detail} File: ${file}. Fix before ${addCommandForMarker(slug)}. See README / express-merge-slots.ts.`
        );
      }
      continue;
    }

    for (const slug of slugs) {
      if (markerPairPresent(text, slug)) {
        continue;
      }
      const begin = markerBeginLine(slug);
      const end = markerEndLine(slug);
      const hasBegin = hasTrimmedLine(text, begin);
      const hasEnd = hasTrimmedLine(text, end);
      const detail =
        hasBegin && !hasEnd
          ? `Missing ${end} (begin exists).`
          : !hasBegin && hasEnd
            ? `Missing ${begin} (end exists).`
            : `Missing ${begin} and ${end}.`;
      logger.warn(
        `${detail} File: ${file}. Fix before ${addCommandForMarker(slug)}. See README / express-merge-slots.ts.`
      );
    }
  }

  const criticalSlugs = Object.entries(EXPRESS_MERGE_CRITICAL_PATHS).filter(
    ([, paths]) => paths.length > 0
  );
  for (const [componentSlug, criticalPaths] of criticalSlugs) {
    for (const criticalPath of criticalPaths) {
      const absPath = path.join(projectRoot, ...criticalPath.split("/"));
      if (!(await fs.pathExists(absPath))) {
        continue;
      }
      const text = await fs.readFile(absPath, "utf8");
      const markerSlug = componentSlug as ExpressMergeSlug;
      if (markerPairPresent(text, markerSlug)) {
        continue;
      }
      logger.warn(
        `Merge-critical path ${criticalPath} exists but is missing marker pair for '${componentSlug}'. Future ${addCommandForMarker(markerSlug)} may skip wiring unless this file uses merge markers for that slug.`
      );
    }
  }
}

async function checkExpressDependencyRisks(
  config: IServerCNConfig,
  projectRoot: string
) {
  if (config.stack?.framework !== "express") return;
  const installed = await detectInstalledExpressDependencySlugs(
    projectRoot,
    config.stack.architecture
  );
  for (const [slug, rule] of Object.entries(EXPRESS_COMPONENT_DEPENDENCY_RULES)) {
    if (!installed.has(slug as keyof typeof EXPRESS_COMPONENT_DEPENDENCY_RULES)) {
      continue;
    }
    const missing = (rule.requiresAll ?? []).filter(dep => !installed.has(dep));
    if (missing.length > 0) {
      logger.warn(
        `Dependency risk: '${slug}' is present but missing required component(s): ${missing.join(", ")}.`
      );
    }
    const conflicts = (rule.conflictsWith ?? []).filter(dep => installed.has(dep));
    if (conflicts.length > 0) {
      logger.warn(
        `Conflict risk: '${slug}' overlaps with installed component(s): ${conflicts.join(", ")}.`
      );
    }
  }
}

export async function doctor() {
  printStaticGuide();

  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);
  if (!(await fs.pathExists(configPath))) {
    logger.muted("No servercn.config.json in this directory — marker checks skipped.");
    logger.break();
    return;
  }

  const config = (await fs.readJSON(configPath)) as IServerCNConfig;
  const rootDir = config.project?.rootDir ?? ".";
  const projectRoot = path.resolve(process.cwd(), rootDir);

  logger.section("Merge marker sanity (Express)");
  logger.log(
    "Missing or broken marker pairs mean `servercn add <slug> --merge` cannot splice wiring. Env file merges use multiple marker pairs inside envSchema (OAuth providers, rbac, jwt-utils, file-upload variants — see `EXPRESS_MERGE_FOUNDATIONS` + express-merge-slots.ts). Doctor also checks dependency/order risks for overlap-prone Express components."
  );
  logger.break();
  await checkMergeMarkers(config, projectRoot);
  await checkExpressDependencyRisks(config, projectRoot);
  logger.break();
}
