import fs from "fs-extra";
import path from "node:path";
import { logger } from "@/utils/logger";
import {
  SERVERCN_CONFIG_FILE,
  SERVERCN_URL
} from "@/constants/app.constants";
import {
  EXPRESS_MERGE_SLOTS,
  type ExpressMergeArchitecture
} from "@/constants/express-merge-slots";
import { markerBeginLine } from "@/lib/merge-marker";
import type { Architecture, IServerCNConfig } from "@/types";

const README_UPGRADE_ANCHOR =
  "https://github.com/AkkalDhami/servercn/blob/main/packages/cli/README.md#existing-projects-upgrades--template-drift";

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
    for (const slug of slugs) {
      const line = markerBeginLine(slug);
      if (!text.includes(line)) {
        logger.warn(
          `Missing ${line} in ${file} — add it (see README, matrix: packages/cli/src/constants/express-merge-slots.ts) before using add ${slug} --merge.`
        );
      }
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
    "Missing lines mean `add <slug> --merge` cannot splice wiring until you add the same marker blocks as the current Express foundation templates (see `EXPRESS_MERGE_FOUNDATIONS` in express-merge-slots.ts)."
  );
  logger.break();
  await checkMergeMarkers(config, projectRoot);
  logger.break();
}
